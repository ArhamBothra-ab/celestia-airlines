const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /users - Register a new user
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing name, email or password' });
  }

  const sql = 'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ error: 'Failed to register user' });
    }
    res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
  });
});

module.exports = router;
