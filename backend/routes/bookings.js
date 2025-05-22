const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /bookings - Get all bookings for the authenticated user
router.get('/', auth, (req, res) => {
  const sql = `
    SELECT b.*, 
           f.flight_number, f.departure_date, f.departure_time, f.arrival_date, f.arrival_time, f.price, f.class, f.seats,
           a1.name AS origin_airport_name, a1.code AS origin_airport_code, a1.city AS origin_city, a1.country AS origin_country,
           a2.name AS destination_airport_name, a2.code AS destination_airport_code, a2.city AS destination_city, a2.country AS destination_country
    FROM Bookings b
    JOIN Flights f ON b.flight_id = f.id
    JOIN Airports a1 ON f.origin_airport_id = a1.id
    JOIN Airports a2 ON f.destination_airport_id = a2.id
    WHERE b.user_id = ?
    ORDER BY b.booking_date DESC
  `;
  db.query(sql, [req.user.userId], (err, results) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
    res.json(results);
  });
});

// PATCH /bookings/:id/pay - Mark a booking as paid and generate ticket
router.patch('/:id/pay', auth, (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.userId;
  const sql = 'UPDATE Bookings SET payment_status = ? WHERE id = ? AND user_id = ?';
  db.query(sql, ['Paid', bookingId, userId], (err, result) => {
    if (err) {
      console.error('Error updating payment status:', err);
      return res.status(500).json({ error: 'Failed to update payment status' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }
    // Generate ticket if not already exists
    const checkTicketSql = 'SELECT * FROM Tickets WHERE booking_id = ?';
    db.query(checkTicketSql, [bookingId], (err, ticketResults) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to check ticket' });
      }
      if (ticketResults.length === 0) {
        // Generate unique ticket number
        const ticketNumber = 'TCKT-' + bookingId + '-' + Date.now();
        db.query('INSERT INTO Tickets (booking_id, ticket_number) VALUES (?, ?)', [bookingId, ticketNumber], (err2) => {
          if (err2) {
            return res.status(500).json({ error: 'Failed to generate ticket' });
          }
          res.json({ message: 'Payment marked as paid and ticket generated.' });
        });
      } else {
        res.json({ message: 'Payment marked as paid.' });
      }
    });
  });
});

// GET /tickets - Get all tickets for the authenticated user
router.get('/tickets', auth, (req, res) => {
  const sql = `
    SELECT t.*, b.user_id, f.flight_number, f.departure_date, f.departure_time, f.arrival_date, f.arrival_time,
           a1.name AS origin_airport_name, a1.code AS origin_airport_code, a2.name AS destination_airport_name, a2.code AS destination_airport_code
    FROM Tickets t
    JOIN Bookings b ON t.booking_id = b.id
    JOIN Flights f ON b.flight_id = f.id
    JOIN Airports a1 ON f.origin_airport_id = a1.id
    JOIN Airports a2 ON f.destination_airport_id = a2.id
    WHERE b.user_id = ?
    ORDER BY t.issued_at DESC
  `;
  db.query(sql, [req.user.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }
    res.json(results);
  });
});

