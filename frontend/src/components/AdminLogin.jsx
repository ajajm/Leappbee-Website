import React, { useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

export default function AdminLogin({ onLoginSuccess, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid credentials.');
      localStorage.setItem('leappbee_admin_token', data.token);
      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <button
          onClick={onBack}
          style={{ fontSize:13, color:'var(--taupe)', marginBottom:28, display:'flex', alignItems:'center', gap:6, cursor:'pointer', background:'none', border:'none', fontFamily:'Inter,sans-serif' }}
        >
          ← Back to website
        </button>

        <h1 className="login-h">Admin Access</h1>
        <p className="login-sub">Manage portfolio videos and ordering</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input" type="text" value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin" disabled={loading}
            />
          </div>
          <div className="form-group" style={{ marginBottom:28 }}>
            <label className="form-label">Password</label>
            <input
              className="form-input" type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" disabled={loading}
            />
          </div>
          <button
            type="submit" className="btn-primary"
            style={{ width:'100%', justifyContent:'center', opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
