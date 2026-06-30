import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import ServicesPage from './components/ServicesPage';

// Helper component to scroll to top or hash elements on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      // If there's a hash, let the browser scroll to the element smoothly
      setTimeout(() => {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          const targetY = targetElement.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [pathname, hash]);

  return null;
}

function AppContent() {
  useEffect(() => {
    // Initialize theme strictly to dark
    document.documentElement.setAttribute('data-theme', 'dark');

    // Smooth scroll to anchor links using native window scrolling
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.hash && link.origin === window.location.origin) {
        const targetElement = document.querySelector(link.hash);
        if (targetElement) {
          e.preventDefault();
          const targetY = targetElement.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
