import React from 'react';
import './Baggage.css';

function Baggage() {
  return (
    <div className="baggage-container">
      <h1>Baggage Information</h1>
      <div className="baggage-content">
        <section>
          <h2>Carry-On Baggage</h2>
          <ul>
            <li>1 personal item (max. 40x30x15 cm)</li>
            <li>1 cabin bag (max. 55x40x20 cm)</li>
            <li>Maximum weight: 7 kg per item</li>
          </ul>
        </section>

        <section>
          <h2>Checked Baggage</h2>
          <ul>
            <li>Economy: 23 kg</li>
            <li>Business: 32 kg</li>
            <li>First Class: 32 kg x 2</li>
          </ul>
        </section>

        <section>
          <h2>Special Items</h2>
          <p>Special arrangements needed for:</p>
          <ul>
            <li>Sports equipment</li>
            <li>Musical instruments</li>
            <li>Medical equipment</li>
          </ul>
        </section>

        <section>
          <h2>Restricted Items</h2>
          <p>Please review our list of prohibited items before packing.</p>
        </section>
      </div>
    </div>
  );
}

export default Baggage;
