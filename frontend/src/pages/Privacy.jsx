import React from 'react';
import './Privacy.css';

function Privacy() {
  return (
    <div className="privacy-page">
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: May 22, 2025</p>
      </div>

      <div className="privacy-content">
        <section>
          <h2>1. Information We Collect</h2>
          <p>At Celestia Airlines, we collect various types of information to provide you with the best possible service:</p>
          <ul>
            <li>Personal identification information (Name, email address, phone number, etc.)</li>
            <li>Travel preferences and history</li>
            <li>Payment information</li>
            <li>Device and browser information</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information for:</p>
          <ul>
            <li>Processing your bookings and payments</li>
            <li>Providing customer support</li>
            <li>Sending important flight updates and notifications</li>
            <li>Personalizing your experience</li>
            <li>Improving our services</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information.
            This includes encryption, secure servers, and regular security audits.
          </p>
        </section>

        <section>
          <h2>4. Data Sharing</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Airport authorities (as required by law)</li>
            <li>Partner airlines (for connecting flights)</li>
            <li>Payment processors</li>
            <li>Government agencies (when legally required)</li>
          </ul>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2>6. Cookies Policy</h2>
          <p>
            We use cookies to enhance your browsing experience and analyze website traffic.
            You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            privacy@celestiaairlines.com
            <br />
            Electronic City, Bangalore
          </p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
