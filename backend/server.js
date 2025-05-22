const express = require('express');
const path = require('path');
const bookingsRoute = require('./routes/bookings');
const usersRoute = require('./routes/users');
const cors = require('cors');
const db = require('./db');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const flightsRoute = require('./routes/flights');
const adminRoute = require('./routes/admin');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:*"],
      imgSrc: ["'self'", "data:", "http://localhost:*", "https://ui-avatars.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Rate limiting - more permissive for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // increased limit
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Celestia Airlines Backend is Running ✈️');
});

app.use('/flights', flightsRoute);
app.use('/bookings', bookingsRoute);
app.use('/users', usersRoute);
app.use('/admin', adminRoute);

// Serve uploaded avatars
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
