import React, { useState, useEffect } from 'react';
import './Bookings.css';

function Tickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to view your tickets.');
      return;
    }
    fetch('http://localhost:5000/bookings/tickets', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.error('Error fetching tickets:', err));
  };

  return (
    <div className="bookings-page">
      <h2>Your Tickets</h2>
      <div className="bookings-grid">
        {tickets.map(ticket => (
          <div key={ticket.id} className="booking-card">
            <div className="booking-header">
              <h3>Ticket #{ticket.ticket_number}</h3>
              <span className="booking-status">Issued</span>
            </div>
            <div className="booking-details">
              <p className="route">
                {ticket.origin_airport_name} ({ticket.origin_airport_code}) ➡ {ticket.destination_airport_name} ({ticket.destination_airport_code})
              </p>
              <p className="date-time">
                {ticket.departure_date} {ticket.departure_time} → {ticket.arrival_date} {ticket.arrival_time}
              </p>
              <p className="flight-number">Flight: {ticket.flight_number}</p>
              <p className="ticket-issued">Issued At: {ticket.issued_at}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tickets; 