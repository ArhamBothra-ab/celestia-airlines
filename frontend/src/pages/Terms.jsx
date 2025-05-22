import React from 'react';
import './Terms.css';

function Terms() {
  return (
    <div className="terms-container">
      <h1>Terms of Service</h1>
      <div className="terms-content">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using Celestia Airlines' services, you agree to be bound by these Terms of Service.</p>
        </section>
        
        <section>
          <h2>2. Booking and Ticketing</h2>
          <p>All bookings are subject to availability and price changes. Tickets are non-transferable unless explicitly stated.</p>
        </section>
        
        <section>
          <h2>3. Cancellation Policy</h2>
          <p>Cancellation policies vary by ticket type. Please review your ticket terms at the time of booking.</p>
        </section>
        
        <section>
          <h2>4. Baggage Policy</h2>
          <p>Baggage allowances and fees vary by route and ticket class. Additional charges may apply for excess baggage.</p>
        </section>
        
        <section>
          <h2>5. User Responsibilities</h2>
          <p>Users are responsible for providing accurate information and maintaining the security of their accounts.</p>
        </section>
      </div>
    </div>
  );
}

export default Terms;
