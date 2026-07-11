import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api.js'; // Central configuration helper with JWT attachments
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Intern'); 
  const [trips, setTrips] = useState([]); // Default to empty array, waiting for DB
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Protect Route and Fetch Trips dynamically on mount
  useEffect(() => {
    // 1. Verify Authentication Presence
    const token = localStorage.getItem('token'); // Matched to standardized key
    if (!token) {
      navigate('/login');
      return;
    }

    // 2. Fetch User's Trips from MongoDB
    const fetchUserTrips = async () => {
      try {
        const response = await api.get('/trips');
        setTrips(response.data); // Swaps database array into state management
      } catch (error) {
        console.error('Error retrieving dashboard payload:', error);
        setErrorMsg(error.response?.data?.message || 'Unable to connect to the trip matrix.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTrips();
  }, [navigate]);

  // Handle Logout execution
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clears out credentials session
    navigate('/login'); 
  };

  const handlePlanNewTrip = () => {
    navigate('/create-trip'); 
  };

  if (loading) {
    return <div className="text-center mt-10" style={{ padding: '4rem', textAlign: 'center', fontSize: '1.25rem' }}>Loading your adventures...</div>;
  }

  if (errorMsg) {
    return <div className="text-center mt-10 text-red-500" style={{ padding: '4rem', color: 'red', textAlign: 'center' }}>{errorMsg}</div>;
  }

  return (
    <div className="dashboard-wrapper">
      
      {/* TOP NAVIGATION BAR */}
      <header className="dash-navbar">
        <div className="dash-nav-container">
          <div className="dash-brand">AI Travel Planner</div>
          <div className="dash-user-menu">
            <span className="welcome-msg">Hello, <strong>{userName}</strong>! 👋</span>
            <div className="profile-icon">👤</div>
            <button className="btn-logout" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="dash-main">
        
        {/* HEADER HERO ACTIONS */}
        <section className="dash-action-panel">
          <div className="text-group">
            <h1>Your Adventure Dashboard</h1>
            <p>Coordinate your off-days, calculate your stipend spend, and optimize your breaks.</p>
          </div>
          {/* THE MAIN CALL-TO-ACTION (CTA) */}
          <button className="btn-cta-new-trip" onClick={handlePlanNewTrip}>
            <span className="plus-icon">＋</span> Plan a New Trip
          </button>
        </section>

        <hr className="section-divider" />

        {/* SAVED / RECENT TRIPS GRID & EMPTY STATE */}
        <section className="trips-section">
          <h2 className="trips-section-title">Upcoming & Past Getaways</h2>
          
          {trips.length === 0 ? (
            /* THE EMPTY STATE */
            <div className="empty-state-card">
              <div className="empty-icon">🎒</div>
              <h3>You haven't planned any trips yet.</h3>
              <p>Stipend ticking away? Let's explore the world outside the office cubicle!</p>
              <button className="btn-secondary" onClick={handlePlanNewTrip}>Generate Your First Itinerary</button>
            </div>
          ) : (
            /* VISUAL GRID OF REAL TRIP CARDS FROM MONGODB */
            <div className="trips-grid">
              {trips.map((trip) => (
                // Uses MongoDB's default unique key identifier string: _id
                <article key={trip._id} className="trip-card">
                  <div className="card-image-wrapper">
                    {/* Generates a nice default placeholder image if no specific URL is specified by your API */}
                    <img 
                      src={trip.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400&auto=format&fit=crop"} 
                      alt={trip.destination} 
                      className="trip-thumb" 
                    />
                  </div>
                  <div className="card-details">
                    <h3 className="trip-destination">{trip.destination}</h3>
                    <p className="trip-duration">⏱️ {trip.duration} {trip.duration === 1 ? 'Day' : 'Days'}</p>
                    
                    {/* Brand new meta rows tracking matching backend enum types */}
                    <div className="trip-meta-tags" style={{ display: 'flex', gap: '5px', margin: '8px 0', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px' }}>
                        👥 {trip.groupType}
                      </span>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '12px' }}>
                        ✨ {trip.travelStyle}
                      </span>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px' }}>
                        💰 {trip.budgetTier}
                      </span>
                    </div>

                    <button onClick={() => navigate(`/trip/${trip._id}`)}>  View AI Itinerary </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default Dashboard;