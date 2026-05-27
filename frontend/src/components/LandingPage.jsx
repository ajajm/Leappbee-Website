import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import { parseVideoUrl } from '../utils/videoParser';
import data from '../data.json';

/* ══════════════════════════════════════════════════════════
   ANIMATION PRIMITIVES
   ══════════════════════════════════════════════════════════ */

const EASE = [0.16, 1, 0.3, 1];

function Reveal({ children, delay = 0, className = '', y = 28 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-55px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: EASE } },
};

/* ══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ══════════════════════════════════════════════════════════ */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX, width: '100%' }}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   THEME TOGGLE
   ══════════════════════════════════════════════════════════ */

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('leappbee-theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('leappbee-theme', theme);
  }, [theme]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   LOGO
   ══════════════════════════════════════════════════════════ */

const LeappbeeLogo = ({ size = 20 }) => (
  <img
    src="/leapbee_logo.jpg"
    alt="Leappbee"
    style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'inline-block' }}
  />
);

/* ══════════════════════════════════════════════════════════
   WORD ROTATOR
   ══════════════════════════════════════════════════════════ */

function WordRotator({ words, interval = 2800 }) {
  const [index, setIndex] = useState(0);
  const [animClass, setAnimClass] = useState('word-slide-in');

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimClass('word-slide-out');
      setTimeout(() => {
        setIndex(p => (p + 1) % words.length);
        setAnimClass('word-slide-in');
      }, 300);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  return <span className={`word-rotator-text ${animClass}`}>{words[index]}</span>;
}

/* ══════════════════════════════════════════════════════════
   MARQUEE TICKER
   ══════════════════════════════════════════════════════════ */

