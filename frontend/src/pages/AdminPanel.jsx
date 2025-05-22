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
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [usersError, setUsersError] = useState('');
  const [flightsError, setFlightsError] = useState('');
  const [bookingsError, setBookingsError] = useState('');
  const [ticketsError, setTicketsError] = useState('');

  // --- Fix: Do not use hooks after conditional return ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAdmin(false);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.isAdmin === true) {
        setIsAdmin(true);
        fetchAll();
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    }
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
    setLoadingUsers(true);
    fetch(`${API}/admin/users`, { headers: authHeader() })
      .then(res => res.json())
      .then(setUsers)
      .finally(() => setLoadingUsers(false));
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

  // --- Admin: Add/Edit/Delete User ---
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [editUserId, setEditUserId] = useState(null);

  const handleUserFormChange = e => setUserForm({ ...userForm, [e.target.name]: e.target.value });
  const handleUserSubmit = e => {
    e.preventDefault();
    setUserMessage('');
    setUsersError('');
    if (editUserId) {
      fetch(`${API}/admin/users/${editUserId}`, {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) setUsersError(data.error);
          else setUserMessage('User updated!');
          fetchUsers();
        })
        .catch(() => setUsersError('Failed to update user.'));
    } else {
      fetch(`${API}/admin/users`, {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) setUsersError(data.error);
          else setUserMessage('User added!');
          fetchUsers();
        })
        .catch(() => setUsersError('Failed to add user.'));
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
      setUserMessage('');
      setUsersError('');
      fetch(`${API}/admin/users/${id}`, { method: 'DELETE', headers: authHeader() })
        .then(res => res.json())
        .then(data => {
          if (data.error) setUsersError(data.error);
          else setUserMessage('User deleted!');
          fetchUsers();
        })
        .catch(() => setUsersError('Failed to delete user.'));
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
    setFlightsError('');
    if (editFlightId) {
      fetch(`${API}/admin/flights/${editFlightId}`, {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(flightForm)
      })
        .then(fetchFlights)
        .catch(() => setFlightsError('Failed to update flight.'));
    } else {
      fetch(`${API}/admin/flights`, {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(flightForm)
      })
        .then(fetchFlights)
        .catch(() => setFlightsError('Failed to add flight.'));
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
      setFlightsError('');
      fetch(`${API}/admin/flights/${id}`, { method: 'DELETE', headers: authHeader() })
        .then(fetchFlights)
        .catch(() => setFlightsError('Failed to delete flight.'));
    }
  };

  // --- Responsive Table Helper ---
  const ResponsiveTable = ({ children, ariaLabel }) => (
    <div style={{ overflowX: 'auto', width: '100%' }} aria-label={ariaLabel} tabIndex={0}>
      <table className="responsive-table">{children}</table>
    </div>
  );

  // Defensive: If not admin or token invalid, show fallback (prevents blank page)
  let token = localStorage.getItem('token');
  let tokenError = false;
  try {
    if (!token) tokenError = true;
    else {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload || typeof payload !== 'object') tokenError = true;
    }
  } catch {
    tokenError = true;
  }
  if (tokenError) {
    return <div className="bookings-page"><h2>Admin Panel</h2><p>Your login session is invalid or expired. <a href="/auth" className="primary-btn">Log in again</a></p></div>;
  }
  if (!isAdmin) {
    return <div className="bookings-page"><h2>Admin Panel</h2><p>Access denied. Log in as admin.</p></div>;
  }

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
          {userMessage && <div style={{marginBottom:8, color:'#1a237e', fontWeight:500}}>{userMessage}</div>}
          {usersError && <div style={{marginBottom:8, color:'#b71c1c', fontWeight:500}}>{usersError}</div>}
          <form onSubmit={handleUserSubmit} style={{ marginBottom: 20 }} aria-label="Add or edit user form">
            <input name="name" placeholder="Name" value={userForm.name} onChange={handleUserFormChange} required aria-label="Name" />
            <input name="email" placeholder="Email" value={userForm.email} onChange={handleUserFormChange} required aria-label="Email" />
            <input name="phone" placeholder="Phone" value={userForm.phone} onChange={handleUserFormChange} aria-label="Phone" />
            <input name="password" type="password" placeholder="Password" value={userForm.password} onChange={handleUserFormChange} required={!editUserId} aria-label="Password" />
            <button type="submit" className="primary-btn" disabled={loadingUsers}>{editUserId ? 'Update' : 'Add'} User</button>
            {editUserId && <button type="button" onClick={()=>{setEditUserId(null);setUserForm({ name: '', email: '', phone: '', password: '' });}}>Cancel</button>}
          </form>
          {loadingUsers ? (
            <div style={{textAlign:'center',margin:'24px 0'}}>Loading users...</div>
          ) : (
            <ResponsiveTable ariaLabel="Users table">
              <thead><tr><th>ID</th><th>Avatar</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead><tbody>
                {users.map(u => (
                  <tr key={u.id} tabIndex={0} aria-label={`User ${u.name}`}>
                    <td>{u.id}</td>
                    <td>
                      <img
                        src={u.avatar_url ? `http://localhost:5000${u.avatar_url}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name||'User')}&background=f1c40f&color=002147&size=48`}
                        alt={u.name ? `${u.name}'s avatar` : 'User avatar'}
                        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 1px 4px #f1c40f22' }}
                        loading="lazy"
                      />
                    </td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>
                      <button onClick={()=>handleUserEdit(u)} aria-label={`Edit user ${u.name}`}>Edit</button>
                      <button onClick={()=>handleUserDelete(u.id)} aria-label={`Delete user ${u.name}`}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody></ResponsiveTable>
          )}
        </div>
      )}
      {tab === 'flights' && (
        <div>
          <h3>Flights</h3>
          {flightsError && <div style={{marginBottom:8, color:'#b71c1c', fontWeight:500}}>{flightsError}</div>}
          <form onSubmit={handleFlightSubmit} style={{ marginBottom: 20 }} aria-label="Add or edit flight form">
            <input name="flight_number" placeholder="Flight #" value={flightForm.flight_number} onChange={handleFlightFormChange} required aria-label="Flight number" />
            <input name="origin_airport_id" placeholder="Origin Airport ID" value={flightForm.origin_airport_id} onChange={handleFlightFormChange} required aria-label="Origin airport ID" />
            <input name="destination_airport_id" placeholder="Destination Airport ID" value={flightForm.destination_airport_id} onChange={handleFlightFormChange} required aria-label="Destination airport ID" />
            <input name="departure_date" type="date" placeholder="Departure Date" value={flightForm.departure_date} onChange={handleFlightFormChange} required aria-label="Departure date" />
            <input name="departure_time" type="time" placeholder="Departure Time" value={flightForm.departure_time} onChange={handleFlightFormChange} required aria-label="Departure time" />
            <input name="arrival_date" type="date" placeholder="Arrival Date" value={flightForm.arrival_date} onChange={handleFlightFormChange} required aria-label="Arrival date" />
            <input name="arrival_time" type="time" placeholder="Arrival Time" value={flightForm.arrival_time} onChange={handleFlightFormChange} required aria-label="Arrival time" />
            <input name="price" type="number" placeholder="Price" value={flightForm.price} onChange={handleFlightFormChange} required aria-label="Price" />
            <input name="seats" type="number" placeholder="Seats" value={flightForm.seats} onChange={handleFlightFormChange} required aria-label="Seats" />
            <input name="class" placeholder="Class" value={flightForm.class} onChange={handleFlightFormChange} required aria-label="Class" />
            <button type="submit" className="primary-btn">{editFlightId ? 'Update' : 'Add'} Flight</button>
            {editFlightId && <button type="button" onClick={()=>{setEditFlightId(null);setFlightForm({ flight_number: '', origin_airport_id: '', destination_airport_id: '', departure_date: '', departure_time: '', arrival_date: '', arrival_time: '', price: '', seats: '', class: '' });}}>Cancel</button>}
          </form>
          <ResponsiveTable ariaLabel="Flights table">
            <thead><tr><th>ID</th><th>Flight #</th><th>Origin</th><th>Destination</th><th>Date</th><th>Time</th><th>Class</th><th>Seats</th><th>Actions</th></tr></thead><tbody>
              {flights.map(f => <tr key={f.id} tabIndex={0} aria-label={`Flight ${f.flight_number}`}><td>{f.id}</td><td>{f.flight_number}</td><td>{f.origin_airport_id}</td><td>{f.destination_airport_id}</td><td>{f.departure_date}</td><td>{f.departure_time}</td><td>{f.class}</td><td>{f.seats}</td><td><button onClick={()=>handleFlightEdit(f)} aria-label={`Edit flight ${f.flight_number}`}>Edit</button> <button onClick={()=>handleFlightDelete(f.id)} aria-label={`Delete flight ${f.flight_number}`}>Delete</button></td></tr>)}
            </tbody></ResponsiveTable>
        </div>
      )}
      {tab === 'bookings' && (
        <div>
          <h3>Bookings</h3>
          {bookingsError && <div style={{marginBottom:8, color:'#b71c1c', fontWeight:500}}>{bookingsError}</div>}
          <ResponsiveTable ariaLabel="Bookings table">
            <thead><tr><th>ID</th><th>User</th><th>Email</th><th>Flight #</th><th>Status</th></tr></thead><tbody>
              {bookings.map(b => <tr key={b.id} tabIndex={0} aria-label={`Booking ${b.id}`}><td>{b.id}</td><td>{b.user_name}</td><td>{b.user_email}</td><td>{b.flight_number}</td><td>{b.status}</td></tr>)}
            </tbody></ResponsiveTable>
        </div>
      )}
      {tab === 'tickets' && (
        <div>
          <h3>Tickets</h3>
          {ticketsError && <div style={{marginBottom:8, color:'#b71c1c', fontWeight:500}}>{ticketsError}</div>}
          <ResponsiveTable ariaLabel="Tickets table">
            <thead><tr><th>ID</th><th>Ticket #</th><th>User</th><th>Flight #</th><th>Issued At</th></tr></thead><tbody>
              {tickets.map(t => <tr key={t.id} tabIndex={0} aria-label={`Ticket ${t.ticket_number}`}><td>{t.id}</td><td>{t.ticket_number}</td><td>{t.user_name}</td><td>{t.flight_number}</td><td>{t.issued_at}</td></tr>)}
            </tbody></ResponsiveTable>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;