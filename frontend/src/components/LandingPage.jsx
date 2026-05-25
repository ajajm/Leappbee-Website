import React, { useState, useEffect, useRef } from 'react';
import { parseVideoUrl } from '../utils/videoParser';
import data from '../data.json';

/* ── Exact Paperclip gradient pill SVG (extracted from source) ── */
const HeroBgSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" aria-hidden="true" preserveAspectRatio="xMidYMid slice"
    style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="g0" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(90 0.5 0.5)"><stop offset="0%" stopColor="#3c23fb" /><stop offset="100%" stopColor="#fb8b24" /></linearGradient>
      <linearGradient id="g1" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(90 0.5 0.5)"><stop offset="0%" stopColor="#6721fa" /><stop offset="100%" stopColor="#f85f1c" /></linearGradient>
      <linearGradient id="g2" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(90 0.5 0.5)"><stop offset="0%" stopColor="#921ff8" /><stop offset="100%" stopColor="#f53215" /></linearGradient>
      <linearGradient id="g3" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(90 0.5 0.5)"><stop offset="0%" stopColor="#bd1df7" /><stop offset="100%" stopColor="#f10e18" /></linearGradient>
      <linearGradient id="g4" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(90 0.5 0.5)"><stop offset="0%" stopColor="#e81bf5" /><stop offset="100%" stopColor="#e4103e" /></linearGradient>
      <linearGradient id="g5" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(90 0.5 0.5)"><stop offset="0%" stopColor="#f419d3" /><stop offset="100%" stopColor="#d7135f" /></linearGradient>
      <linearGradient id="g6" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(90 0.5 0.5)"><stop offset="0%" stopColor="#f217a4" /><stop offset="100%" stopColor="#ca147b" /></linearGradient>
      <linearGradient id="g7" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(90 0.5 0.5)"><stop offset="0%" stopColor="#f11575" /><stop offset="100%" stopColor="#be1692" /></linearGradient>
      <linearGradient id="g8" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(90 0.5 0.5)"><stop offset="0%" stopColor="#ef1346" /><stop offset="100%" stopColor="#b217a4" /></linearGradient>
      <linearGradient id="g9" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(90 0.5 0.5)"><stop offset="0%" stopColor="#ec1217" /><stop offset="100%" stopColor="#9919a6" /></linearGradient>
      <linearGradient id="g10" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(90 0.5 0.5)"><stop offset="0%" stopColor="#e83913" /><stop offset="100%" stopColor="#79199a" /></linearGradient>
      <linearGradient id="g11" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(90 0.5 0.5)"><stop offset="0%" stopColor="#e36414" /><stop offset="100%" stopColor="#5c1a8f" /></linearGradient>
      <linearGradient id="g12" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(118 0.5 0.5)"><stop offset="0%" stopColor="#9a031e" /><stop offset="100%" stopColor="#ced51c" /></linearGradient>
      <linearGradient id="g23" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(126 0.5 0.5)"><stop offset="0%" stopColor="#1b998b" /><stop offset="100%" stopColor="#b11b79" /></linearGradient>
      <filter id="ditherN" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="2.95" numOctaves="5" seed="9" stitchTiles="stitch" />
      </filter>
      <mask id="ditherMask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="675" style={{ maskType: 'alpha' }}>
        <use href="#allPills" />
      </mask>
    </defs>
    <g id="allPills">
      {[354, 423, 494, 564, 634, 704, 774, 844].map((cx, col) => {
        const gMap = [
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 23],
          [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
          [23, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 23],
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        ];
        const startY = [154, 161, 101, 112, 138, 182, 151, 123];
        return gMap[col].map((gi, ri) => (
          <rect key={`${col}-${ri}`}
            transform={`translate(${cx} ${startY[col] + ri * 34.5})`}
            x="-35" y="-85" width="70" height="170" rx="35" ry="35"
            fill={`url(#g${gi})`}
          />
        ));
      })}
    </g>
    <rect width="1200" height="675" filter="url(#ditherN)" mask="url(#ditherMask)" opacity="0.86" style={{ mixBlendMode: 'overlay' }} />
  </svg>
);

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
      config: { "layout": "month_view", "useSlotsViewOnSmallScreen": "true" },
      calLink: "leappbee/leappbee-discovery-call",
    });

    window.Cal.ns["leappbee-discovery-call"]("ui", { "hideEventTypeDetails": false, "layout": "month_view" });
  }, [contact.calcom_link]);

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
        <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
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
          <HeroBgSVG />
          <div className="hero-grid-overlay" />
          <div className="hero-spotlight" />
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
            background: 'linear-gradient(to top, #141312 12%, transparent)', pointerEvents: 'none', zIndex: 5
          }} />
        </div>
        <div className="hero-body">
          <span className="hero-eyebrow">{brand.emoji ? `${brand.emoji} ` : ''}{hero.eyebrow}</span>
          <h1 className="hero-title">
            {hero.title.replace('creator.', '').split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
            ))}
            <FlipWords words={["creator.", "influencer.", "brand."]} />
          </h1>
          <p className="hero-sub">{hero.subtitle}</p>
          <div className="hero-ctas">
            <a href={hero.cta_primary.href} className="btn-primary">{hero.cta_primary.label}</a>
            <a href={hero.cta_secondary.href} className="btn-secondary">{hero.cta_secondary.label}</a>
          </div>
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
      <section id="impact" className="stats-border">
        <div className="section-inner">
          <div className="wrap">
            <h2 className="stats-heading">
              {stats.heading.split(' ').map((word, i, arr) =>
                i === arr.length - 1
                  ? <em key={i}> {word}</em>
                  : <React.Fragment key={i}>{i > 0 ? ' ' : ''}{word}</React.Fragment>
              )}
            </h2>
            <div className="stats-row">
              {stats.items.map(s => (
                <div key={s.number}>
                  <span className="stat-num"><AnimatedNumber value={s.number} /></span>
                  <p className="stat-lbl">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section id="testimonials" style={{ overflow: 'hidden' }}>
        <div className="section-inner">
          <div className="wrap center" style={{ marginBottom: 48 }}>
            <h2 className="section-h">What Creators Say</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.row1.map((t, i) => (
              <div className="testi-card" key={`testi-${i}`}>
                <img src={t.avatar} alt={t.name} className="testi-avatar" />
                <div className="testi-stars">⭐⭐⭐⭐⭐</div>
                <p className="testi-quote">"{t.quote}"</p>
                <div className="testi-name">{t.name}</div>
                <div className="testi-handle">{t.handle}</div>
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
                      <span key={j} style={{ fontSize: '13px', color: 'rgba(244,231,193,.65)' }}>
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

function FlipWords({ words }) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(index);
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [index, words.length]);

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ opacity: 0, pointerEvents: 'none', visibility: 'hidden' }}>
        {words.reduce((a, b) => a.length > b.length ? a : b)}
      </span>
      {words.map((word, i) => {
        const isActive = i === index;
        const isPrev = i === prevIndex;
        if (!isActive && !isPrev && prevIndex !== -1) return null;
        
        let className = 'flip-word';
        if (isActive && prevIndex !== -1) className += ' flip-word-in';
        if (isPrev) className += ' flip-word-out';
        if (isActive && prevIndex === -1) className += ' flip-word-static';

        return (
          <span key={word} className={className} style={{ position: 'absolute', left: 0, top: 0 }}>
            {word}
          </span>
        );
      })}
    </span>
  );
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
