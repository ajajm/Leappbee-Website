import React, { useState, useEffect, useRef } from 'react';
import { parseVideoUrl } from '../utils/videoParser';
import data from '../data.json';

/* ── Theme Toggle Component ── */
function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('leappbee-theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('leappbee-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}


/* ── Paperclip paperclip icon ─────────────────────────────── */
const LeappbeeLogo = ({ size = 20 }) => (
  <img src="/leapbee_logo.jpg" alt="Leappbee Logo" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'inline-block' }} />
);

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [longTab, setLongTab] = useState('All');
  const [shortTab, setShortTab] = useState('All');
  const [modal, setModal] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const { videos = [], brand, process: proc, stats, faq, footer, hero, contact, testimonials } = data;

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const calTheme = currentTheme === 'dark' ? 'dark' : 'light';

    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal("init", "leappbee-discovery-call", { origin: "https://app.cal.com" });

    window.Cal.ns["leappbee-discovery-call"]("inline", {
      elementOrSelector: "#my-cal-inline-leappbee-discovery-call",
      config: { "layout": "month_view", "useSlotsViewOnSmallScreen": "true", "theme": calTheme },
      calLink: "leappbee/leappbee-discovery-call",
    });

    window.Cal.ns["leappbee-discovery-call"]("ui", {
      "hideEventTypeDetails": false,
      "layout": "month_view",
      "theme": calTheme,
    });
  }, [contact.calcom_link]);

  // Sync Cal.com theme when data-theme attribute changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
          const calTheme = newTheme === 'dark' ? 'dark' : 'light';
          if (window.Cal && window.Cal.ns && window.Cal.ns["leappbee-discovery-call"]) {
            window.Cal.ns["leappbee-discovery-call"]("ui", {
              "theme": calTheme,
            });
          }
          // Also update the iframe directly for immediate visual feedback
          const calContainer = document.getElementById('my-cal-inline-leappbee-discovery-call');
          if (calContainer) {
            const iframe = calContainer.querySelector('iframe');
            if (iframe && iframe.src) {
              const url = new URL(iframe.src);
              url.searchParams.set('theme', calTheme);
              iframe.src = url.toString();
            }
          }
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const longVideos = videos.filter(v => v.type === 'long-form');
  const shortVideos = videos.filter(v => v.type === 'short-form');
  const longCats = ['All', ...new Set(longVideos.map(v => v.category))];
  const shortCats = ['All', ...new Set(shortVideos.map(v => v.category))];
  const shownLong = longTab === 'All' ? longVideos : longVideos.filter(v => v.category === longTab);
  const shownShort = shortTab === 'All' ? shortVideos : shortVideos.filter(v => v.category === shortTab);

  const faqItems = faq.items;
  const footerColumns = footer.columns;

  return (
    <>
      {/* ══ NAVBAR ══ */}
      <nav className="navbar">
        <div className="wrap" style={{ width: '100%', position: 'relative' }}>
          <div className="nav-left">
            <a href="#process" className="nav-link">Process</a>
            <a href="#work" className="nav-link">Our Work</a>
            <a href="#testimonials" className="nav-link">Clients</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </div>
          <a href="#" className="nav-logo">
            <LeappbeeLogo size={20} />
            {brand.name}
          </a>
          <div className="nav-right">
            <a href={hero.cta_primary.href} className="nav-cta">Book a call</a>
          </div>
          <button className="mobile-nav-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="mobile-menu-drawer" onClick={e => e.stopPropagation()}>
          <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="mobile-menu-links">
            <a href="#process" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Process</a>
            <a href="#work" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Our Work</a>
            <a href="#testimonials" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Clients</a>
            <a href="#faq" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
            <a href={hero.cta_primary.href} className="btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Book a call</a>
          </div>
        </div>
      </div>

      {/* ══ HERO ══ */}
      <header className="hero" id="home">
        <div className="hero-bg">
          <HeroBgDynamic />
          <div className="hero-spotlight" />
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
            background: 'linear-gradient(to top, var(--hero-fade) 12%, transparent)', pointerEvents: 'none', zIndex: 5
          }} />
        </div>
        <div className="hero-body">
          <span className="hero-eyebrow">{brand.emoji} {hero.eyebrow}</span>
          <h1 className="hero-title">
            {hero.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < hero.title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
            {' '}
            {hero.rotating_words && (
              <WordRotator words={hero.rotating_words} />
            )}
          </h1>
          <p className="hero-sub">{hero.subtitle}</p>
          <div className="hero-ctas">
            <a href={hero.cta_primary.href} className="btn-primary">{hero.cta_primary.label}</a>
            <a href={hero.cta_secondary.href} className="btn-secondary">{hero.cta_secondary.label}</a>
          </div>
          <div className="hero-proof-row">
            <div className="proof-item">
              <span className="proof-icon">⚡</span>
              <span>High-Retention Hooks</span>
            </div>
            <div className="proof-item">
              <span className="proof-icon">🏆</span>
              <span>Elite Editing Squad</span>
            </div>
            <div className="proof-item">
              <span className="proof-icon">📈</span>
              <span>300% Avg. Growth</span>
            </div>
          </div>
        </div>

        {/* Floating Badges */}
        <div className="floating-badge badge-1">
          <span className="badge-icon">⚡</span>
          <span className="badge-text">High-Retention Hooks</span>
        </div>
        <div className="floating-badge badge-2">
          <span className="badge-icon">🏆</span>
          <span className="badge-text">Elite Editing Squad</span>
        </div>
        <div className="floating-badge badge-3">
          <span className="badge-icon">📈</span>
          <span className="badge-text">300% Avg. Growth</span>
        </div>
      </header>

      {/* ══ PROCESS ══ */}
      <section id="process">
        <div className="section-inner">
          <div className="wrap center">
            <span className="section-label">{proc.label}</span>
            <h2 className="section-h">{proc.heading}</h2>
            <p className="section-sub center">{proc.subtext}</p>

            <div className="process-grid">
              {proc.steps.map(step => (
                <div className="process-step" key={step.num}>
                  <span className="process-num">{step.num}</span>
                  <h3 className="process-title">{step.title}</h3>
                  <p className="process-desc">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="trust-bar">
              <div className="trust-bar-item">
                <span className="trust-dot" />
                <span>Experienced editors trained on retention</span>
              </div>
              <div className="trust-bar-item">
                <span className="trust-dot" />
                <span>Long-form &amp; short-form specialists</span>
              </div>
              <div className="trust-bar-item">
                <span className="trust-dot" />
                <span>Direct Discord/Call personal support</span>
              </div>
              <div className="trust-bar-item">
                <span className="trust-dot" />
                <span>24-72 hour first draft delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PORTFOLIO ══ */}
      <section id="work">
        <div className="section-inner">
          <div className="wrap">
            {/* Long form */}
            <div className="center" style={{ marginBottom: 32 }}>
              <span className="section-label">Featured work</span>
              <h2 className="section-h">Long Form Edits</h2>
              <p className="section-sub center">Full-length video productions for YouTube &amp; platform creators.</p>
            </div>
            <div className="filter-row">
              {longCats.map(c => (
                <button key={c} className={`chip ${longTab === c ? 'chip-active' : ''}`} onClick={() => setLongTab(c)}>{c}</button>
              ))}
            </div>
            <div className="grid-long">
              {shownLong.length === 0
                ? <div className="empty">No videos yet — add some from the admin panel.</div>
                : shownLong.map(v => <VCard key={v._id} v={v} />)
              }
            </div>

            {/* Short form */}
            <div className="center" style={{ marginTop: 72, marginBottom: 32 }}>
              <span className="section-label">Viral edits</span>
              <h2 className="section-h">Short Form Edits</h2>
              <p className="section-sub center">High-retention clips for Reels, TikTok &amp; YouTube Shorts.</p>
            </div>
            <div className="filter-row">
              {shortCats.map(c => (
                <button key={c} className={`chip ${shortTab === c ? 'chip-active' : ''}`} onClick={() => setShortTab(c)}>{c}</button>
              ))}
            </div>
            <div className="grid-short">
              {shownShort.length === 0
                ? <div className="empty">No videos yet — add some from the admin panel.</div>
                : shownShort.map(v => <VCard key={v._id} v={v} short />)
              }
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section id="impact" className="stats-section">
        <div className="section-inner">
          <div className="wrap">
            <h2 className="stats-heading">
              {stats.heading.split(' ').map((word, i, arr) =>
                i === arr.length - 1
                  ? <em key={i}> {word}</em>
                  : <React.Fragment key={i}>{i > 0 ? ' ' : ''}{word}</React.Fragment>
              )}
            </h2>
            <p className="stats-sub">Real results from real creators who trust LeappBee with their content.</p>
            <div className="stats-row">
              {stats.items.map((s, i) => {
                const icons = [
                  <svg key="i" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
                  <svg key="v" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>,
                  <svg key="t" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
                  <svg key="h" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                ];
                return (
                  <div className="stat-card" key={s.number}>
                    <div className="stat-icon">{icons[i]}</div>
                    <span className="stat-num"><AnimatedNumber value={s.number} /></span>
                    <p className="stat-lbl">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section id="testimonials" style={{ overflow: 'hidden' }}>
        <div className="section-inner">
          <div className="testi-section-header">
            <span className="testi-badge">
              <span className="testi-badge-dot" />
              Testimonials
            </span>
            <h2 className="testi-section-title">What Creators Say</h2>
            <p className="testi-section-sub">Don't just take our word for it. Here's what our clients have to say about working with LeappBee.</p>
          </div>
          <div className="testimonials-grid">
            {[...testimonials.row1, ...(testimonials.row2 || [])].slice(0, 6).map((t, i) => (
              <div className="testi-card" key={`testi-${i}`}>
                <div className="testi-quote-mark">“</div>
                <div className="testi-stars">
                  {[...Array(5)].map((_, si) => (
                    <span className="testi-star" key={si}>★</span>
                  ))}
                </div>
                <p className="testi-quote">{t.quote}</p>
                <div className="testi-author">
                  <img src={t.avatar} alt={t.name} className="testi-avatar" />
                  <div className="testi-author-info">
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-handle">{t.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact">
        <div className="section-inner">
          <div className="wrap center">
            <span className="section-label">{contact.label}</span>
            <h2 className="section-h">{contact.heading}</h2>
            <p className="section-sub center" style={{ marginBottom: 48 }}>Choose your channel. We respond within the hour.</p>
            <div className="contact-cards">
              {/* Discord */}
              <div className="ccard" style={{ textAlign: 'left' }}>
                <div className="ccard-top">
                  <div className="ccard-plat">
                    <div className="ccard-icon" style={{ background: 'rgba(88,101,242,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                    </div>
                    <div>
                      <div className="ccard-name">{contact.discord.name}</div>
                      <div className="ccard-sub">⚡ Usually online · 7 days a week</div>
                    </div>
                  </div>
                  <span className="live-badge"><span className="live-dot"></span>Online</span>
                </div>
                <p className="ccard-desc">{contact.discord.desc}</p>
                <a href={contact.discord.url} target="_blank" rel="noreferrer"
                  className="btn-primary btn-discord">
                  Join Discord Server
                </a>
              </div>

              {/* WhatsApp */}
              <div className="ccard" style={{ textAlign: 'left' }}>
                <div className="ccard-top">
                  <div className="ccard-plat">
                    <div className="ccard-icon" style={{ background: 'rgba(37,211,102,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                    </div>
                    <div>
                      <div className="ccard-name">{contact.whatsapp.name}</div>
                      <div className="ccard-sub">💬 Typically replies within minutes</div>
                    </div>
                  </div>
                  <span className="live-badge"><span className="live-dot"></span>Active</span>
                </div>
                <p className="ccard-desc">{contact.whatsapp.desc}</p>
                <a href={contact.whatsapp.url} target="_blank" rel="noreferrer"
                  className="btn-primary btn-whatsapp">
                  Message on WhatsApp
                </a>
              </div>
            </div>

            <div className="calcom-container" style={{ width: '100%', marginTop: '32px' }}>
              <div style={{ width: '100%', overflow: 'scroll' }} id="my-cal-inline-leappbee-discovery-call"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq">
        <div className="section-inner">
          <div className="wrap">
            <div className="faq-intro">
              <span className="faq-label">FAQ</span>
              <h2 className="faq-heading">{faq.heading}</h2>
            </div>
            <div className="faq-list">
              {faqItems.map((item, idx) => (
                <div key={idx} className={`faq-item ${openFaq === idx ? 'open' : ''}`}>
                  <button className="faq-q" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                    <span>{item.q}</span>
                    <span className="faq-chevron">▾</span>
                  </button>
                  <div className="faq-a-wrapper">
                    <div className="faq-a">
                      <div className="faq-a-content">{item.a}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div style={{ paddingRight: '20px' }}>
              <div className="footer-logo-row" style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '0.05em' }}>
                <LeappbeeLogo size={24} />{brand.name}
              </div>
              <p className="footer-desc" style={{ whiteSpace: 'pre-wrap', marginBottom: '24px', maxWidth: '340px' }}>{footer.description}</p>
              <div style={{ display: 'flex', gap: '16px', color: 'var(--taupe)' }}>
                {/* Discord Icon */}
                <a href={contact.discord.url} target="_blank" rel="noreferrer" className="footer-social">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                </a>
                {/* WhatsApp Icon */}
                <a href={contact.whatsapp.url} target="_blank" rel="noreferrer" className="footer-social">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                </a>
                {/* Calendar Icon */}
                <a href="#contact" className="footer-social">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" /></svg>
                </a>
              </div>
            </div>
            {footerColumns.map(col => (
              <div key={col.title}>
                <h4 className="footer-col-title">{col.title}</h4>
                <div className="footer-col-links">
                  {col.links.map((lnk, j) => (
                    col.title === 'Services' ? (
                      <span key={j} style={{ fontSize: '13px', color: 'var(--taupe)' }}>
                        {lnk.label}
                      </span>
                    ) : (
                      <a key={j} href={lnk.href}>{lnk.label}</a>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* MODAL REMOVED */}

      {/* ══ THEME TOGGLE ══ */}
      <ThemeToggle />
    </>
  );
}

/* ─── Sub-components ──────────────────────────────────────── */

function AnimatedNumber({ value }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  const numMatch = value.match(/\d+/);
  const target = numMatch ? parseInt(numMatch[0], 10) : 0;
  const suffix = value.replace(/\d+/g, '');

  useEffect(() => {
    let observer;
    if (ref.current) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.ceil(start));
            }
          }, 16);
          observer.disconnect();
        }
      }, { threshold: 0.5 });
      observer.observe(ref.current);
    }
    return () => observer && observer.disconnect();
  }, [target]);

  if (!target) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{count}{suffix}</span>;
}

function VCard({ v, short = false }) {
  const { isYouTube, isDrive, isInstagram, embedUrl } = parseVideoUrl(v.url);
  const safeEmbedUrl = embedUrl.replace('autoplay=1', 'autoplay=0');

  return (
    <div className="vcard">
      <div className={`vcard-thumb ${short ? 'ar-9-16' : 'ar-16-9'}`} style={{ position: 'relative' }}>
        <iframe
          src={safeEmbedUrl}
          title={v.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', top: 0, left: 0 }}
        />
      </div>
    </div>
  );
}

/* ─── Premium Background & Rotator Components ────────────────── */

function HeroBgDynamic() {
  const columnsCount = 24;
  const pillsPerColumn = 10;

  const gradients = [
    'linear-gradient(180deg, #d97706 0%, #f59e0b 100%)',
    'linear-gradient(180deg, #ea580c 0%, #fb923c 100%)',
    'linear-gradient(180deg, #dc2626 0%, #fca5a5 100%)',
    'linear-gradient(180deg, #b45309 0%, #f59e0b 100%)',
    'linear-gradient(180deg, #c2410c 0%, #fdba74 100%)',
    'linear-gradient(180deg, #b91c1c 0%, #fca5a5 100%)',
    'linear-gradient(180deg, #d97706 0%, #fef08a 100%)',
    'linear-gradient(180deg, #ea580c 0%, #ffedd5 100%)',
    'linear-gradient(180deg, #854d0e 0%, #fef08a 100%)',
    'linear-gradient(180deg, #c2410c 0%, #ffedd5 100%)',
    'linear-gradient(180deg, #9a3412 0%, #fdba74 100%)',
    'linear-gradient(180deg, #78350f 0%, #f59e0b 100%)',
  ];

  return (
    <div className="hero-bg-dynamic">
      {Array.from({ length: columnsCount }).map((_, colIdx) => {
        const offset = (colIdx % 4) * 30;
        return (
          <div
            key={colIdx}
            className="hero-bg-col"
            style={{
              transform: `translateY(${offset}px)`,
              animation: `floatCol ${15 + (colIdx % 3) * 5}s infinite alternate ease-in-out`,
              animationDelay: `${colIdx * -0.4}s`
            }}
          >
            {Array.from({ length: pillsPerColumn }).map((_, pillIdx) => {
              const gradientIdx = (colIdx * 3 + pillIdx) % gradients.length;
              return (
                <div
                  key={pillIdx}
                  className="hero-bg-pill"
                  style={{
                    background: gradients[gradientIdx]
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function WordRotator({ words, interval = 2500 }) {
  const [index, setIndex] = useState(0);
  const [animClass, setAnimClass] = useState('word-slide-in');

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimClass('word-slide-out');
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setAnimClass('word-slide-in');
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span className={`word-rotator-text ${animClass}`}>
      {words[index]}
    </span>
  );
}