// POST /bookings - Create a new booking with seat check
router.post('/', auth, (req, res) => {
  const { flight_id, flight } = req.body;
  const user_id = req.user.userId;

  if (!flight_id && !flight) {
    return res.status(400).json({ error: 'Flight ID or flight details required' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting DB connection:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: 'Database error' });
      }
      // If flight_id is provided, try to find the flight
      const findFlight = (cb) => {
        if (flight_id) {
          connection.query('SELECT * FROM Flights WHERE id = ? FOR UPDATE', [flight_id], (err, results) => {
            if (err) return cb(err);
            if (results.length > 0) return cb(null, results[0]);
            // If not found and flight details provided, insert it
            if (flight) {
              insertFlight(cb);
            } else {
              cb(new Error('Flight not found'));
            }
          });
        } else if (flight) {
          insertFlight(cb);
        } else {
          cb(new Error('No flight info'));
        }
      };
      // Insert the flight into Flights table, ensuring airports exist
      function insertFlight(cb) {
        const f = flight;
        // Helper to get or insert airport by code/city
        function getOrInsertAirport(code, city, cb2) {
          connection.query('SELECT id FROM Airports WHERE code = ? OR city = ? LIMIT 1', [code, city], (err, results) => {
            if (err) return cb2(err);
            if (results.length > 0) return cb2(null, results[0].id);
            // Insert minimal airport
            connection.query('INSERT INTO Airports (name, code, city, country) VALUES (?, ?, ?, ?)', [city, code, city, ''], (err, result) => {
              if (err) return cb2(err);
              cb2(null, result.insertId);
            });
          });
        }
        getOrInsertAirport(f.origin_airport_code, f.origin_city, (err, originId) => {
          if (err) return cb(err);
          getOrInsertAirport(f.destination_airport_code, f.destination_city, (err, destId) => {
            if (err) return cb(err);
            const sql = `INSERT INTO Flights (flight_number, origin_airport_id, destination_airport_id, departure_date, departure_time, arrival_date, arrival_time, price, seats, class) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            connection.query(sql, [
              f.flight_number,
              originId,
              destId,
              f.departure_date,
              f.departure_time,
              f.arrival_date,
              f.arrival_time,
              f.price || 100,
              f.seats || 20,
              f.class || 'Economy'
            ], (err, result) => {
              if (err) return cb(err);
              connection.query('SELECT * FROM Flights WHERE id = ? FOR UPDATE', [result.insertId], (err, results) => {
                if (err) return cb(err);
                cb(null, results[0]);
              });
            });
          });
        });
      }
      // Main booking logic
      findFlight((err, flightRow) => {
        if (err || !flightRow) {
          connection.rollback(() => {
            connection.release();
            return res.status(404).json({ error: 'Flight not found and could not be created.' });
          });
          return;
        }
        if (flightRow.seats <= 0) {
          connection.rollback(() => {
            connection.release();
            return res.status(400).json({ error: 'No seats available for this flight' });
          });
          return;
        }
        connection.query('SELECT * FROM Bookings WHERE user_id = ? AND flight_id = ?', [user_id, flightRow.id], (err, results) => {
          if (err) {
            connection.rollback(() => {
              connection.release();
              return res.status(500).json({ error: 'Database error' });
            });
            return;
          }
          if (results.length > 0) {
            connection.rollback(() => {
              connection.release();
              return res.status(400).json({ error: 'You already have a booking for this flight' });
            });
            return;
          }
          connection.query('UPDATE Flights SET seats = seats - 1 WHERE id = ?', [flightRow.id], (err, updateResult) => {
            if (err) {
              connection.rollback(() => {
                connection.release();
                return res.status(500).json({ error: 'Failed to update seat count' });
              });
              return;
            }
            connection.query('INSERT INTO Bookings (user_id, flight_id, payment_status) VALUES (?, ?, ?)', [user_id, flightRow.id, 'Pending'], (err, result) => {
              if (err) {
                connection.rollback(() => {
                  connection.release();
                  return res.status(500).json({ error: 'Failed to create booking', details: err.message });
                });
                return;
              }
              connection.commit(err => {
                if (err) {
                  connection.rollback(() => {
                    connection.release();
                    return res.status(500).json({ error: 'Failed to commit booking' });
                  });
                  return;
                }
                const getBookingSql = `
                  SELECT b.*, 
                         f.flight_number, f.departure_date, f.departure_time, f.arrival_date, f.arrival_time, f.price, f.class, f.seats,
                         a1.name AS origin_airport_name, a1.code AS origin_airport_code, a1.city AS origin_city, a1.country AS origin_country,
                         a2.name AS destination_airport_name, a2.code AS destination_airport_code, a2.city AS destination_city, a2.country AS destination_country
                  FROM Bookings b
                  JOIN Flights f ON b.flight_id = f.id
                  JOIN Airports a1 ON f.origin_airport_id = a1.id
                  JOIN Airports a2 ON f.destination_airport_id = a2.id
                  WHERE b.id = ?
                `;
                connection.query(getBookingSql, [result.insertId], (err, bookingResults) => {
                  connection.release();
                  if (err) {
                    return res.status(500).json({ error: 'Failed to fetch booking details' });
                  }
                  res.status(201).json(bookingResults[0]);
                });
              });
            });
          });
        });
      });
    });
  });
});

// DELETE /bookings/:id - Cancel a booking
router.delete('/:id', auth, (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.userId;

  // First check if the booking exists and belongs to the user
  const checkSql = 'SELECT * FROM Bookings WHERE id = ? AND user_id = ?';
  db.query(checkSql, [bookingId, userId], (err, results) => {
    if (err) {
      console.error('Error checking booking:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }

    // Delete the booking
    const sql = 'DELETE FROM Bookings WHERE id = ?';
    db.query(sql, [bookingId], (err) => {
      if (err) {
        console.error('Error deleting booking:', err);
        return res.status(500).json({ error: 'Failed to delete booking' });
      }
      res.json({ message: 'Booking cancelled successfully' });
    });
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
