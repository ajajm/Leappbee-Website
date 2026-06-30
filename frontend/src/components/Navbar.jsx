import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import data from '../data.json';

const LeappbeeLogo = ({ size = 20 }) => (
  <img
    src="/leapbee_logo.jpg"
    alt="Leappbee"
    style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'inline-block' }}
  />
);

export default function Navbar() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { brand, hero } = data;
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setNavScrolled(currentScrollY > 10);

      if (currentScrollY <= 20) {
        gsap.to('.navbar-wrapper', {
          yPercent: 0,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling down -> hide navbar
        gsap.to('.navbar-wrapper', {
          yPercent: -130,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up -> show navbar
        gsap.to('.navbar-wrapper', {
          yPercent: 0,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="navbar-wrapper">
        <nav className={`navbar-pill${navScrolled ? ' scrolled' : ''}`}>
          <div className="nav-pill-left">
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/#process" className="nav-link">Process</Link>
            <Link to="/#work" className="nav-link">Work</Link>
          </div>
          <Link to="/" className="nav-pill-logo">
            <LeappbeeLogo size={22} />
            {brand.name}
          </Link>
          <div className="nav-pill-right">
            <a href={hero.cta_primary.href} className="nav-btn-contact" target="_blank" rel="noreferrer">Contact</a>
          </div>
          <button className="mobile-nav-toggle" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </nav>
      </div>

      {/* ═══ MOBILE MENU ═══ */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="mobile-menu-drawer" onClick={e => e.stopPropagation()}>
          <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="mobile-menu-links">
            <Link to="/services" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
            <Link to="/#process" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Process</Link>
            <Link to="/#work" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Work</Link>
            <Link to="/#testimonials" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Clients</Link>
            <Link to="/#faq" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
            <a href={hero.cta_primary.href} className="btn-accent" onClick={() => setIsMobileMenuOpen(false)}>Book a call</a>
          </div>
        </div>
      </div>
    </>
  );
}
