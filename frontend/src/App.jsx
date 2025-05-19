import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Bookings from './pages/Bookings';
import Auth from './pages/Auth'; // <--- NEW IMPORT
import Tickets from './pages/Tickets';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/auth" element={<Auth />} /> {/* <--- NEW ROUTE */}
      </Routes>
    </Router>
  );
}

export default App;
