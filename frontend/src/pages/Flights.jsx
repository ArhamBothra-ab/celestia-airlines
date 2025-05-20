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
  const [airports, setAirports] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loadingAirports, setLoadingAirports] = useState(true);
  const [airportError, setAirportError] = useState('');

  useEffect(() => {
    setLoadingAirports(true);
    // Fetch all airports for dropdowns
    fetch('http://localhost:5000/flights/airports')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch airports');
        return res.json();
      })
      .then(data => {
        setAirports(data);
        setLoadingAirports(false);
      })
      .catch(err => {
        setAirportError('Could not load airports. Please check backend.');
        setLoadingAirports(false);
      });
  }, []);

  const fetchFlights = () => {
    const queryParams = new URLSearchParams(searchParams).toString();
    fetch(`http://localhost:5000/flights?${queryParams}`)
      .then(res => res.json())
      .then(data => {
        setFlights(data);
        setSearched(true);
      })
      .catch(err => console.error('Error searching flights:', err));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFlights();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBook = (flight_id, flight) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to book a flight.');
      return;
    }
    // If the flight is a dummy (id >= 10000), send all details
    const isDummy = flight.id >= 10000;
    const payload = isDummy
      ? { flight: {
            flight_number: flight.flight_number,
            origin_airport_id: flight.origin_airport_id,
            destination_airport_id: flight.destination_airport_id,
            departure_date: flight.departure_date,
            departure_time: flight.departure_time,
            arrival_date: flight.arrival_date || flight.departure_date,
            arrival_time: flight.arrival_time || flight.departure_time,
            price: flight.price || 100,
            seats: flight.seats || 20,
            class: flight.class || 'Economy'
        }}
      : { flight_id };
    fetch('http://localhost:5000/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Booking successful! You can view your booking in My Bookings.');
        }
      })
      .catch(err => alert('Error booking flight: ' + err.message));
  };

  return (
    <div className="flights-page-fx animate-fadein">
      <h2 className="flights-title">Find Your Flight</h2>
      <div className="flights-card">
        <form onSubmit={handleSearch} className="flights-form">
          <select name="origin" value={searchParams.origin} onChange={handleInputChange} required>
            <option value="">From</option>
            {airports.map(a => (
              <option key={a.id} value={a.id}>{a.city} ({a.code})</option>
            ))}
          </select>
          <select name="destination" value={searchParams.destination} onChange={handleInputChange} required>
            <option value="">To</option>
            {airports.map(a => (
              <option key={a.id} value={a.id}>{a.city} ({a.code})</option>
            ))}
          </select>
          <input name="departure_date" type="date" value={searchParams.departure_date} onChange={handleInputChange} required />
          <button type="submit" className="primary-btn" disabled={loadingAirports}>{loadingAirports ? <span className="flights-spinner"></span> : 'Search'}</button>
        </form>
        {airportError && <div className="flights-error">{airportError}</div>}
      </div>
      {searched && (
        <div className="flights-results">
          {flights.length === 0 ? (
            <div className="flights-empty">No flights found for your search.</div>
          ) : (
            flights.map(flight => (
              <div className="flights-result-card" key={flight.id}>
                <div className="flights-result-header">
                  <span className="flights-result-number">{flight.flight_number}</span>
                  <span className="flights-result-class">{flight.class}</span>
                </div>
                <div className="flights-result-info">
                  <span>{flight.origin_city} → {flight.destination_city}</span>
                  <span>{flight.departure_date} {flight.departure_time}</span>
                </div>
                <div className="flights-result-seats">Seats: {flight.seats}</div>
                <button className="primary-btn" onClick={() => handleBook(flight.id, flight)}>Book</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Flights;
