import './Home.css';
import planeImage from '../assets/plane.jpg';

function Home() {
  return (
    <div className="home-page-fx animate-fadein">
      {/* Hero Section */}
      <div className="hero-fx" style={{ backgroundImage: `url(${planeImage})` }}>
        <div className="hero-overlay">
          <h1 className="hero-title">Welcome to Celestia Airlines ✈️</h1>
          <p className="hero-desc">Book your next journey with confidence and comfort.</p>
          <a href="/flights" className="primary-btn hero-btn">Find Flights</a>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="section about-section">
        <h2 className="section-title">Why Choose Celestia?</h2>
        <div className="highlights-fx">
          <div className="highlight-card">
            <h3>🌍 Global Destinations</h3>
            <p>Fly to 100+ cities worldwide with seamless connections.</p>
          </div>
          <div className="highlight-card">
            <h3>🛡️ Secure Booking</h3>
            <p>Real-time seat availability and secure payment processing.</p>
          </div>
          <div className="highlight-card">
            <h3>💺 Comfort & Service</h3>
            <p>Modern aircraft, friendly staff, and 24/7 support.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section">
        <h2 className="section-title center">How It Works</h2>
        <ol className="how-works-list">
          <li>Register or log in to your account.</li>
          <li>Search for flights by origin, destination, and date.</li>
          <li>Book your preferred flight and pay securely.</li>
          <li>Receive your e-ticket instantly after payment.</li>
          <li>Manage your bookings and tickets from your dashboard.</li>
        </ol>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <h2 className="section-title center">What Our Passengers Say</h2>
        <div className="testimonials-carousel">
          <div className="testimonial-card">
            <p>“The in-flight meals were surprisingly delicious and the staff was super friendly!”</p>
            <strong>- Maria, Food Blogger</strong>
          </div>
          <div className="testimonial-card">
            <p>“I booked last minute and still got a great seat. Will fly again!”</p>
            <strong>- Jamal, Startup Founder</strong>
          </div>
          <div className="testimonial-card">
            <p>“Loved the smooth check-in process and the app notifications.”</p>
            <strong>- Zoe, Digital Nomad</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
