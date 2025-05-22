import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const isAuthenticated = localStorage.getItem('token');

  const updateUserFromToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
        setIsAdmin(payload.isAdmin === true);
        setAvatarUrl(payload.avatar ? 
          `http://localhost:5000${payload.avatar}` : 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name||'User')}&background=f1c40f&color=002147&size=32`
        );
      } catch {
        setUser(null);
        setIsAdmin(false);
        setAvatarUrl('');
      }
    } else {
      setUser(null);
      setIsAdmin(false);
      setAvatarUrl('');
    }
  }, []);

  useEffect(() => {
    updateUserFromToken();
    const handleStorage = () => updateUserFromToken();
    const handleTokenUpdate = () => updateUserFromToken();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('tokenUpdate', handleTokenUpdate);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('tokenUpdate', handleTokenUpdate);
    };
  }, [updateUserFromToken]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/">Celestia Airlines</Link>
        </div>
        <div className="navbar-links" style={{ marginLeft: 'auto' }}>
          <div className="nav-items">
            <Link to="/">Home</Link>
            <Link to="/flights">Flights</Link>
            {isAuthenticated && <Link to="/bookings">My Bookings</Link>}
            {isAdmin && <Link to="/admin">Admin Panel</Link>}
          </div>
          {isAuthenticated ? (
            <div className="user-nav" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Link to="/profile" className="profile-link">
                <img src={avatarUrl} alt="User avatar" className="navbar-avatar" />
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          ) : (
            <Link to="/auth" className="nav-link">Login / Register</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
