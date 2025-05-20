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
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.isAdmin === true) {
        setIsAdmin(true);
        fetchAll();
      }
    } catch {}
  }, []);

  // Automatically redirect admin users to admin panel
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.email && payload.email.includes('admin')) {
      window.history.replaceState(null, '', '/admin');
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

  // --- Admin: Add/Edit/Delete User ---
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [editUserId, setEditUserId] = useState(null);
  const handleUserFormChange = e => setUserForm({ ...userForm, [e.target.name]: e.target.value });
  const handleUserSubmit = e => {
    e.preventDefault();
    if (editUserId) {
      fetch(`${API}/admin/users/${editUserId}`, {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      }).then(fetchUsers);
    } else {
      fetch(`${API}/admin/users`, {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      }).then(fetchUsers);
    }
    setUserForm({ name: '', email: '', phone: '', password: '' });
    setEditUserId(null);
  };
  const handleUserEdit = user => {
    setEditUserId(user.id);
    setUserForm({ name: user.name, email: user.email, phone: user.phone || '', password: '' });
  };
  const handleUserDelete = id => {
    if (window.confirm('Delete this user?')) {
      fetch(`${API}/admin/users/${id}`, { method: 'DELETE', headers: authHeader() }).then(fetchUsers);
    }
  };

  // --- Admin: Add/Edit/Delete Flight ---
  const [flightForm, setFlightForm] = useState({
    flight_number: '', origin_airport_id: '', destination_airport_id: '', departure_date: '', departure_time: '', arrival_date: '', arrival_time: '', price: '', seats: '', class: ''
  });
  const [editFlightId, setEditFlightId] = useState(null);
  const handleFlightFormChange = e => setFlightForm({ ...flightForm, [e.target.name]: e.target.value });
  const handleFlightSubmit = e => {
    e.preventDefault();
    if (editFlightId) {
      fetch(`${API}/admin/flights/${editFlightId}`, {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(flightForm)
      }).then(fetchFlights);
    } else {
      fetch(`${API}/admin/flights`, {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(flightForm)
      }).then(fetchFlights);
    }
    setFlightForm({ flight_number: '', origin_airport_id: '', destination_airport_id: '', departure_date: '', departure_time: '', arrival_date: '', arrival_time: '', price: '', seats: '', class: '' });
    setEditFlightId(null);
  };
  const handleFlightEdit = flight => {
    setEditFlightId(flight.id);
    setFlightForm({
      flight_number: flight.flight_number,
      origin_airport_id: flight.origin_airport_id,
      destination_airport_id: flight.destination_airport_id,
      departure_date: flight.departure_date,
      departure_time: flight.departure_time,
      arrival_date: flight.arrival_date,
      arrival_time: flight.arrival_time,
      price: flight.price,
      seats: flight.seats,
      class: flight.class
    });
  };
  const handleFlightDelete = id => {
    if (window.confirm('Delete this flight?')) {
      fetch(`${API}/admin/flights/${id}`, { method: 'DELETE', headers: authHeader() }).then(fetchFlights);
    }
  };

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
          <form onSubmit={handleUserSubmit} style={{ marginBottom: 20 }}>
            <input name="name" placeholder="Name" value={userForm.name} onChange={handleUserFormChange} required />
            <input name="email" placeholder="Email" value={userForm.email} onChange={handleUserFormChange} required />
            <input name="phone" placeholder="Phone" value={userForm.phone} onChange={handleUserFormChange} />
            <input name="password" type="password" placeholder="Password" value={userForm.password} onChange={handleUserFormChange} required={!editUserId} />
            <button type="submit" className="primary-btn">{editUserId ? 'Update' : 'Add'} User</button>
            {editUserId && <button type="button" onClick={()=>{setEditUserId(null);setUserForm({ name: '', email: '', phone: '', password: '' });}}>Cancel</button>}
          </form>
          <table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead><tbody>
            {users.map(u => <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td><td><button onClick={()=>handleUserEdit(u)}>Edit</button> <button onClick={()=>handleUserDelete(u.id)}>Delete</button></td></tr>)}
          </tbody></table>
        </div>
      )}
      {tab === 'flights' && (
        <div>
          <h3>Flights</h3>
          <form onSubmit={handleFlightSubmit} style={{ marginBottom: 20 }}>
            <input name="flight_number" placeholder="Flight #" value={flightForm.flight_number} onChange={handleFlightFormChange} required />
            <input name="origin_airport_id" placeholder="Origin Airport ID" value={flightForm.origin_airport_id} onChange={handleFlightFormChange} required />
            <input name="destination_airport_id" placeholder="Destination Airport ID" value={flightForm.destination_airport_id} onChange={handleFlightFormChange} required />
            <input name="departure_date" type="date" placeholder="Departure Date" value={flightForm.departure_date} onChange={handleFlightFormChange} required />
            <input name="departure_time" type="time" placeholder="Departure Time" value={flightForm.departure_time} onChange={handleFlightFormChange} required />
            <input name="arrival_date" type="date" placeholder="Arrival Date" value={flightForm.arrival_date} onChange={handleFlightFormChange} required />
            <input name="arrival_time" type="time" placeholder="Arrival Time" value={flightForm.arrival_time} onChange={handleFlightFormChange} required />
            <input name="price" type="number" placeholder="Price" value={flightForm.price} onChange={handleFlightFormChange} required />
            <input name="seats" type="number" placeholder="Seats" value={flightForm.seats} onChange={handleFlightFormChange} required />
            <input name="class" placeholder="Class" value={flightForm.class} onChange={handleFlightFormChange} required />
            <button type="submit" className="primary-btn">{editFlightId ? 'Update' : 'Add'} Flight</button>
            {editFlightId && <button type="button" onClick={()=>{setEditFlightId(null);setFlightForm({ flight_number: '', origin_airport_id: '', destination_airport_id: '', departure_date: '', departure_time: '', arrival_date: '', arrival_time: '', price: '', seats: '', class: '' });}}>Cancel</button>}
          </form>
          <table><thead><tr><th>ID</th><th>Flight #</th><th>Origin</th><th>Destination</th><th>Date</th><th>Time</th><th>Class</th><th>Seats</th><th>Actions</th></tr></thead><tbody>
            {flights.map(f => <tr key={f.id}><td>{f.id}</td><td>{f.flight_number}</td><td>{f.origin_airport_id}</td><td>{f.destination_airport_id}</td><td>{f.departure_date}</td><td>{f.departure_time}</td><td>{f.class}</td><td>{f.seats}</td><td><button onClick={()=>handleFlightEdit(f)}>Edit</button> <button onClick={()=>handleFlightDelete(f.id)}>Delete</button></td></tr>)}
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