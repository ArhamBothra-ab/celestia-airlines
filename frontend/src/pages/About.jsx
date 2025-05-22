import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About Celestia Airlines</h1>
        <p className="tagline">Reaching New Heights Together</p>
      </div>

      <div className="about-section">
        <h2>Our Story</h2>
        <p>
          Founded in 2023, Celestia Airlines emerged with a vision to transform air travel
          through innovation, comfort, and sustainability. Our commitment to excellence
          has made us one of the fastest-growing airlines in the region.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <h3>Our Fleet</h3>
          <p>
            Operating a modern fleet of over 50 aircraft, including the latest Airbus A350
            and Boeing 787 Dreamliner, we ensure efficient and comfortable travel while
            minimizing our environmental impact.
          </p>
        </div>

        <div className="about-card">
          <h3>Destinations</h3>
          <p>
            We connect passengers to over 100 destinations across 45 countries, making
            global travel accessible and convenient for all our customers.
          </p>
        </div>

        <div className="about-card">
          <h3>Sustainability</h3>
          <p>
            Committed to a greener future, we're investing in sustainable aviation fuel
            and implementing eco-friendly practices across our operations.
          </p>
        </div>

        <div className="about-card">
          <h3>Awards</h3>
          <p>
            Recognized for excellence in customer service and operational efficiency,
            we're proud recipients of multiple industry awards.
          </p>
        </div>
      </div>

      <div className="about-section">
        <h2>Our Values</h2>
        <div className="values-list">
          <div className="value-item">
            <h4>Safety First</h4>
            <p>Safety is our top priority in every aspect of our operations.</p>
          </div>
          <div className="value-item">
            <h4>Customer Focus</h4>
            <p>We're dedicated to exceeding our customers' expectations.</p>
          </div>
          <div className="value-item">
            <h4>Innovation</h4>
            <p>Continuously improving our services through technological advancement.</p>
          </div>
          <div className="value-item">
            <h4>Sustainability</h4>
            <p>Committed to reducing our environmental impact.</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat">
          <h3>50+</h3>
          <p>Aircraft</p>
        </div>
        <div className="stat">
          <h3>100+</h3>
          <p>Destinations</p>
        </div>
        <div className="stat">
          <h3>45+</h3>
          <p>Countries</p>
        </div>
        <div className="stat">
          <h3>5M+</h3>
          <p>Happy Passengers</p>
        </div>
      </div>
    </div>
  );
}

export default About;
