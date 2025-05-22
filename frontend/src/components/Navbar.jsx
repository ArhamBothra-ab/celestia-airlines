import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const isAuthenticated = localStorage.getItem('token');

  // Listen for avatar changes (storage event)
  useEffect(() => {
    const updateUser = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser(payload);
          setIsAdmin(payload.isAdmin === true);
          setAvatarUrl(payload.avatar ? `http://localhost:5000${payload.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name||'User')}&background=f1c40f&color=002147&size=32`);
        } catch {
          setUser(null);
          setIsAdmin(false);
          setAvatarUrl(`https://ui-avatars.com/api/?name=User&background=f1c40f&color=002147&size=32`);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setAvatarUrl(`https://ui-avatars.com/api/?name=User&background=f1c40f&color=002147&size=32`);
      }
    };
    updateUser();
    window.addEventListener('storage', updateUser);
    return () => window.removeEventListener('storage', updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-brand">
        <Link to="/">Celestia Airlines</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/flights">Flights</Link>
        <Link to="/bookings">My Bookings</Link>
        {isAdmin && <Link to="/admin">Admin Panel</Link>}
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="navbar-avatar-link" aria-label="My Profile" style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:0}}>
              <span style={{color:'#183251',fontWeight:500,fontSize:'1.02rem'}}>Profile</span>
              <img src={avatarUrl} alt="User avatar" className="navbar-avatar" loading="lazy" />
            </Link>
            <button onClick={handleLogout} className="logout-button" aria-label="Logout">
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" style={{color:'#183251',fontWeight:500,fontSize:'1rem',padding:'0.3rem 0.7rem',textDecoration:'none'}}>Login / Register</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
