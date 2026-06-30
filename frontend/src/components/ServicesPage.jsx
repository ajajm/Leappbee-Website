import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ══════════════════════════════════════════════════════════
   SERVICE ICONS
   ══════════════════════════════════════════════════════════ */
const ServiceIcons = {
  'Long-Form Editing': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  'Short-Form & Reels': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.34z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  'Motion Graphics': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  'Thumbnails': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  'SEO & Strategy': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  'Social Media Management': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

/* ══════════════════════════════════════════════════════════
   HIGH-QUALITY CUSTOM GENERATED SERVICE MOCKUPS
   ══════════════════════════════════════════════════════════ */
const ServiceImages = {
  'Long-Form Editing': '/service_longform.png',
  'Short-Form & Reels': '/service_shorts.png',
  'Motion Graphics': '/service_motion.png',
  'Thumbnails': '/service_thumbnail.png',
  'SEO & Strategy': '/service_seo.png',
  'Social Media Management': '/service_smm.png',
};

const servicesData = [
  { name: 'Long-Form Editing', desc: 'YouTube optimised edits built for watch time. We focus on hooks, pacing, b-roll and colour grading to keep viewers watching.', tag: 'YouTube · Podcasts' },
  { name: 'Short-Form & Reels', desc: 'Vertical clips engineered for the algorithm. We cut for first-second attention and strong watch-through on Reels, TikTok & Shorts.', tag: 'Reels · TikTok · Shorts' },
  { name: 'Motion Graphics', desc: 'Custom animations, lower thirds, chapter cards and logo stings that elevate your brand identity across every video.', tag: 'After Effects · Premiere' },
  { name: 'Thumbnails', desc: 'Split-tested thumbnail designs that consistently push CTR above industry benchmarks to get the click.', tag: 'Photoshop · Figma' },
  { name: 'SEO & Strategy', desc: 'Titles, descriptions, tags and upload cadence built around keyword research, so the algorithm works for you.', tag: 'YouTube SEO · Analytics' },
  { name: 'Social Media Management', desc: 'End-to-end management of your posting schedule, community replies, and platform-native content repurposing.', tag: 'Multi-platform' },
];

export default function ServicesPage() {
  const { hero } = data;

  useGSAP(() => {
    // 1. Header entrance timeline
    const headerTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    gsap.set(['.services-kicker', '.services-title', '.services-intro'], { opacity: 0 });

    headerTl.fromTo('.services-kicker', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo('.services-title', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
      .fromTo('.services-intro', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');

    // 2. Services track stagger reveal on scroll
    gsap.fromTo('.service-track',
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.services-track-list',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    // 3. CTA box reveal
    gsap.fromTo('.services-cta-box',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-cta-section',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  return (
    <main className="page-main">
      <section className="services-header-section">
        <div className="wrap">
          <div className="services-header-content">
            <span className="services-kicker">The Suite</span>
            <h1 className="services-title">
              Everything your content <span className="accent-serif">requires.</span>
            </h1>
            <p className="services-intro">
              From raw footage to finished posts. We operate as your dedicated post-production bay, handling the technical and strategic heavy lifting so you can focus on creating.
            </p>
          </div>
        </div>
      </section>

      <section className="services-list-section">
        <div className="wrap">
          <div className="services-track-list">
            {servicesData.map((s, index) => (
              <div className="service-track" key={s.name}>
                <div className="service-track-meta">
                  <span className="track-id">TRK_{String(index + 1).padStart(2, '0')}</span>
                  <div className="service-icon">
                    {ServiceIcons[s.name]}
                  </div>
                </div>
                <div className="service-track-body">
                  <h3 className="service-track-name">{s.name}</h3>
                  <p className="service-track-desc">{s.desc}</p>
                </div>
                
                {/* Custom-generated high-quality preview image */}
                <div className="service-track-visual">
                  <div className="service-image-container">
                    <img 
                      src={ServiceImages[s.name]} 
                      alt={s.name}
                      className="service-track-img"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="service-track-aside">
                  <span className="service-tag-pill">{s.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="services-cta-section">
        <div className="wrap center">
          <div className="services-cta-box">
            <h2>Ready to start rolling?</h2>
            <p>Book a free discovery call to discuss your channel's workflow.</p>
            <a href={hero.cta_primary.href} className="btn-accent btn-lg btn-animated" target="_blank" rel="noreferrer">
              <span className="btn-text-base">{hero.cta_primary.label}</span>
              <span className="btn-text-hover">{hero.cta_primary.label}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
