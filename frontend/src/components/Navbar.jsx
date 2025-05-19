import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><NavLink to="/" activeClassName="active">Home</NavLink></li>
        <li><NavLink to="/flights" activeClassName="active">Flights</NavLink></li>
        <li><NavLink to="/bookings" activeClassName="active">Bookings</NavLink></li>
        <li><NavLink to="/auth" activeClassName="active">Login/Register</NavLink></li> {/* UPDATED */}
      </ul>
    </nav>
  );
}

export default Navbar;
