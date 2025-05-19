const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /flights - Get all flights
router.get('/', (req, res) => {
  db.query('SELECT * FROM Flights', (err, results) => {
    if (err) {
      console.error('Error fetching flights:', err);
      return res.status(500).json({ error: 'Failed to fetch flights' });
    }
    res.json(results);
  });
});

module.exports = router;
