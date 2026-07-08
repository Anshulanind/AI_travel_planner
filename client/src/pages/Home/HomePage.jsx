import React from 'react';
// Import the CSS file directly into the component
import './HomePage.css'; 

const HomePage = () => {
  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="nav-container">
          <a href="/" className="brand-logo">AI Travel Planner</a>
          <nav>
            <ul className="nav-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register" className="btn-primary">Register</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main>
        
        {/* HERO SECTION */}
        <section id="hero" className="hero-section">
          <h1 className="hero-title">
            Plan Your Perfect Trip in <span className="text-gradient">Seconds</span>
          </h1>
          <p className="hero-subtitle">
            Enter your destination, timeline, and budget. Our intelligent system will generate a complete, optimized daily itinerary tailored to your specific preferences.
          </p>
          <a href="/register" className="btn-cta">Start Planning Now</a>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="features-section">
          <div className="features-container">
            <h2 className="section-title">Why Use Our Planner?</h2>
            
            <div className="features-grid">
              <article className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>Smart AI Routing</h3>
                <p>Our algorithms calculate the most efficient path between attractions to minimize your travel time.</p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">💰</div>
                <h3>Budget Optimization</h3>
                <p>Keep your expenses firmly in check with intelligent cost estimations matching your financial baseline.</p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">⚙️</div>
                <h3>Dynamic Customization</h3>
                <p>Don't like a recommendation? Swap out locations dynamically and regenerate paths instantly.</p>
              </article>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <p>&copy; 2026 AI Travel Planner. All rights reserved.</p>
        <nav className="footer-nav">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="https://github.com/Anshulanind" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </nav>
      </footer>
    </>
  );
};

export default HomePage;