import React, { useState, useEffect } from 'react';
import './Bookings.css';

const API = 'http://localhost:5000';

function AdminPanel() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    // Check if user is admin (decode JWT)
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.email && payload.email.includes('admin')) {
      setIsAdmin(true);
      fetchAll();
    }
  }, []);

  const fetchAll = () => {
    fetchUsers();
    fetchFlights();
    fetchBookings();
    fetchTickets();
  };
  const fetchUsers = () => {
    fetch(`${API}/admin/users`, { headers: authHeader() })
      .then(res => res.json()).then(setUsers);
  };
  const fetchFlights = () => {
    fetch(`${API}/admin/flights`, { headers: authHeader() })
      .then(res => res.json()).then(setFlights);
  };
  const fetchBookings = () => {
    fetch(`${API}/admin/bookings`, { headers: authHeader() })
      .then(res => res.json()).then(setBookings);
  };
  const fetchTickets = () => {
    fetch(`${API}/admin/tickets`, { headers: authHeader() })
      .then(res => res.json()).then(setTickets);
  };
  const authHeader = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });

  if (!isAdmin) return <div className="bookings-page"><h2>Admin Panel</h2><p>Access denied. Log in as admin.</p></div>;

  return (
    <div className="bookings-page">
      <h2>Admin Panel</h2>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab('users')}>Users</button>
        <button onClick={() => setTab('flights')}>Flights</button>
        <button onClick={() => setTab('bookings')}>Bookings</button>
        <button onClick={() => setTab('tickets')}>Tickets</button>
      </div>
      {tab === 'users' && (
        <div>
          <h3>Users</h3>
          <table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></tr></thead><tbody>
            {users.map(u => <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td></tr>)}
          </tbody></table>
        </div>
      )}
      {tab === 'flights' && (
        <div>
          <h3>Flights</h3>
          <table><thead><tr><th>ID</th><th>Flight #</th><th>Origin</th><th>Destination</th><th>Date</th><th>Time</th><th>Class</th><th>Seats</th></tr></thead><tbody>
            {flights.map(f => <tr key={f.id}><td>{f.id}</td><td>{f.flight_number}</td><td>{f.origin_airport_id}</td><td>{f.destination_airport_id}</td><td>{f.departure_date}</td><td>{f.departure_time}</td><td>{f.class}</td><td>{f.seats}</td></tr>)}
          </tbody></table>
        </div>
      )}
      {tab === 'bookings' && (
        <div>
          <h3>Bookings</h3>
          <table><thead><tr><th>ID</th><th>User</th><th>Email</th><th>Flight #</th><th>Status</th></tr></thead><tbody>
            {bookings.map(b => <tr key={b.id}><td>{b.id}</td><td>{b.user_name}</td><td>{b.user_email}</td><td>{b.flight_number}</td><td>{b.status}</td></tr>)}
          </tbody></table>
        </div>
      )}
      {tab === 'tickets' && (
        <div>
          <h3>Tickets</h3>
          <table><thead><tr><th>ID</th><th>Ticket #</th><th>User</th><th>Flight #</th><th>Issued At</th></tr></thead><tbody>
            {tickets.map(t => <tr key={t.id}><td>{t.id}</td><td>{t.ticket_number}</td><td>{t.user_name}</td><td>{t.flight_number}</td><td>{t.issued_at}</td></tr>)}
          </tbody></table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel; 