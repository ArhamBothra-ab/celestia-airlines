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

      {/* Popular Destinations Section */}
      <section className="section">
        <h2 className="section-title center">Popular Destinations</h2>
        <div className="destinations-grid">
          <div className="destination-card">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Santorini, Greece" />
            <h3>Santorini, Greece</h3>
            <p>Famous for its whitewashed houses and blue domes overlooking the Aegean Sea.</p>
          </div>
          <div className="destination-card">
            <img src="https://images.unsplash.com/photo-1465156799763-2c087c332922?auto=format&fit=crop&w=400&q=80" alt="Kyoto, Japan" />
            <h3>Kyoto, Japan</h3>
            <p>Experience cherry blossoms, ancient temples, and tranquil gardens.</p>
          </div>
          <div className="destination-card">
            <img src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80" alt="Paris, France" />
            <h3>Paris, France</h3>
            <p>The city of lights, romance, and world-class cuisine.</p>
          </div>
          <div className="destination-card">
            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Bali, Indonesia" />
            <h3>Bali, Indonesia</h3>
            <p>Stunning beaches, lush rice terraces, and vibrant culture.</p>
          </div>
          <div className="destination-card">
            <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80" alt="New York, USA" />
            <h3>New York, USA</h3>
            <p>The city that never sleeps, with iconic landmarks and endless energy.</p>
          </div>
          <div className="destination-card">
            <img src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80" alt="Cape Town, South Africa" />
            <h3>Cape Town, South Africa</h3>
            <p>Majestic Table Mountain, beautiful beaches, and rich history.</p>
          </div>
        </div>
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
