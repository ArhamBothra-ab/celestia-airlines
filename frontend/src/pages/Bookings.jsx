import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { notify } from '../services/toast';
import ConfirmDialog from '../components/ConfirmDialog';
import './Bookings.css';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    bookingId: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      notify.warn('Please log in to view your bookings');
      navigate('/auth');
      return;
    }

    setLoading(true);
    api.getBookings()
      .then(data => {
        setBookings(data);
        setError('');
        setLoading(false);
        if (data.length === 0) {
          notify.info('You have no bookings yet');
        }
      })
      .catch(err => {
        if (err.message.includes('Authentication')) {
          localStorage.removeItem('token');
          notify.error('Your session has expired. Please log in again');
          navigate('/auth');
        } else {
          notify.error(err.message || 'Failed to fetch your bookings');
        }
        setBookings([]);
        setLoading(false);
      });
  };

  const handleCancel = (bookingId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      notify.warn('Please log in to cancel bookings');
      navigate('/auth');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      bookingId: bookingId
    });
  };

  const confirmCancellation = async () => {
    const bookingId = confirmDialog.bookingId;
    setConfirmDialog({ isOpen: false, bookingId: null });

    try {
      setLoading(true);
      await api.cancelBooking(bookingId);
      notify.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      notify.error(err.message || 'Failed to cancel booking');
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      notify.warn('Please log in to make payment');
      navigate('/auth');
      return;
    }

    try {
      setLoading(true);
      await api.payBooking(bookingId);
      notify.success('Payment successful! Your ticket has been generated.');
      fetchBookings();
    } catch (err) {
      notify.error(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="bookings-page">
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message="Are you sure you want to cancel this booking?"
        onConfirm={confirmCancellation}
        onCancel={() => setConfirmDialog({ isOpen: false, bookingId: null })}
      />

      <h2>Your Bookings</h2>
      {error && (
        <div className="bookings-error" style={{color:'#b71c1c',marginBottom:16,fontWeight:500}}>{error}</div>
      )}
      {bookings.length === 0 && !error ? (
        <div className="bookings-empty" style={{boxShadow: 'none', background: 'none', maxWidth: '100vw', width: '100vw', alignSelf: 'center'}}>
          <p>You have no current bookings.</p>
          <a href="/flights" className="primary-btn">Book Now</a>
        </div>
      ) : null}
      {bookings.length > 0 && !error && (
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
