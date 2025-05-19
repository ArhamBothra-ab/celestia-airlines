import React from 'react';
import './FlightCard.css';

function FlightCard({ flight, onBook }) {
  const handleBook = () => {
    if (onBook) {
      onBook(flight.id);
    }
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
      <button className="book-button" onClick={handleBook}>
        Book Flight
      </button>
    </div>
  );
}

export default FlightCard; 