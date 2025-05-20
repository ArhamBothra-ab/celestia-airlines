import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/flights">Flights</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} Celestia Airlines. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
