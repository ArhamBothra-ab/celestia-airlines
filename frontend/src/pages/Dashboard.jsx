import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view your dashboard.');
      setLoading(false);
      return;
    }
    Promise.all([
      fetch('http://localhost:5000/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()),
      fetch('http://localhost:5000/bookings/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json())
    ]).then(([bookingsData, ticketsData]) => {
      setBookings(bookingsData);
      setTickets(ticketsData);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load dashboard data.');
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="page-container"><h2>My Dashboard</h2><p>Loading...</p></div>;
  if (error) return <div className="page-container"><h2>My Dashboard</h2><p style={{color:'red'}}>{error}</p></div>;

  return (
    <div className="page-container">
      <h2>My Dashboard</h2>
      <h3>My Bookings</h3>
      {bookings.length === 0 ? <p>No bookings found.</p> : (
        <table style={{margin:'0 auto',marginBottom:32}}>
          <thead><tr><th>Flight</th><th>Date</th><th>Status</th><th>Payment</th></tr></thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.flight_number}</td>
                <td>{b.departure_date} {b.departure_time}</td>
                <td>{b.status}</td>
                <td>{b.payment_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3>My Tickets</h3>
      {tickets.length === 0 ? <p>No tickets found.</p> : (
        <table style={{margin:'0 auto'}}>
          <thead><tr><th>Ticket #</th><th>Flight</th><th>Issued At</th></tr></thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id}>
                <td>{t.ticket_number}</td>
                <td>{t.flight_number}</td>
                <td>{t.issued_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
