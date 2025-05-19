import planeImage from '../assets/plane.jpg';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="hero"
        style={{
          backgroundImage: `url(${planeImage})`,
        }}
      >
        <h1>Welcome to Celestia Airlines ✈️</h1>
        <p>Fly Beyond the Skies — Book Your Dream Journey Today!</p>
      </div>

      {/* About Us Section */}
      <section className="section about-section">
        <h2>About Us</h2>
        <p>
          At Celestia Airlines, we believe traveling is more than reaching a destination — it's about experiencing
          comfort, luxury, and memories along the way. Our commitment to excellence ensures your journey is unforgettable.
        </p>

        <div className="highlights">
          <div className="highlight">
            <h3>🌍 Global Reach</h3>
            <p>Serving over 100 destinations worldwide with premium flight options.</p>
          </div>
          <div className="highlight">
            <h3>✨ Luxury Experience</h3>
            <p>Top-class in-flight amenities and personalized services.</p>
          </div>
          <div className="highlight">
            <h3>🔔 24/7 Customer Support</h3>
            <p>Dedicated support team ready to assist you anytime, anywhere.</p>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="section destinations-section">
        <h2>Popular Destinations</h2>
        <div className="gallery">
          <div className="card">
            <h3>Paris, France</h3>
            <p>City of lights and love, offering world-class dining and iconic landmarks.</p>
          </div>
          <div className="card">
            <h3>New York, USA</h3>
            <p>The city that never sleeps, full of culture and entertainment.</p>
          </div>
          <div className="card">
            <h3>Dubai, UAE</h3>
            <p>Luxury, shopping, and modern marvels await you in Dubai.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