function MarqueeTicker({ items }) {
  const tripled = [...items, ...items, ...items];
  return (
    <div className="hero-ticker">
      <div className="hero-ticker-track">
        {tripled.map((item, i) => (
          <React.Fragment key={i}>
            <span className="ticker-item">
              <span className="ticker-number">{item.number}</span>
              <span className="ticker-label">{item.label}</span>
            </span>
            <span className="ticker-dot">·</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ANIMATED NUMBER
   ══════════════════════════════════════════════════════════ */

function AnimatedNumber({ value }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const numMatch = value.match(/\d+/);
  const target = numMatch ? parseInt(numMatch[0], 10) : 0;
  const suffix = value.replace(/\d+/g, '');

  useEffect(() => {
    if (!ref.current || !target) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const increment = target / (2200 / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else { setCount(Math.ceil(start)); }
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  if (!target) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ══════════════════════════════════════════════════════════
   VIDEO CARD
   ══════════════════════════════════════════════════════════ */

function VCard({ v, short = false }) {
  const { embedUrl } = parseVideoUrl(v.url);
  const safeEmbedUrl = embedUrl.replace('autoplay=1', 'autoplay=0');

  return (
    <motion.div className="vcard" variants={staggerItem}>
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
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   SERVICE ICONS
   ══════════════════════════════════════════════════════════ */

const ServiceIcons = {
  'Long-Form Editing': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  'Short-Form & Reels': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.34z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  'Motion Graphics': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  'Thumbnails': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  'SEO & Strategy': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  'Social Media Management': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

const servicesData = [
  { name: 'Long Form Editing', desc: 'YouTube optimised edits built for watch time, hooks, pacing, b-roll and colour grading that keep viewers until the end.', tag: 'YouTube · Podcasts' },
  { name: 'Short Form & Reels', desc: 'Vertical clips engineered for the algorithm. We cut for first second attention and strong watch through on Reels, TikTok & Shorts.', tag: 'Reels · TikTok · Shorts' },
  { name: 'Motion Graphics', desc: 'Custom animations, lower thirds, chapter cards and logo stings that elevate your brand identity across every video.', tag: 'After Effects · Premiere' },
  { name: 'Thumbnails', desc: 'Split tested thumbnail designs that consistently push CTR above industry benchmarks, designed to get the click.', tag: 'Photoshop · Figma' },
  { name: 'SEO & Strategy', desc: 'Titles, descriptions, tags and upload cadence built around keyword research, so the algorithm works for you, not against you.', tag: 'YouTube SEO · Analytics' },
  { name: 'Social Media Management', desc: 'End to end management of your posting schedule, community replies, and platform native content repurposing.', tag: 'Multi-platform' },
];

/* ══════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ══════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [longTab, setLongTab] = useState('All');
  const [shortTab, setShortTab] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);

  const { videos = [], brand, process: proc, stats, faq, footer, hero, contact, testimonials } = data;

  /* ── Nav shadow on scroll ── */
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Cal.com Embed ── */
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const calTheme = currentTheme === 'dark' ? 'dark' : 'light';

    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal; let ar = arguments;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1]; api.q = api.q || [];
          if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }
          else p(cal, ar); return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal("init", "leappbee-discovery-call", { origin: "https://app.cal.com" });
    window.Cal.ns["leappbee-discovery-call"]("inline", {
      elementOrSelector: "#my-cal-inline-leappbee-discovery-call",
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: calTheme },
      calLink: "leappbee/leappbee-discovery-call",
    });
    window.Cal.ns["leappbee-discovery-call"]("ui", { hideEventTypeDetails: false, layout: "month_view", theme: calTheme });
  }, [contact.calcom_link]);

  /* ── Sync Cal.com theme ── */
  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme') {
          const calTheme = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark' ? 'dark' : 'light';
          if (window.Cal?.ns?.["leappbee-discovery-call"]) {
            window.Cal.ns["leappbee-discovery-call"]("ui", { theme: calTheme });
          }
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  /* ── Video Filtering ── */
  const longVideos = videos.filter(v => v.type === 'long-form');
  const shortVideos = videos.filter(v => v.type === 'short-form');
  const longCats = ['All', ...new Set(longVideos.map(v => v.category))];
  const shortCats = ['All', ...new Set(shortVideos.map(v => v.category))];
  const shownLong = longTab === 'All' ? longVideos : longVideos.filter(v => v.category === longTab);
  const shownShort = shortTab === 'All' ? shortVideos : shortVideos.filter(v => v.category === shortTab);

  const statIcons = [
    <svg key="i" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    <svg key="v" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    <svg key="t" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    <svg key="h" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  ];

  return (
    <>
      <ScrollProgress />

      {/* ══════════════════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════════════════ */}
      <nav className={`navbar${navScrolled ? ' scrolled' : ''}`}>
        <div className="wrap" style={{ width: '100%' }}>
          <div className="nav-left">
            <a href="#process" className="nav-link">Process</a>
            <a href="#services" className="nav-link">Services</a>
            <a href="#work" className="nav-link">Our Work</a>
            <a href="#testimonials" className="nav-link">Clients</a>
          </div>
          <a href="#" className="nav-logo">
            <LeappbeeLogo size={20} />
            {brand.name}
          </a>
          <div className="nav-right">
            <a href="#faq" className="nav-link">FAQ</a>
            <a href={hero.cta_primary.href} className="nav-cta" target="_blank" rel="noreferrer">Book a call ↗</a>
          </div>
          <button className="mobile-nav-toggle" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ═══ MOBILE MENU ═══ */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="mobile-menu-drawer" onClick={e => e.stopPropagation()}>
          <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="mobile-menu-links">
            {['Process', 'Services', 'Our Work', 'Clients', 'FAQ'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(' ', '')}`} className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{label}</a>
            ))}
            <a href={hero.cta_primary.href} className="btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Book a call</a>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════ */}
      <header className="hero" id="home">
        <div className="hero-bg">
          <div className="hero-mesh-1" />
          <div className="hero-mesh-2" />
          <div className="hero-mesh-3" />
          <div className="hero-grid" />
          <div className="hero-spotlight" />
          <div className="hero-fade" />
        </div>

        <div className="hero-body">
          <span className="hero-eyebrow">{hero.eyebrow}</span>
          <h1 className="hero-title">
            {hero.title.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}{' '}
            {hero.rotating_words && <WordRotator words={hero.rotating_words} />}
          </h1>
          <p className="hero-sub">{hero.subtitle}</p>
          <div className="hero-ctas">
            <a href={hero.cta_primary.href} className="btn-primary btn-lg" target="_blank" rel="noreferrer">
              {hero.cta_primary.label}
            </a>
            <a href={hero.cta_secondary.href} className="btn-secondary">{hero.cta_secondary.label}</a>
          </div>
          <div className="hero-trust-row">
            <span className="hero-trust-item">No contracts</span>
            <span className="hero-trust-sep">·</span>
            <span className="hero-trust-item">48h first draft</span>
            <span className="hero-trust-sep">·</span>
            <span className="hero-trust-item">Dedicated team</span>
            <span className="hero-trust-sep">·</span>
            <span className="hero-trust-item">Cancel anytime</span>
          </div>
        </div>

        <MarqueeTicker items={stats.items} />
      </header>

      <hr className="hr-fade" />

      {/* ══════════════════════════════════════════════════
          PROCESS
          ══════════════════════════════════════════════════ */}
      <section id="process" className="process-section">
        <div className="section-inner">
          <div className="wrap center">
            <Reveal>
              <span className="section-kicker">How it works</span>
              <h2 className="section-h">
                A process built for <span className="accent-serif">consistency</span>
              </h2>
              <p className="section-sub center" style={{ marginBottom: 0 }}>
                From raw footage to publish ready content, we handle the full production loop so you can focus on creating.
              </p>
            </Reveal>

            <motion.div
              className="process-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {proc.steps.map(step => (
                <motion.div className="process-step" key={step.num} variants={staggerItem}>
                  <span className="process-num">{step.num}</span>
                  <h3 className="process-title">{step.title}</h3>
                  <p className="process-desc">{step.desc}</p>
                  <span className="process-step-bg-num">{step.num}</span>
                </motion.div>
              ))}
            </motion.div>

            <Reveal delay={0.2}>
              <div className="trust-bar">
                {proc.trust_items.map((item, i) => (
                  <div className="trust-bar-item" key={i}>
                    <span className="trust-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      {/* ══════════════════════════════════════════════════
          PORTFOLIO
          ══════════════════════════════════════════════════ */}
      <section id="work" className="alt-bg">
        <div className="section-inner">
          <div className="wrap">
            {/* Long form */}
            <Reveal>
              <div className="center" style={{ marginBottom: 36 }}>
                <span className="section-kicker">Featured work</span>
                <h2 className="section-h">Long Form <span className="accent-serif">Edits</span></h2>
                <p className="section-sub center">Full length videos engineered for watch time: YouTube, podcasts, documentaries.</p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="filter-row">
                {longCats.map(c => (
                  <button key={c} className={`chip ${longTab === c ? 'chip-active' : ''}`} onClick={() => setLongTab(c)}>{c}</button>
                ))}
              </div>
            </Reveal>

            <motion.div
              className="grid-long"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              key={`long-${longTab}`}
            >
              {shownLong.length === 0
                ? <div className="empty">No videos yet, add some from the admin panel.</div>
                : shownLong.map(v => <VCard key={v._id} v={v} />)
              }
            </motion.div>

            {/* Short form */}
            <Reveal>
              <div className="center" style={{ marginTop: 88, marginBottom: 36 }}>
                <span className="section-kicker">Viral edits</span>
                <h2 className="section-h">Short Form <span className="accent-serif">Clips</span></h2>
                <p className="section-sub center">High retention cuts for Reels, TikTok & YouTube Shorts, built to stop the scroll.</p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="filter-row">
                {shortCats.map(c => (
                  <button key={c} className={`chip ${shortTab === c ? 'chip-active' : ''}`} onClick={() => setShortTab(c)}>{c}</button>
                ))}
              </div>
            </Reveal>

            <motion.div
              className="grid-short"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              key={`short-${shortTab}`}
            >
              {shownShort.length === 0
                ? <div className="empty">No videos yet, add some from the admin panel.</div>
                : shownShort.map(v => <VCard key={v._id} v={v} short />)
              }
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      {/* ══════════════════════════════════════════════════
          STATS
          ══════════════════════════════════════════════════ */}
      <section id="impact" className="stats-section alt-bg">
        <div className="section-inner">
          <div className="wrap">
            <Reveal>
              <h2 className="stats-heading">
                {stats.heading.split(' ').map((word, i, arr) =>
                  i === arr.length - 1
                    ? <em key={i}> {word}</em>
                    : <React.Fragment key={i}>{i > 0 ? ' ' : ''}{word}</React.Fragment>
                )}
              </h2>
              <p className="stats-sub">These aren't projections, they're real results from creators who trusted us with their content.</p>
            </Reveal>

            <motion.div
              className="stats-row"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {stats.items.map((s, i) => (
                <motion.div className="stat-card" key={s.number} variants={staggerItem}>
                  <div className="stat-icon">{statIcons[i]}</div>
                  <span className="stat-num"><AnimatedNumber value={s.number} /></span>
                  <p className="stat-lbl">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════════════════ */}
      <section id="testimonials">
        <div className="section-inner">
          <div className="wrap">
            <Reveal>
              <div className="testi-section-header">
                <span className="testi-badge">
                  <span className="testi-badge-dot" />
                  Client Results
                </span>
                <h2 className="testi-section-title">
                  Real creators. <span className="accent-serif">Real growth.</span>
                </h2>
                <p className="testi-section-sub">
                  We let the numbers talk. Here's what creators say after working with LeappBee.
                </p>
              </div>
            </Reveal>

            <motion.div
              className="testimonials-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {[...testimonials.row1, ...(testimonials.row2 || [])].slice(0, 6).map((t, i) => (
                <motion.div className="testi-card" key={`testi-${i}`} variants={staggerItem}>
                  <div className="testi-quote-mark">&ldquo;</div>
                  <div className="testi-stars">
                    {[...Array(5)].map((_, si) => <span className="testi-star" key={si}>★</span>)}
                  </div>
                  <p className="testi-quote">{t.quote}</p>
                  <div className="testi-author">
                    <img src={t.avatar} alt={t.name} className="testi-avatar" />
                    <div className="testi-author-info">
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-handle">{t.handle}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      {/* ══════════════════════════════════════════════════
          CONTACT
          ══════════════════════════════════════════════════ */}
      <section id="contact">
        <div className="section-inner">
          <div className="wrap center">
            <Reveal>
              <span className="section-kicker">{contact.label}</span>
              <h2 className="section-h">
                Let's <span className="accent-serif">start</span> something
              </h2>
              <p className="section-sub center" style={{ marginBottom: 48 }}>
                Pick how you want to reach us. We're a real team, no bots, no 48 hour email delays.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="contact-cards">
                {/* Discord */}
                <div className="ccard" style={{ textAlign: 'left' }}>
                  <div className="ccard-top">
                    <div className="ccard-plat">
                      <div className="ccard-icon" style={{ background: 'rgba(88,101,242,.12)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#5865F2">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                      </div>
                      <div>
                        <div className="ccard-name">{contact.discord.name}</div>
                        <div className="ccard-sub">⚡ Team online · 7 days a week</div>
                      </div>
                    </div>
                    <span className="live-badge"><span className="live-dot" />Online</span>
                  </div>
                  <p className="ccard-desc">{contact.discord.desc}</p>
                  <a href={contact.discord.url} target="_blank" rel="noreferrer" className="btn-primary btn-discord">Join Discord Server</a>
                </div>

                {/* WhatsApp */}
                <div className="ccard" style={{ textAlign: 'left' }}>
                  <div className="ccard-top">
                    <div className="ccard-plat">
                      <div className="ccard-icon" style={{ background: 'rgba(37,211,102,.12)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                      </div>
                      <div>
                        <div className="ccard-name">{contact.whatsapp.name}</div>
                        <div className="ccard-sub">💬 Replies within minutes</div>
                      </div>
                    </div>
                    <span className="live-badge"><span className="live-dot" />Active</span>
                  </div>
                  <p className="ccard-desc">{contact.whatsapp.desc}</p>
                  <a href={contact.whatsapp.url} target="_blank" rel="noreferrer" className="btn-primary btn-whatsapp">Message on WhatsApp</a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="calcom-container" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                <div id="my-cal-inline-leappbee-discovery-call" style={{ width: '100%' }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      {/* ══════════════════════════════════════════════════
          FAQ
          ══════════════════════════════════════════════════ */}
      <section id="faq" className="alt-bg">
        <div className="section-inner">
          <div className="wrap">
            <div className="faq-layout">
              <Reveal>
                <div className="faq-intro">
                  <span className="faq-label">FAQ</span>
                  <h2 className="faq-heading">
                    Questions<br />
                    <span className="accent-serif">answered.</span>
                  </h2>
                  <p className="faq-sub">
                    Everything you need to know before getting started. Still unsure? Book a free call and we'll walk you through it.
                  </p>
                  <a href={hero.cta_primary.href} className="btn-primary" style={{ marginTop: 12 }} target="_blank" rel="noreferrer">
                    Book a free call
                  </a>
                </div>
              </Reveal>

              <div className="faq-list">
                {faq.items.map((item, idx) => (
                  <Reveal key={idx} delay={idx * 0.03}>
                    <div className={`faq-item ${openFaq === idx ? 'open' : ''}`}>
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
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════ */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div className="footer-logo-row">
                <LeappbeeLogo size={22} />
                {brand.name}
              </div>
              <p className="footer-desc" style={{ marginBottom: 24 }}>{footer.description}</p>
              <div style={{ display: 'flex', gap: '14px' }}>
                <a href={contact.discord.url} target="_blank" rel="noreferrer" className="footer-social">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                </a>
                <a href={contact.whatsapp.url} target="_blank" rel="noreferrer" className="footer-social">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </a>
                <a href={footer.columns.find(c => c.title === 'Connect')?.links.find(l => l.label === 'Email Us')?.href} className="footer-social">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
              </div>
            </div>
            {footer.columns.map(col => (
              <div key={col.title}>
                <h4 className="footer-col-title">{col.title}</h4>
                <div className="footer-col-links">
                  {col.links.map((lnk, j) => (
                    <a key={j} href={lnk.href}>{lnk.label}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">{footer.copyright}</span>
            <span className="footer-made-with">Made with <span>♥</span> for creators</span>
          </div>
        </div>
      </footer>

      <ThemeToggle />
    </>
  );
}
