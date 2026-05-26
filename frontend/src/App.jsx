import React, { useEffect } from 'react';
import Lenis from 'lenis';
import LandingPage from './components/LandingPage';

function App() {
  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('leappbee-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Smooth scroll to anchor links using Lenis
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.hash && link.origin === window.location.origin) {
        const targetElement = document.querySelector(link.hash);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, {
            offset: -64, // offset for sticky navbar height (64px)
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      }
    };

    window.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <LandingPage />
    </>
  );
}

export default App;
