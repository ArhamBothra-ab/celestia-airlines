const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Set up multer for avatar uploads (if not already present)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/avatars'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// POST /users/register - Register a new user (with avatar support)
router.post('/register', upload.single('avatar'), async (req, res) => {
  const { name, email, password, phone, dob, address } = req.body;
  let avatarUrl = null;
  if (req.file) {
    avatarUrl = `/uploads/avatars/${req.file.filename}`;
  }
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing name, email or password' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkSql = 'SELECT * FROM Users WHERE email = ?';
    db.query(checkSql, [email], async (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      // Insert new user with all fields
      const sql = 'INSERT INTO Users (name, email, password, phone, dob, address, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(sql, [name, email, hashedPassword, phone || null, dob || null, address || null, avatarUrl], (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          return res.status(500).json({ error: 'Failed to register user' });
        }
        const token = jwt.sign(
          { userId: result.insertId, email, name, phone, dob, address, avatar: avatarUrl },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );
        res.status(201).json({
          message: 'User registered successfully!',
          token,
          user: { id: result.insertId, name, email, phone, dob, address, avatar: avatarUrl }
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

  // Try Users table
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
        }        // Generate JWT token (set isAdmin if user.isAdmin)
        const token = jwt.sign(
          { 
            userId: user.id, 
            email: user.email,
            name: user.name,
            phone: user.phone,
            dob: user.dob,
            address: user.address,
            avatar: user.avatar_url, 
            isAdmin: !!user.isAdmin 
          },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );
        return res.json({
          message: 'Login successful!',
          token,
          user: { 
            id: user.id, 
            name: user.name, 
            email: user.email,
            phone: user.phone,
            dob: user.dob,
            address: user.address,
            avatar: user.avatar_url,
            isAdmin: !!user.isAdmin 
          }
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

// PUT /users/profile - Update user profile
router.put('/profile', require('../middleware/auth'), async (req, res) => {
  const userId = req.user.userId;
  const { name, email, phone, dob, address, avatar } = req.body;
  
  try {
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if email is already taken by another user
    const checkEmailSql = 'SELECT id FROM Users WHERE email = ? AND id != ?';
    const [existingUsers] = await new Promise((resolve, reject) => {
      db.query(checkEmailSql, [email, userId], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email is already taken by another user' });
    }

    // Build dynamic SQL query for non-null fields
    const updates = ['name=?', 'email=?'];
    const values = [name, email];
    
    if (phone !== undefined) { updates.push('phone=?'); values.push(phone || null); }
    if (dob !== undefined) { updates.push('dob=?'); values.push(dob || null); }
    if (address !== undefined) { updates.push('address=?'); values.push(address || null); }
    if (avatar !== undefined) { updates.push('avatar_url=?'); values.push(avatar || null); }
    values.push(userId);

    const sql = `UPDATE Users SET ${updates.join(', ')} WHERE id=?`;
    await new Promise((resolve, reject) => {
      db.query(sql, values, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Fetch updated user data
    const [updatedUser] = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM Users WHERE id=?', [userId], (err, results) => {
        if (err) reject(err);
        else resolve([results[0]]);
      });
    });

    if (!updatedUser) {
      throw new Error('Failed to fetch updated user');
    }

    // Generate new token with updated user data
    const token = jwt.sign(
      { 
        userId: updatedUser.id, 
        email: updatedUser.email, 
        name: updatedUser.name, 
        phone: updatedUser.phone, 
        dob: updatedUser.dob, 
        address: updatedUser.address, 
        avatar: updatedUser.avatar_url, 
        isAdmin: !!updatedUser.isAdmin 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Profile updated successfully',
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dob: updatedUser.dob,
        address: updatedUser.address,
        avatar: updatedUser.avatar_url,
        isAdmin: !!updatedUser.isAdmin
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile. Please try again.' });
  }
});

// POST /users/change-password - Change user password
router.post('/change-password', require('../middleware/auth'), async (req, res) => {
  const userId = req.user.userId;
  const { current, newPassword } = req.body;
  if (!current || !newPassword) return res.status(400).json({ error: 'Missing fields' });
  db.query('SELECT password FROM Users WHERE id=?', [userId], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'User not found' });
    const match = await bcrypt.compare(current, results[0].password);
    if (!match) return res.status(401).json({ error: 'Current password incorrect' });
    const hashed = await bcrypt.hash(newPassword, 10);
    db.query('UPDATE Users SET password=? WHERE id=?', [hashed, userId], err2 => {
      if (err2) return res.status(500).json({ error: 'Failed to update password' });
      res.json({ message: 'Password changed successfully' });
    });
  });
});

// POST /users/upload-avatar - Upload avatar image
router.post('/upload-avatar', require('../middleware/auth'), upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  db.query('UPDATE Users SET avatar_url=? WHERE id=?', [avatarUrl, req.user.userId], err => {
    if (err) return res.status(500).json({ error: 'Failed to save avatar' });
    // Issue a new JWT token with updated avatar
    const getUserSql = 'SELECT * FROM Users WHERE id = ?';
    db.query(getUserSql, [req.user.userId], (err2, results) => {
      if (err2 || results.length === 0) {
        return res.status(500).json({ error: 'Failed to fetch user for token' });
      }
      const user = results[0];
      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name, phone: user.phone, dob: user.dob, address: user.address, avatar: user.avatar_url, isAdmin: !!user.isAdmin },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      res.json({ message: 'Avatar uploaded', avatarUrl, token });
    });
  });
});

module.exports = router;
