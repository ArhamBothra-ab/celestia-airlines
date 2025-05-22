const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /flights - Get all flights with optional search parameters (by airport name or code)
router.get('/', (req, res) => {
  const { origin, destination, departure_date } = req.query;
  let sql = `
    SELECT f.*, 
           a1.name AS origin_airport_name, a1.code AS origin_airport_code, a1.city AS origin_city, a1.country AS origin_country,
           a2.name AS destination_airport_name, a2.code AS destination_airport_code, a2.city AS destination_city, a2.country AS destination_country
    FROM Flights f
    JOIN Airports a1 ON f.origin_airport_id = a1.id
    JOIN Airports a2 ON f.destination_airport_id = a2.id
    WHERE 1=1
  `;
  const params = [];

  if (origin) {
    sql += ' AND (a1.name LIKE ? OR a1.code LIKE ? OR a1.city LIKE ?)';
    params.push(`%${origin}%`, `%${origin}%`, `%${origin}%`);
  }

  if (destination) {
    sql += ' AND (a2.name LIKE ? OR a2.code LIKE ? OR a2.city LIKE ?)';
    params.push(`%${destination}%`, `%${destination}%`, `%${destination}%`);
  }

  if (departure_date) {
    sql += ' AND f.departure_date = ?';
    params.push(departure_date);
  }

  sql += ' ORDER BY f.departure_date, f.departure_time';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error fetching flights:', err);
      return res.status(500).json({ error: 'Failed to fetch flights' });
    }
    if (results.length > 0) return res.json(results);

    // If no flights found, generate dummy flights dynamically
    if (origin && destination && departure_date) {
      // Optionally, fetch airport codes/cities from Airports table for realism
      const dummyFlights = [];
      for (let i = 0; i < 3; i++) {
        dummyFlights.push({
          id: 10000 + i,
          flight_number: `DYN${Math.floor(Math.random() * 900 + 100)}`,
          origin_airport_name: origin,
          origin_airport_code: origin.slice(0,3).toUpperCase(),
          origin_city: origin,
          origin_country: '',
          destination_airport_name: destination,
          destination_airport_code: destination.slice(0,3).toUpperCase(),
          destination_city: destination,
          destination_country: '',
          departure_date,
          departure_time: `${8 + i * 3}:00:00`,
          arrival_date: departure_date,
          arrival_time: `${12 + i * 3}:00:00`,
          price: (500 + Math.random() * 500).toFixed(2),
          seats: 100,
          class: ['Economy', 'Business', 'First'][i % 3],
        });
      }
      return res.json(dummyFlights);
    }
    res.json([]);
  });
});

// GET /airports - Get all airports for dropdowns
router.get('/airports', (req, res) => {
  db.query(
    `SELECT * FROM Airports 
     WHERE city IS NOT NULL AND city != '' AND code IS NOT NULL AND code != ''
     AND city REGEXP '[a-zA-Z]' AND code REGEXP '[a-zA-Z]'`,
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch airports' });
      res.json(results);
    }
  );
});

// GET /flights/:id - Get a specific flight with airport info
router.get('/:id', (req, res) => {
  const sql = `
    SELECT f.*, 
           a1.name AS origin_airport_name, a1.code AS origin_airport_code, a1.city AS origin_city, a1.country AS origin_country,
           a2.name AS destination_airport_name, a2.code AS destination_airport_code, a2.city AS destination_city, a2.country AS destination_country
    FROM Flights f
    JOIN Airports a1 ON f.origin_airport_id = a1.id
    JOIN Airports a2 ON f.destination_airport_id = a2.id
    WHERE f.id = ?
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching flight:', err);
      return res.status(500).json({ error: 'Failed to fetch flight' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(results[0]);
  });
});

module.exports = router;
