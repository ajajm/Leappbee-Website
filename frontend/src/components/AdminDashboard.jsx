import React, { useState, useEffect } from 'react';
import { parseVideoUrl } from '../utils/videoParser';

const API_BASE = 'http://localhost:5000/api';

const LONG_CATS  = ['Vlogs', 'Explainers', 'Podcasts', 'Ads', 'Documentaries'];
const SHORT_CATS = ['TikTok/Reels', 'Motion Graphics', 'Gaming Clips', 'Shorts'];

export default function AdminDashboard({ token, onLogout, onBack }) {
  const [activeTab, setActiveTab] = useState('videos');
  const [siteConfig, setSiteConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(false);

  const [videos,    setVideos]    = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [title,     setTitle]     = useState('');
  const [type,      setType]      = useState('long-form');
  const [category,  setCategory]  = useState(LONG_CATS[0]);
  const [url,       setUrl]       = useState('');

  const authHdr = { 'Authorization': `Bearer ${token}` };
  const jsonHdr = { ...authHdr, 'Content-Type': 'application/json' };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/videos`);
      if (!res.ok) throw new Error('Failed to fetch videos.');
      setVideos(await res.json());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${API_BASE}/config`);
      if (res.ok) {
        setSiteConfig(await res.json());
      }
    } catch (err) { console.error('Failed to load config'); }
  };

  useEffect(() => { fetchVideos(); fetchConfig(); }, []);
  useEffect(() => { setCategory(type === 'long-form' ? LONG_CATS[0] : SHORT_CATS[0]); }, [type]);

  const resetForm = () => {
    setIsEditing(null); setTitle(''); setType('long-form');
    setCategory(LONG_CATS[0]); setUrl(''); setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !url) { setError('Title and URL are required.'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const body = JSON.stringify({ title, type, category, url });
      const res  = isEditing
        ? await fetch(`${API_BASE}/videos/${isEditing}`, { method:'PUT',    headers:jsonHdr, body })
        : await fetch(`${API_BASE}/videos`,               { method:'POST',   headers:jsonHdr, body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save.');
      setSuccess(isEditing ? 'Video updated!' : 'Video added!');
      resetForm(); fetchVideos();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleEdit = (v) => {
    setIsEditing(v._id); setTitle(v.title); setType(v.type);
    setCategory(v.category); setUrl(v.url);
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    setLoading(true); setError(''); setSuccess('');
    try {
      const res  = await fetch(`${API_BASE}/videos/${id}`, { method:'DELETE', headers:authHdr });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete.');
      setSuccess('Video deleted.'); fetchVideos();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleMove = async (idx, dir) => {
    const arr = [...videos];
    const to  = idx + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[idx], arr[to]] = [arr[to], arr[idx]];
    setVideos(arr);
    try {
      const res  = await fetch(`${API_BASE}/videos/bulk/reorder`, {
        method:'PUT', headers:jsonHdr,
        body: JSON.stringify({ ids: arr.map(v => v._id) }),
      });
      if (!res.ok) throw new Error();
    } catch { setError('Failed to save order.'); fetchVideos(); }
  };

  const handleSaveConfig = async (updatedConfig) => {
    setConfigLoading(true); setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_BASE}/config`, {
        method: 'PUT', headers: jsonHdr, body: JSON.stringify(updatedConfig)
      });
      if (!res.ok) {
        const errData = await res.json().catch(()=>({}));
        throw new Error(errData.message || 'Failed to save config');
      }
      setSiteConfig(await res.json());
      setSuccess('Configuration saved successfully!');
    } catch (err) { setError(err.message); }
    finally { setConfigLoading(false); }
  };

  return (
    <div style={{ background:'var(--surface)', minHeight:'100vh', paddingTop:'calc(var(--nav-h) + 24px)', paddingBottom:'64px' }}>
      <div className="admin-wrap">

        {/* Header */}
        <div className="admin-top">
          <div>
            <button
              onClick={onBack}
              style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'var(--taupe)', marginBottom:10, background:'none', border:'none', cursor:'pointer' }}
            >
              ← Back to website
            </button>
            <h1 className="admin-heading">Agency Dashboard</h1>
          </div>
          <button
            onClick={onLogout}
            className="btn-secondary"
            style={{ height:44, padding:'0 20px', fontSize:14 }}
          >
            Log out
          </button>
        </div>

        <div className="admin-tabs" style={{ display: 'flex', gap: 24, marginBottom: 24, borderBottom: '1px solid var(--border)', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: 4 }}>
          {['videos', 'links', 'services', 'testimonials', 'faqs'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setError(''); setSuccess(''); }}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid var(--cream)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--cream)' : 'var(--taupe)', padding: '12px 0', cursor: 'pointer', textTransform: 'capitalize', fontWeight: 500 }}>
              {tab}
            </button>
          ))}
        </div>

        {error   && <div className="error-box"   style={{ marginBottom:20 }}>{error}</div>}
        {success && <div className="success-box" style={{ marginBottom:20 }}>{success}</div>}

        {activeTab === 'videos' && (
          <div className="admin-layout">
            <div className="admin-panel">
              <div className="admin-panel-title">{isEditing ? 'Edit Video' : 'Add Video'}</div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" type="text" value={title}
                    onChange={e => setTitle(e.target.value)} placeholder="e.g. Creator Vlog Showcase" disabled={loading}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={type} onChange={e => setType(e.target.value)} disabled={loading}>
                    <option value="long-form">Long Form (16:9)</option>
                    <option value="short-form">Short Form (9:16)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} disabled={loading}>
                    {(type === 'long-form' ? LONG_CATS : SHORT_CATS).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom:28 }}>
                  <label className="form-label">Video URL (YouTube or Google Drive)</label>
                  <input className="form-input" type="text" value={url}
                    onChange={e => setUrl(e.target.value)} placeholder="Paste YouTube / Drive link" disabled={loading}/>
                </div>

                <div style={{ display:'flex', gap:12 }}>
                  <button type="submit" className="btn-primary" style={{ flex:1, justifyContent:'center', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                    {isEditing ? 'Update' : '+ Add to Portfolio'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={resetForm} className="btn-secondary" style={{ flex:1, justifyContent:'center' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-title">Portfolio ({videos.length} videos)</div>
              {videos.length === 0
                ? <p style={{ color:'var(--taupe)', textAlign:'center', padding:'40px 0', fontSize:14 }}>No videos yet — add some above.</p>
                : videos.map((v, idx) => {
                    const { thumbnail } = parseVideoUrl(v.url);
                    return (
                      <div key={v._id} className="admin-video-row">
                        <img
                          src={thumbnail} alt="thumb"
                          className={`admin-thumb ${v.type === 'short-form' ? 'short' : 'long'}`}
                        />
                        <div className="admin-meta">
                          <div className="admin-vtitle">{v.title}</div>
                          <div className="admin-vmeta">
                            <span style={{ textTransform:'capitalize' }}>{v.type}</span>
                            <span>·</span>
                            <span>{v.category}</span>
                            <span>·</span>
                            <a href={v.url} target="_blank" rel="noreferrer" style={{ color:'var(--taupe)', textDecoration:'none' }}>↗ Link</a>
                          </div>
                        </div>
                        <div className="admin-actions">
                          <button className="icon-btn" onClick={() => handleMove(idx, -1)} disabled={idx === 0} title="Move up"
                            style={{ opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                          <button className="icon-btn" onClick={() => handleMove(idx, 1)} disabled={idx === videos.length - 1} title="Move down"
                            style={{ opacity: idx === videos.length - 1 ? 0.3 : 1 }}>↓</button>
                          <button className="icon-btn" onClick={() => handleEdit(v)} title="Edit">✎</button>
                          <button className="icon-btn del" onClick={() => handleDelete(v._id)} title="Delete">✕</button>
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          </div>
        )}

        {activeTab === 'links' && siteConfig && (
          <div className="admin-panel" style={{ maxWidth: 600 }}>
            <div className="admin-panel-title">Contact Links</div>
            <div className="form-group">
              <label className="form-label">Discord URL</label>
              <input className="form-input" value={siteConfig.discordUrl} onChange={e => setSiteConfig({...siteConfig, discordUrl: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <input className="form-input" value={siteConfig.whatsappNumber} onChange={e => setSiteConfig({...siteConfig, whatsappNumber: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Cal.com Link</label>
              <input className="form-input" value={siteConfig.calcomLink} onChange={e => setSiteConfig({...siteConfig, calcomLink: e.target.value})} />
            </div>
            <button className="btn-primary" onClick={() => handleSaveConfig(siteConfig)} disabled={configLoading} style={{ marginTop: 12 }}>Save Links</button>
          </div>
        )}

        {activeTab === 'services' && siteConfig && (
          <div className="admin-panel" style={{ maxWidth: 600 }}>
            <div className="admin-panel-title">Footer Services</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {siteConfig.services.map((srv, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8 }}>
                  <input className="form-input" value={srv} onChange={e => {
                    const newSrv = [...siteConfig.services];
                    newSrv[idx] = e.target.value;
                    setSiteConfig({...siteConfig, services: newSrv});
                  }} />
                  <button className="btn-secondary" onClick={() => {
                    const newSrv = siteConfig.services.filter((_, i) => i !== idx);
                    setSiteConfig({...siteConfig, services: newSrv});
                  }}>Remove</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" onClick={() => setSiteConfig({...siteConfig, services: [...siteConfig.services, 'New Service']})}>+ Add Service</button>
              <button className="btn-primary" onClick={() => handleSaveConfig(siteConfig)} disabled={configLoading}>Save Services</button>
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && siteConfig && (
          <div className="admin-panel">
            <div className="admin-panel-title">Testimonials</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {siteConfig.testimonials.map((t, idx) => (
                <div key={idx} className="admin-panel" style={{ padding: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-input" value={t.name} onChange={e => {
                      const newT = [...siteConfig.testimonials];
                      newT[idx].name = e.target.value;
                      setSiteConfig({...siteConfig, testimonials: newT});
                    }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Handle / Subs</label>
                    <input className="form-input" value={t.handle} onChange={e => {
                      const newT = [...siteConfig.testimonials];
                      newT[idx].handle = e.target.value;
                      setSiteConfig({...siteConfig, testimonials: newT});
                    }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Avatar URL</label>
                    <input className="form-input" value={t.avatar} onChange={e => {
                      const newT = [...siteConfig.testimonials];
                      newT[idx].avatar = e.target.value;
                      setSiteConfig({...siteConfig, testimonials: newT});
                    }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quote</label>
                    <textarea className="form-input" rows="3" value={t.quote} onChange={e => {
                      const newT = [...siteConfig.testimonials];
                      newT[idx].quote = e.target.value;
                      setSiteConfig({...siteConfig, testimonials: newT});
                    }} />
                  </div>
                  <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => {
                    const newT = siteConfig.testimonials.filter((_, i) => i !== idx);
                    setSiteConfig({...siteConfig, testimonials: newT});
                  }}>Remove Testimonial</button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button className="btn-secondary" onClick={() => setSiteConfig({...siteConfig, testimonials: [...siteConfig.testimonials, { name: 'New Client', handle: '@handle', quote: 'Great work!', avatar: '' }]})}>+ Add Testimonial</button>
              <button className="btn-primary" onClick={() => handleSaveConfig(siteConfig)} disabled={configLoading}>Save Testimonials</button>
            </div>
          </div>
        )}

        {activeTab === 'faqs' && siteConfig && (
          <div className="admin-panel">
            <div className="admin-panel-title">Frequently Asked Questions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {(siteConfig.faqs || []).map((item, idx) => (
                <div key={idx} className="admin-panel" style={{ padding: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Question</label>
                    <input className="form-input" value={item.q} onChange={e => {
                      const newFaqs = [...siteConfig.faqs];
                      newFaqs[idx] = { ...newFaqs[idx], q: e.target.value };
                      setSiteConfig({...siteConfig, faqs: newFaqs});
                    }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Answer</label>
                    <textarea className="form-input" rows="3" value={item.a} onChange={e => {
                      const newFaqs = [...siteConfig.faqs];
                      newFaqs[idx] = { ...newFaqs[idx], a: e.target.value };
                      setSiteConfig({...siteConfig, faqs: newFaqs});
                    }} />
                  </div>
                  <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => {
                    const newFaqs = siteConfig.faqs.filter((_, i) => i !== idx);
                    setSiteConfig({...siteConfig, faqs: newFaqs});
                  }}>Remove FAQ</button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button className="btn-secondary" onClick={() => setSiteConfig({...siteConfig, faqs: [...(siteConfig.faqs || []), { q: 'New Question', a: 'Answer here.' }]})}>+ Add FAQ</button>
              <button className="btn-primary" onClick={() => handleSaveConfig(siteConfig)} disabled={configLoading}>Save FAQs</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
