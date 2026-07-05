import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);
import { parseVideoUrl } from '../utils/videoParser';
import data from '../data.json';
import { FluidMorphBg } from './FluidMorphBg';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';

/* ══════════════════════════════════════════════════════════
   ANIMATION PRIMITIVES
   ══════════════════════════════════════════════════════════ */

const EASE = [0.16, 1, 0.3, 1];

function Reveal({ children, delay = 0, className = '', y = 24 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
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
          <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
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
      }, 250);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  return <span className={`word-rotator-text ${animClass}`}>{words[index]}</span>;
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
        const increment = target / (1800 / 16);
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



/* ══════════════════════════════════════════════════════════
   INTERACTIVE HERO BACKGROUND
   ══════════════════════════════════════════════════════════ */

function InteractiveHeroBg() {
  return (
    <div className="hero-interactive-bg">
      <div className="fluid-morph-bg-container">
        <FluidMorphBg />
      </div>



      {/* Subtle grid pattern */}
      <div className="hero-grid-pattern" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ORBITING CIRCLES — Creative Agency Icons
   ══════════════════════════════════════════════════════════ */

function OrbitingCircles() {
  return (
    <div className="orbit-wrapper">
      {/* Center icon — LeappBee logo */}
      <div className="orbit-center">
        <img src="/leapbee_logo.jpg" alt="LeappBee" className="orbit-center-logo" />
      </div>

      {/* Outer orbit — 5 icons */}
      <div className="orbit-ring orbit-ring-outer">
        <div className="orbit-icon" style={{ '--i': 0, '--total': 5 }}>
          {/* YouTube */}
          <svg viewBox="0 0 24 24" fill="#FF0000" width="24" height="24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
        <div className="orbit-icon" style={{ '--i': 1, '--total': 5 }}>
          {/* Instagram */}
          <svg viewBox="0 0 24 24" width="24" height="24">
            <defs><linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#feda75" /><stop offset="25%" stopColor="#fa7e1e" /><stop offset="50%" stopColor="#d62976" /><stop offset="75%" stopColor="#962fbf" /><stop offset="100%" stopColor="#4f5bd5" /></linearGradient></defs>
            <path fill="url(#ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
          </svg>
        </div>
        <div className="orbit-icon" style={{ '--i': 2, '--total': 5 }}>
          {/* TikTok */}
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.78 1.54V6.84a4.83 4.83 0 0 1-1.02-.15z" />
          </svg>
        </div>
        <div className="orbit-icon" style={{ '--i': 3, '--total': 5 }}>
          {/* Premiere Pro */}
          <svg viewBox="0 0 24 24" width="24" height="24">
            <rect width="24" height="24" rx="4" fill="#9999FF" />
            <text x="4" y="17" fill="#1a1a2e" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="800">Pr</text>
          </svg>
        </div>
        <div className="orbit-icon" style={{ '--i': 4, '--total': 5 }}>
          {/* After Effects */}
          <svg viewBox="0 0 24 24" width="24" height="24">
            <rect width="24" height="24" rx="4" fill="#9999FF" />
            <text x="3" y="17" fill="#1a1a2e" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="800">Ae</text>
          </svg>
        </div>
      </div>

      {/* Inner orbit — 4 icons, reversed */}
      <div className="orbit-ring orbit-ring-inner">
        <div className="orbit-icon" style={{ '--i': 0, '--total': 4 }}>
          {/* Figma */}
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#0ACF83" d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" />
            <path fill="#A259FF" d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" />
            <path fill="#F24E1E" d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" />
            <path fill="#FF7262" d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" />
            <path fill="#1ABCFE" d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" />
          </svg>
        </div>
        <div className="orbit-icon" style={{ '--i': 1, '--total': 4 }}>
          {/* Slack */}
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#E01E5A" d="M5.042 15.166a2.528 2.528 0 0 1-2.52 2.521A2.528 2.528 0 0 1 0 15.166a2.528 2.528 0 0 1 2.522-2.521h2.52v2.521zm1.271 0a2.528 2.528 0 0 1 2.521-2.521 2.528 2.528 0 0 1 2.521 2.521v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.521v-6.313z" />
            <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" />
            <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.522 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.164 0a2.528 2.528 0 0 1 2.522 2.522v6.312z" />
            <path fill="#ECB22E" d="M15.164 18.956a2.528 2.528 0 0 1 2.522 2.522A2.528 2.528 0 0 1 15.164 24a2.528 2.528 0 0 1-2.521-2.522v-2.522h2.521zm0-1.27a2.528 2.528 0 0 1-2.521-2.522 2.528 2.528 0 0 1 2.521-2.521h6.314A2.528 2.528 0 0 1 24 15.164a2.528 2.528 0 0 1-2.522 2.522h-6.314z" />
          </svg>
        </div>
        <div className="orbit-icon" style={{ '--i': 2, '--total': 4 }}>
          {/* Twitter / X */}
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
        <div className="orbit-icon" style={{ '--i': 3, '--total': 4 }}>
          {/* DaVinci / Video icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <polygon points="23 7 16 12 23 17 23 7" fill="var(--accent)" stroke="var(--accent)" />
            <rect x="1" y="5" width="15" height="14" rx="2" stroke="var(--accent)" />
          </svg>
        </div>
      </div>
    </div>
  );
}



/* ══════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ══════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [longTab, setLongTab] = useState('All');
  const [shortTab, setShortTab] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);

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

  /* ── Testimonials for marquee (two rows, opposite directions) ── */
  const testiRow1 = [...testimonials.row1, ...testimonials.row1];
  const testiRow2 = [...(testimonials.row2 || []), ...(testimonials.row2 || [])];

  const statIcons = [
    <svg key="i" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    <svg key="v" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>,
    <svg key="t" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
    <svg key="h" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  ];

  return (
    <>
      <ScrollProgress />

      {/* ══════════════════════════════════════════════════
          HERO — Left Aligned
          ══════════════════════════════════════════════════ */}
      <header className="hero" id="home">
        <InteractiveHeroBg />

        <div className="hero-content">
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
              <a href={hero.cta_primary.href} className="btn-accent btn-lg btn-animated" target="_blank" rel="noreferrer">
                <span className="btn-text-base">{hero.cta_primary.label}</span>
                <span className="btn-text-hover">{hero.cta_primary.label}</span>
              </a>
              <a href={hero.cta_secondary.href} className="btn-secondary">{hero.cta_secondary.label}</a>
            </div>
            <div className="hero-trust-row">
              <span className="hero-trust-item">No contracts</span>
              <span className="hero-trust-sep">•</span>
              <span className="hero-trust-item">48h first draft</span>
              <span className="hero-trust-sep">•</span>
              <span className="hero-trust-item">Dedicated team</span>
              <span className="hero-trust-sep">•</span>
              <span className="hero-trust-item">Cancel anytime</span>
            </div>
          </div>

          <div className="hero-orbit-col">
            <OrbitingCircles />
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          PROCESS — Timeline
          ══════════════════════════════════════════════════ */}
      <section id="process" className="process-section alt-bg">
        <div className="section-inner">
          <div className="wrap center">
            <Reveal>
              <span className="section-kicker">How it works</span>
              <h2 className="section-h">
                A process built for <span className="accent-serif">consistency</span>
              </h2>
              <p className="section-sub center" style={{ marginBottom: 0 }}>
                From raw footage to publish-ready content, we handle the full production loop so you can focus on creating.
              </p>
            </Reveal>

            <motion.div
              className="process-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {proc.steps.map((step, idx) => {
                // High-end bullet items for each phase
                const bullets = [
                  ["Channel & content audit", "Data-backed hook engineering", "Watch-time optimization"],
                  ["Dedicated lead editor", "Pro motion designer", "Growth & retention strategist"],
                  ["One-click draft approval", "Guaranteed delivery windows", "Full commercial usage rights"]
                ][idx] || [];

                return (
                  <motion.div className="process-card" key={step.num} variants={staggerItem}>
                    <div className="process-card-glow" />
                    <div className="process-card-grid" />
                    <span className="process-large-num">{step.num}</span>
                    <h3 className="process-card-title">{step.title}</h3>
                    <p className="process-card-desc">{step.desc}</p>
                    <div className="process-card-bullets">
                      {bullets.map((bullet, bulletIdx) => (
                        <div className="process-bullet-item" key={bulletIdx}>
                          <span className="process-bullet-check" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <Reveal delay={0.15}>
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
      <section id="work" className="work-section">
        <div className="work-section-grid" />
        <div className="section-inner">
          <div className="wrap">
            {/* Long form */}
            <Reveal>
              <div className="center" style={{ marginBottom: 32 }}>
                <span className="section-kicker">Featured work</span>
                <h2 className="section-h">Long Form <span className="accent-serif">Edits</span></h2>
                <p className="section-sub center">Full-length videos engineered for watch time, including YouTube, podcasts, and documentaries.</p>
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
                ? <div className="empty">No videos yet. Add some from the admin panel.</div>
                : shownLong.map(v => <VCard key={v._id} v={v} />)
              }
            </motion.div>

            {/* Short form */}
            <Reveal>
              <div className="center" style={{ marginTop: 80, marginBottom: 32 }}>
                <span className="section-kicker">Viral edits</span>
                <h2 className="section-h">Short Form <span className="accent-serif">Clips</span></h2>
                <p className="section-sub center">High-retention cuts for Reels, TikTok & YouTube Shorts, built to stop the scroll.</p>
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
                ? <div className="empty">No videos yet. Add some from the admin panel.</div>
                : shownShort.map(v => <VCard key={v._id} v={v} short />)
              }
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      {/* ══════════════════════════════════════════════════
          STATS — Inline Band
          ══════════════════════════════════════════════════ */}
      <section id="impact" className="stats-section alt-bg">
        {/* Background Overlays */}
        <div className="stats-bg-grid" />
        <div className="stats-bg-glow stats-bg-glow-1" />
        <div className="stats-bg-glow stats-bg-glow-2" />

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
              <p className="stats-sub">These aren't projections. They're real results from creators who trusted us with their content.</p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="stats-row">
                {stats.items.map((s, i) => (
                  <div className="stat-card" key={s.number}>
                    <div className="stat-icon">{statIcons[i]}</div>
                    <span className="stat-num"><AnimatedNumber value={s.number} /></span>
                    <p className="stat-lbl">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS — Two-Row Marquee
          ══════════════════════════════════════════════════ */}
      <section id="testimonials">
        <div className="section-inner">
          <div className="wrap">
            <Reveal>
              <div className="testi-section-header">
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)'
                }}>Client Results</span>
                <h2 className="testi-section-title">
                  Real creators. <span className="accent-serif">Real growth.</span>
                </h2>
                <p className="testi-section-sub">
                  We let the numbers talk. Here's what creators say after working with LeappBee.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="marquee-container">
            {/* Row 1 — scrolls left */}
            <div className="marquee-row">
              <div className="marquee-track">
                {testiRow1.map((t, i) => (
                  <figure className="testi-card" key={`r1-${i}`}>
                    <div className="testi-card-header">
                      <img src={t.avatar} alt={t.name} className="testi-avatar" />
                      <div className="testi-author-info">
                        <figcaption className="testi-name">{t.name}</figcaption>
                        <p className="testi-handle">{t.handle}</p>
                      </div>
                    </div>
                    <blockquote className="testi-quote">{t.quote}</blockquote>
                  </figure>
                ))}
              </div>
            </div>

            {/* Row 2 — scrolls right (reverse) */}
            <div className="marquee-row marquee-reverse">
              <div className="marquee-track">
                {testiRow2.map((t, i) => (
                  <figure className="testi-card" key={`r2-${i}`}>
                    <div className="testi-card-header">
                      <img src={t.avatar} alt={t.name} className="testi-avatar" />
                      <div className="testi-author-info">
                        <figcaption className="testi-name">{t.name}</figcaption>
                        <p className="testi-handle">{t.handle}</p>
                      </div>
                    </div>
                    <blockquote className="testi-quote">{t.quote}</blockquote>
                  </figure>
                ))}
              </div>
            </div>

            {/* Edge fade gradients */}
            <div className="marquee-fade-left" />
            <div className="marquee-fade-right" />
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      {/* ══════════════════════════════════════════════════
          CONTACT
          ══════════════════════════════════════════════════ */}
      <section id="contact" className="alt-bg">
        <div className="section-inner">
          <div className="wrap center">
            <Reveal>
              <span className="section-kicker">{contact.label}</span>
              <h2 className="section-h">
                Let's <span className="accent-serif">start</span> something
              </h2>
              <p className="section-sub center" style={{ marginBottom: 40 }}>
                Pick how you want to reach us. We're a real team. No bots, no 48-hour email delays.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
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
                        <div className="ccard-sub">Team online · 7 days a week</div>
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
                        <div className="ccard-sub">Replies within minutes</div>
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
      <section id="faq">
        <div className="section-inner">
          <div className="wrap">
            <div className="faq-layout">
              <Reveal>
                <div className="faq-intro">
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)'
                  }}>FAQ</span>
                  <h2 className="faq-heading">
                    Questions<br />
                    <span className="accent-serif">answered.</span>
                  </h2>
                  <p className="faq-sub">
                    Everything you need to know before getting started. Still unsure? Book a free call and we'll walk you through it.
                  </p>
                  <a href={hero.cta_primary.href} className="btn-accent" style={{ marginTop: 8 }} target="_blank" rel="noreferrer">
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


    </>
  );
}
