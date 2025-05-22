const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Simple admin check middleware (for demo: email contains 'admin')
function isAdmin(req, res, next) {
  if (req.user && req.user.email && req.user.email.includes('admin')) {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
}

// GET /admin/users - View all users
router.get('/users', auth, isAdmin, (req, res) => {
  db.query('SELECT id, name, email, phone, avatar_url, created_at FROM Users', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch users' });
    res.json(results);
  });
});

// GET /admin/flights - View all flights
router.get('/flights', auth, isAdmin, (req, res) => {
  db.query('SELECT * FROM Flights', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch flights' });
    res.json(results);
  });
});

// GET /admin/bookings - View all bookings
router.get('/bookings', auth, isAdmin, (req, res) => {
  const sql = `
    SELECT b.*, u.name AS user_name, u.email AS user_email, f.flight_number
    FROM Bookings b
    JOIN Users u ON b.user_id = u.id
    JOIN Flights f ON b.flight_id = f.id
    ORDER BY b.booking_date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch bookings' });
    res.json(results);
  });
});

// GET /admin/tickets - View all tickets
router.get('/tickets', auth, isAdmin, (req, res) => {
  const sql = `
    SELECT t.*, b.user_id, u.name AS user_name, f.flight_number
    FROM Tickets t
    JOIN Bookings b ON t.booking_id = b.id
    JOIN Users u ON b.user_id = u.id
    JOIN Flights f ON b.flight_id = f.id
    ORDER BY t.issued_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch tickets' });
    res.json(results);
  });
});

// POST /admin/flights - Add a new flight
router.post('/flights', auth, isAdmin, (req, res) => {
  const { flight_number, origin_airport_id, destination_airport_id, departure_date, departure_time, arrival_date, arrival_time, price, seats, class: flight_class } = req.body;
  const sql = 'INSERT INTO Flights (flight_number, origin_airport_id, destination_airport_id, departure_date, departure_time, arrival_date, arrival_time, price, seats, class) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [flight_number, origin_airport_id, destination_airport_id, departure_date, departure_time, arrival_date, arrival_time, price, seats, flight_class], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to add flight' });
    res.json({ message: 'Flight added', id: result.insertId });
  });
});

// PUT /admin/flights/:id - Update a flight
router.put('/flights/:id', auth, isAdmin, (req, res) => {
  const { flight_number, origin_airport_id, destination_airport_id, departure_date, departure_time, arrival_date, arrival_time, price, seats, class: flight_class } = req.body;
  const sql = 'UPDATE Flights SET flight_number=?, origin_airport_id=?, destination_airport_id=?, departure_date=?, departure_time=?, arrival_date=?, arrival_time=?, price=?, seats=?, class=? WHERE id=?';
  db.query(sql, [flight_number, origin_airport_id, destination_airport_id, departure_date, departure_time, arrival_date, arrival_time, price, seats, flight_class, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update flight' });
    res.json({ message: 'Flight updated' });
  });
});

// DELETE /admin/flights/:id - Delete a flight
router.delete('/flights/:id', auth, isAdmin, (req, res) => {
  db.query('DELETE FROM Flights WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete flight' });
    res.json({ message: 'Flight deleted' });
  });
});

// POST /admin/users - Add a new user
router.post('/users', auth, isAdmin, (req, res) => {
  const { name, email, password, phone } = req.body;
  const sql = 'INSERT INTO Users (name, email, password, phone) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, phone], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to add user' });
    res.json({ message: 'User added', id: result.insertId });
  });
});

// PUT /admin/users/:id - Update a user
router.put('/users/:id', auth, isAdmin, (req, res) => {
  const { name, email, phone } = req.body;
  const sql = 'UPDATE Users SET name=?, email=?, phone=? WHERE id=?';
  db.query(sql, [name, email, phone, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update user' });
    res.json({ message: 'User updated' });
  });
});

// DELETE /admin/users/:id - Delete a user
router.delete('/users/:id', auth, isAdmin, (req, res) => {
  db.query('DELETE FROM Users WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete user' });
    res.json({ message: 'User deleted' });
  });
});

module.exports = router;