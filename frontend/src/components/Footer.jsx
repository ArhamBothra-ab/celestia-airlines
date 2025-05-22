import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Company</h3>
          <Link to="/contact">Contact Us</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>

        <div className="footer-section">
          <h3>Resources</h3>
          <Link to="/booking-guide">Booking Guide</Link>
          <Link to="/baggage">Baggage Info</Link>
          <Link to="/travel-insurance">Travel Insurance</Link>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>24/7 Customer Service</p>
          <p>1-800-CELESTIA</p>
          <p>support@celestiaairlines.com</p>
          <p>Electronic City, Bangalore</p>
        </div>

        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Celestia Airlines. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
