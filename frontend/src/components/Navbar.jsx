import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

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
        <Link to="/flights">Flights</Link>
        {isAuthenticated ? (
          <>
            <Link to="/bookings">My Bookings</Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
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
