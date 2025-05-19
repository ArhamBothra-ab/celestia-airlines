const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /bookings - Create a new booking
router.post('/', (req, res) => {
  const { user_id, flight_id } = req.body;

  if (!user_id || !flight_id) {
    return res.status(400).json({ error: 'Missing user_id or flight_id' });
  }

  const sql = 'INSERT INTO Bookings (user_id, flight_id) VALUES (?, ?)';
  db.query(sql, [user_id, flight_id], (err, result) => {
    if (err) {
      console.error('Error creating booking:', err);
      return res.status(500).json({ error: 'Failed to create booking' });
    }
    res.status(201).json({ message: 'Booking successful!', bookingId: result.insertId });
  });
});

// GET /bookings - Get all bookings
router.get('/', (req, res) => {
  const sql = `
    SELECT Bookings.id, Users.name AS user, Flights.origin, Flights.destination, Flights.date, Flights.time
    FROM Bookings
    JOIN Users ON Bookings.user_id = Users.id
    JOIN Flights ON Bookings.flight_id = Flights.id
    ORDER BY Bookings.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).json({ error: 'Failed to get bookings' });
    }
    res.json(results);
  });
});

// DELETE /bookings/:id - Cancel a booking
router.delete('/:id', (req, res) => {
  const bookingId = req.params.id;

  const sql = 'DELETE FROM Bookings WHERE id = ?';
  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error('Error deleting booking:', err);
      return res.status(500).json({ error: 'Failed to delete booking' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking cancelled successfully!' });
  });
});

// PUT /bookings/:id - Update booking (ONLY for Business Class)
router.put('/:id', (req, res) => {
  const bookingId = req.params.id;
  const { date, time } = req.body;

  // First, check if the booking is Business Class
  const checkSql = 'SELECT class FROM Bookings WHERE id = ?';
  db.query(checkSql, [bookingId], (err, results) => {
    if (err) {
      console.error('Error checking booking class:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingClass = results[0].class;
    if (bookingClass !== 'Business') {
      return res.status(403).json({ error: 'Only Business Class bookings can be updated' });
    }

    // Proceed to update date and time
    const updateSql = 'UPDATE Bookings SET date = ?, time = ? WHERE id = ?';
    db.query(updateSql, [date, time, bookingId], (err, updateResult) => {
      if (err) {
        console.error('Error updating booking:', err);
        return res.status(500).json({ error: 'Failed to update booking' });
      }
      res.json({ message: 'Booking updated successfully!' });
    });
  });
});


module.exports = router;
