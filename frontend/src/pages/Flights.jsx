import { useEffect, useState } from 'react';
import axios from 'axios';

function Flights() {
  const [flights, setFlights] = useState([]);
  const [showFlights, setShowFlights] = useState(false);

  const fetchFlights = () => {
    axios.get('http://localhost:5000/flights')
      .then(response => {
        setFlights(response.data);
        setShowFlights(true);
      })
      .catch(error => {
        console.error('Error fetching flights:', error);
      });
  };

  return (
    <div className="page-container">
      <h2>Available Flights ✈️</h2>
      <button className="primary-btn" onClick={fetchFlights}>
        View Flights
      </button>

      {showFlights && (
        <ul className="features-list" style={{ marginTop: '30px' }}>
          {flights.map(flight => (
            <li key={flight.id}>
              {flight.origin} → {flight.destination} on {flight.date} at {flight.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Flights;
