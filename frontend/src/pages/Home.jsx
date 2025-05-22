import './Home.css';
import planeImage from '../assets/plane.jpg';

function Home() {
  return (
    <div className="home-page-fx animate-fadein">
      {/* Hero Section */}
      <div className="hero-fx" style={{ backgroundImage: `url(${planeImage})` }}>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to Celestia Airlines</h1>
            <a href="/flights" className="primary-btn">Find Flights</a>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="section about-section">
        <div className="section-content">
          <h2>Our Story</h2>
          <p>
            Founded in 2023, Celestia Airlines emerged with a vision to transform air travel
            through innovation, comfort, and sustainability. Our commitment to excellence
            has made us one of the fastest-growing airlines in the region.
          </p>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>50+</h3>
              <p>Aircrafts</p>
            </div>
            <div className="stat-card">
              <h3>100+</h3>
              <p>Destinations</p>
            </div>
            <div className="stat-card">
              <h3>45+</h3>
              <p>Countries</p>
            </div>
            <div className="stat-card">
              <h3>5M+</h3>
              <p>Happy Passengers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section features-section">
        <div className="section-content">
          <h2>Why Choose Celestia?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🌍 Global Network</h3>
              <p>Connect to over 100 destinations across 45 countries.</p>
            </div>
            <div className="feature-card">
              <h3>✈️ Modern Fleet</h3>
              <p>Latest Airbus A350 and Boeing 787 Dreamliner aircraft.</p>
            </div>
            <div className="feature-card">
              <h3>🌱 Sustainability</h3>
              <p>Committed to eco-friendly practices and sustainable aviation.</p>
            </div>
            <div className="feature-card">
              <h3>🏆 Excellence</h3>
              <p>Award-winning service and operational efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="section destinations-section">
        <div className="section-content">
          <h2>Popular Destinations</h2>
          <div className="destinations-grid">
            <div className="destination-card">
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Santorini" />
              <div className="destination-info">
                <h3>Santorini, Greece</h3>
                <p>Famous for its whitewashed houses and blue domes overlooking the Aegean Sea.</p>
              </div>
            </div>
            <div className="destination-card">
              <img src="https://images.unsplash.com/photo-1465156799763-2c087c332922?auto=format&fit=crop&w=400&q=80" alt="Kyoto" />
              <div className="destination-info">
                <h3>Kyoto, Japan</h3>
                <p>Experience cherry blossoms, ancient temples, and tranquil gardens.</p>
              </div>
            </div>
            <div className="destination-card">
              <img src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80" alt="Paris" />
              <div className="destination-info">
                <h3>Paris, France</h3>
                <p>The city of lights, romance, and world-class cuisine.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials-section">
        <div className="section-content">
          <h2>What Our Passengers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-emoji">🎨</div>
              <p>"Drew a masterpiece during turbulence. Celestia's smooth flying turned my coffee spill into abstract art!"</p>
              <strong>- Alex, Accidental Artist</strong>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-emoji">😴</div>
              <p>"Seats so comfy, I missed my stop... twice! Worth the round-trip though."</p>
              <strong>- Sam, Professional Napper</strong>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-emoji">🎮</div>
              <p>"Beat my high score on the in-flight entertainment system. Now I book longer flights on purpose!"</p>
              <strong>- Kim, Gaming Enthusiast</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
