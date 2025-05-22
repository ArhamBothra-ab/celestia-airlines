const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /users/register - Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing name, email or password' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const checkSql = 'SELECT * FROM Users WHERE email = ?';
    db.query(checkSql, [email], async (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Insert new user
      const sql = 'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)';
      db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          return res.status(500).json({ error: 'Failed to register user' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: result.insertId, email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        res.status(201).json({
          message: 'User registered successfully!',
          token,
          user: { id: result.insertId, name, email }
        });
      });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /users/login - Login user (supports both Users and Admin tables)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  // Try Users table first
  const userSql = 'SELECT * FROM Users WHERE email = ?';
  db.query(userSql, [email], async (err, results) => {
    if (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const user = results[0];
      try {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Generate JWT token (set isAdmin if user.isAdmin)
        const token = jwt.sign(
          { userId: user.id, email: user.email, isAdmin: !!user.isAdmin },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );
        return res.json({
          message: 'Login successful!',
          token,
          user: { id: user.id, name: user.name, email: user.email, isAdmin: !!user.isAdmin }
        });
      } catch (error) {
        console.error('Error comparing passwords:', error);
        return res.status(500).json({ error: 'Server error' });
      }
    } else {
      // Try Admin table
      const adminSql = 'SELECT * FROM Admin WHERE email = ?';
      db.query(adminSql, [email], async (err, adminResults) => {
        if (err) {
          console.error('Error finding admin:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        if (adminResults.length === 0) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
        const admin = adminResults[0];
        try {
          const match = await bcrypt.compare(password, admin.password);
          if (!match) {
            return res.status(401).json({ error: 'Invalid email or password' });
          }
          // Generate JWT token (admin)
          const token = jwt.sign(
            { adminId: admin.id, email: admin.email, isAdmin: true },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
          );
          return res.json({
            message: 'Admin login successful!',
            token,
            user: { id: admin.id, name: admin.name, email: admin.email, isAdmin: true }
          });
        } catch (error) {
          console.error('Error comparing admin passwords:', error);
          return res.status(500).json({ error: 'Server error' });
        }
      });
    }
  });
});

module.exports = router;
