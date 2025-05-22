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
    if (!window.confirm('Proceed to payment and book this flight?')) return;
    // If the flight is a dummy (id >= 10000), send all details including airport codes/cities
    const isDummy = flight.id >= 10000;
    let payload;
    if (isDummy) {
      const originAirport = airports.find(a => a.id === searchParams.origin || a.code === flight.origin_airport_code || a.city === flight.origin_city);
      const destAirport = airports.find(a => a.id === searchParams.destination || a.code === flight.destination_airport_code || a.city === flight.destination_city);
      payload = {
        flight: {
          flight_number: flight.flight_number,
          origin_airport_id: originAirport ? originAirport.id : null,
          origin_airport_code: originAirport ? originAirport.code : flight.origin_airport_code,
          origin_city: originAirport ? originAirport.city : flight.origin_city,
          destination_airport_id: destAirport ? destAirport.id : null,
          destination_airport_code: destAirport ? destAirport.code : flight.destination_airport_code,
          destination_city: destAirport ? destAirport.city : flight.destination_city,
          departure_date: flight.departure_date,
          departure_time: flight.departure_time,
          arrival_date: flight.arrival_date || flight.departure_date,
          arrival_time: flight.arrival_time || flight.departure_time,
          price: flight.price || 100,
          seats: flight.seats || 20,
          class: flight.class || 'Economy'
        }
      };
    } else {
      payload = { flight_id };
    }
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
          // Immediately mark as paid
          fetch(`http://localhost:5000/bookings/${data.id}/pay`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(payData => {
              if (payData.error) {
                alert('Booking created, but payment failed: ' + payData.error);
              } else {
                alert('Booking and payment successful! You can view your ticket in My Bookings.');
              }
            })
            .catch(err => alert('Booking created, but payment failed: ' + err.message));
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
