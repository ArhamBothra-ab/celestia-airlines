import React, { useState, useEffect } from 'react';
import FlightCard from '../components/FlightCard';
import './Flights.css';

function Flights() {
  const [flights, setFlights] = useState([]);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departure_date: ''
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = () => {
    fetch('http://localhost:5000/flights')
      .then(res => res.json())
      .then(data => setFlights(data))
      .catch(err => console.error('Error fetching flights:', err));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(searchParams).toString();
    fetch(`http://localhost:5000/flights?${queryParams}`)
      .then(res => res.json())
      .then(data => setFlights(data))
      .catch(err => console.error('Error searching flights:', err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBook = (flight_id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to book a flight.');
      return;
    }
    fetch('http://localhost:5000/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ flight_id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Booking successful!');
        }
      })
      .catch(err => alert('Error booking flight: ' + err.message));
  };

  return (
    <div className="flights-page">
      <div className="search-container">
        <h2>Search Flights</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            name="origin"
            placeholder="From"
            value={searchParams.origin}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="destination"
            placeholder="To"
            value={searchParams.destination}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="departure_date"
            value={searchParams.departure_date}
            onChange={handleInputChange}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="flights-grid">
        {flights.map(flight => (
          <FlightCard key={flight.id} flight={flight} onBook={handleBook} />
        ))}
      </div>
    </div>
  );
}

export default Flights;
