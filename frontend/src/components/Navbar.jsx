import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');
  let isAdmin = false;
  if (isAuthenticated) {
    try {
      const payload = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      isAdmin = payload.isAdmin === true;
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Celestia Airlines</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/flights">Flights</Link>
        <Link to="/bookings">My Bookings</Link>
        <Link to="/profile">Profile</Link>
        {isAdmin && <Link to="/admin">Admin Panel</Link>}
        {isAuthenticated ? (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        ) : (
          <Link to="/auth" className="auth-button">
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
