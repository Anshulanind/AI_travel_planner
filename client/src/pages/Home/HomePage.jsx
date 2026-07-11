import React from 'react';
import { Link } from 'react-router-dom'; // 1. IMPORT THIS
import './HomePage.css'; 

const HomePage = () => {
  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="nav-container">
          {/* Changed to Link */}
          <Link to="/" className="brand-logo">AI Travel Planner</Link>
          <nav>
            <ul className="nav-links">
              {/* Anchor links (#) stay as <a> tags because they just scroll the current page */}
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              
              {/* Changed internal page navigation to Link */}
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register" className="btn-primary">Register</Link></li>
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
          
          {/* Changed CTA to Link */}
          <Link to="/register" className="btn-cta">Start Planning Now</Link>
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
          {/* Changed internal pages to Link */}
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          
          {/* External website links MUST stay as <a> tags! */}
          <a href="https://github.com/Anshulanind" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </nav>
      </footer>
    </>
  );
};

export default HomePage;