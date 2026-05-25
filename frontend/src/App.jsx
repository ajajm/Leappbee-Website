import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { API_BASE } from './utils/api';

function App() {
  const [view, setView] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'landing';
  });
  const [token, setToken] = useState(null);

  // Check localStorage for token and verify it on mount
  useEffect(() => {
    const cachedToken = localStorage.getItem('leappbee_admin_token');
    if (cachedToken) {
      setToken(cachedToken);
      
      // Verify token authenticity with backend
      fetch(`${API_BASE}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${cachedToken}` }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Token expired or invalid');
        }
        return res.json();
      })
      .then(data => {
        console.log('Admin session restored:', data.username);
        if (window.location.pathname === '/admin') {
          setView('admin');
        }
      })
      .catch(err => {
        console.warn('Session verification failed, logging out.');
        localStorage.removeItem('leappbee_admin_token');
        setToken(null);
        if (window.location.pathname === '/admin') {
          setView('login');
        }
      });
    } else if (window.location.pathname === '/admin') {
      setView('login');
    }
  }, []);

  const handleAdminSuccess = (newToken) => {
    setToken(newToken);
    setView('admin');
    window.history.pushState({}, '', '/admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('leappbee_admin_token');
    setToken(null);
    setView('login');
  };

  const goToLanding = () => {
    setView('landing');
    window.history.pushState({}, '', '/');
  };

  const goToAdmin = () => {
    setView(token ? 'admin' : 'login');
    window.history.pushState({}, '', '/admin');
  };

  return (
    <>
      {view === 'landing' && (
        <LandingPage onAdminClick={goToAdmin} />
      )}

      {view === 'login' && (
        <AdminLogin 
          onLoginSuccess={handleAdminSuccess} 
          onBack={goToLanding} 
        />
      )}

      {view === 'admin' && (
        <AdminDashboard 
          token={token} 
          onLogout={handleLogout} 
          onBack={goToLanding} 
        />
      )}
    </>
  );
}

export default App;
