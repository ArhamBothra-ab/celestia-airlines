import React from 'react';
import { useNavigate } from 'react-router-dom';
import { notify } from '../services/toast';
import './FlightCard.css';

function FlightCard({ flight }) {
  const navigate = useNavigate();

  const handleBookClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      notify.warn('Please log in to book this flight');
      navigate('/auth');
      return;
    }
    // Add booking logic here
    notify.info('Proceeding to booking...');
  };

  return (
    <div className="flight-card">
      <div className="flight-route">
        <h3>
          {flight.origin_airport_city} ({flight.origin_airport_code})
          &nbsp;➡&nbsp;
          {flight.destination_city || flight.destination_airport_city} ({flight.destination_airport_code})
        </h3>
        <p className="flight-date">
          {flight.departure_date} {flight.departure_time} → {flight.arrival_date} {flight.arrival_time}
        </p>
        <p className="flight-number">Flight: {flight.flight_number}</p>
      </div>
      <div className="flight-details">
        <p className="flight-class">{flight.class}</p>
        <p className="flight-price">${flight.price}</p>
        <p className="flight-seats">Seats: {flight.seats}</p>
      </div>
      <button className="book-button" onClick={handleBookClick}>
        Book Flight
      </button>
    </div>
  );
}

export default FlightCard;