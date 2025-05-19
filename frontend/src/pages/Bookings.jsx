import { useEffect, useState } from 'react';
import axios from 'axios';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);

  const fetchBookings = () => {
    axios.get('http://localhost:5000/bookings')
      .then(response => {
        setBookings(response.data);
        setShowBookings(true);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  };

  return (
    <div className="page-container">
      <h2>Your Bookings 📋</h2>
      <button className="primary-btn" onClick={fetchBookings}>
        Show My Bookings
      </button>

      {showBookings && (
        <ul className="features-list" style={{ marginTop: '30px' }}>
          {bookings.map(booking => (
            <li key={booking.id}>
              {booking.user} booked from {booking.origin} → {booking.destination} on {booking.date} at {booking.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Bookings;
