import React from 'react';
import './TravelInsurance.css';

function TravelInsurance() {
  return (
    <div className="insurance-container">
      <h1>Travel Insurance</h1>
      <div className="insurance-content">
        <section>
          <h2>Why Get Travel Insurance?</h2>
          <p>Protect your journey with comprehensive coverage for unexpected events.</p>
          <ul>
            <li>Trip cancellation coverage</li>
            <li>Medical emergency coverage</li>
            <li>Lost baggage protection</li>
            <li>Flight delay compensation</li>
          </ul>
        </section>

        <section>
          <h2>Coverage Options</h2>
          <div className="insurance-plans">
            <div className="plan">
              <h3>Basic Plan</h3>
              <ul>
                <li>Trip cancellation up to $3,000</li>
                <li>Medical coverage up to $10,000</li>
                <li>Lost baggage up to $500</li>
              </ul>
            </div>
            <div className="plan">
              <h3>Premium Plan</h3>
              <ul>
                <li>Trip cancellation up to $10,000</li>
                <li>Medical coverage up to $50,000</li>
                <li>Lost baggage up to $2,000</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2>How to Purchase</h2>
          <p>Add travel insurance during the booking process or contact our customer service for existing bookings.</p>
        </section>
      </div>
    </div>
  );
}

export default TravelInsurance;
