import React, { useState, useEffect } from 'react';
import './Bookings.css';
import { useNavigate } from 'react-router-dom';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to view your bookings.');
      return;
    }
    fetch('http://localhost:5000/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error('Error fetching bookings:', err));
  };

  const handleCancel = (bookingId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to cancel bookings.');
      return;
    }
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      fetch(`http://localhost:5000/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(() => {
          fetchBookings();
          alert('Booking cancelled successfully');
        })
        .catch(err => alert('Error cancelling booking: ' + err.message));
    }
  };

  return (
    <div className="bookings-page">
      <h2>Your Bookings</h2>
      {bookings.length === 0 ? (
        <div className="bookings-empty" style={{boxShadow: 'none', background: 'none', maxWidth: '100vw', width: '100vw', alignSelf: 'center'}}>
          <p>You have no current bookings.</p>
          <a href="/flights" className="primary-btn">Book Now</a>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>Booking #{booking.id}</h3>
                <span className="booking-status">{booking.status || 'Confirmed'}</span>
              </div>
              <div className="booking-details">
                <p className="route">
                  {booking.origin_airport_city} ({booking.origin_airport_code}) ➡ {booking.destination_city || booking.destination_airport_city} ({booking.destination_airport_code})
                </p>
                <p className="date-time">
                  {booking.departure_date} {booking.departure_time} → {booking.arrival_date} {booking.arrival_time}
                </p>
                <p className="flight-number">Flight: {booking.flight_number}</p>
                <p className="class">Class: {booking.class}</p>
                <p className="flight-price">Price: ${booking.price}</p>
                <p className="payment-status">Payment: {booking.payment_status || 'Pending'}</p>
              </div>
              {booking.payment_status === 'Paid' && (
                <button className="ticket-button" onClick={() => navigate('/tickets', { state: { fromBookings: true } })}>View Ticket</button>
              )}
              <button 
                className="cancel-button"
                onClick={() => handleCancel(booking.id)}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
