const express = require('express');
const path = require('path');
const bookingsRoute = require('./routes/bookings');
const usersRoute = require('./routes/users');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const flightsRoute = require('./routes/flights');
const adminRoute = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Celestia Airlines Backend is Running ✈️');
});

app.use('/flights', flightsRoute);
app.use('/bookings', bookingsRoute);
app.use('/users', usersRoute);
app.use('/admin', adminRoute);
app.use(express.urlencoded({ extended: true }));

// Serve uploaded avatars
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
