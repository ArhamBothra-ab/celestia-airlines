import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notify } from '../services/toast';
import ConfirmDialog from '../components/ConfirmDialog';
import './Flights.css';

function Flights() {
  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    flightId: null,
    flight: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch airports data
    const fetchAirports = async () => {      try {
        const response = await fetch('http://localhost:5000/flights/airports');
        const data = await response.json();
        setAirports(data);
      } catch (err) {
        notify.error('Error fetching airports: ' + err.message);
      }
    };

    fetchAirports();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    setError('');    try {
      const queryString = new URLSearchParams({
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.date
      }).toString();
      const response = await fetch(`http://localhost:5000/flights?${queryString}`);
      const data = await response.json();
      setFlights(data);
      if (data.length === 0) {
        notify.info('No flights found for your search criteria');
      } else {
        notify.success(`Found ${data.length} flights matching your criteria`);
      }
    } catch (err) {
      setError('Error fetching flights: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchParams.origin || !searchParams.destination) {
      notify.warn('Please select both origin and destination airports');
      return;
    }
    if (!searchParams.date) {
      notify.warn('Please select a departure date');
      return;
    }
    if (searchParams.origin === searchParams.destination) {
      notify.warn('Origin and destination cannot be the same');
      return;
    }

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
      notify.warn('Please log in to book a flight');
      navigate('/auth');
      return;
    }
    setConfirmDialog({
      isOpen: true,
      flightId: flight_id,
      flight: flight
    });
  };

  const confirmBooking = () => {
    const { flightId: flight_id, flight } = confirmDialog;
    setConfirmDialog({ isOpen: false, flightId: null, flight: null });

    // If the flight is a dummy (id >= 10000), send all details including airport codes/cities
    const isDummy = flight.id >= 10000;
    let payload;
    if (isDummy) {
      const originAirport = airports.find(a => a.id === searchParams.origin || a.code === flight.origin_airport_code || a.city === flight.origin_city);
      const destAirport = airports.find(a => a.id === searchParams.destination || a.code === flight.destination_airport_code || a.city === flight.destination_city);
      
      payload = {
        flight: {
          ...flight,
          origin_airport_code: originAirport?.code || flight.origin_airport_code,
          origin_city: originAirport?.city || flight.origin_city,
          destination_airport_code: destAirport?.code || flight.destination_airport_code,
          destination_city: destAirport?.city || flight.destination_city,
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
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          notify.error(data.error);
        } else {
          // Immediately mark as paid
          fetch(`http://localhost:5000/bookings/${data.id}/pay`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
            .then(res => res.json())
            .then(payData => {
              if (payData.error) {
                notify.error('Booking created, but payment failed: ' + payData.error);
              } else {
                notify.success('Booking and payment successful! You can view your ticket in My Bookings.');
              }
            })
            .catch(err => notify.error('Booking created, but payment failed: ' + err.message));
        }
      })
      .catch(err => notify.error('Error booking flight: ' + err.message));
  };

  return (
    <div className="flights-page-fx animate-fadein">
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message="Would you like to proceed to payment and book this flight?"
        onConfirm={confirmBooking}
        onCancel={() => setConfirmDialog({ isOpen: false, flightId: null, flight: null })}
      />
      
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
          <input type="date" name="date" value={searchParams.date} onChange={handleInputChange} required />
          <button type="submit" className="primary-btn">Search Flights</button>
        </form>
      </div>

      {loading && <div className="loading">Loading flights...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && flights.length > 0 && (
        <div className="flights-results">
          {flights.map(flight => (
            <div key={flight.id} className="flights-result-card">
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
          ))}
        </div>
      )}
    </div>
  );
}

export default Flights;
