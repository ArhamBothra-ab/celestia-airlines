import React from 'react';
import './BookingGuide.css';

function BookingGuide() {
  return (
    <div className="booking-guide-container">
      <h1>Booking Guide</h1>
      <div className="guide-content">
        <section>
          <h2>How to Book Your Flight</h2>
          <ol>
            <li>Search for flights using our search tool</li>
            <li>Select your preferred flight times</li>
            <li>Choose your seat and any extras</li>
            <li>Enter passenger details</li>
            <li>Make your payment</li>
          </ol>
        </section>

        <section>
          <h2>Tips for Best Deals</h2>
          <ul>
            <li>Book in advance for better rates</li>
            <li>Be flexible with your travel dates</li>
            <li>Sign up for our newsletter for special offers</li>
            <li>Check for seasonal promotions</li>
          </ul>
        </section>

        <section>
          <h2>Important Information</h2>
          <p>Please ensure all passenger information matches official travel documents. Name changes may incur additional fees.</p>
        </section>
      </div>
    </div>
  );
}

export default BookingGuide;
