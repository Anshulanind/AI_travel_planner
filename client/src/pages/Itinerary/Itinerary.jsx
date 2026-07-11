import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api'; // Using your existing API setup
import './Itinerary.css';

const Itinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await api.get(`/trips/${id}`);
        setTrip(response.data);
      } catch (err) {
        console.error('Failed to fetch trip:', err);
        setError('Could not load your itinerary. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  // Helper function to assign an icon based on the time of day
  const getTimeIcon = (time) => {
    const timeLower = time.toLowerCase();
    if (timeLower.includes('morning')) return '☕';
    if (timeLower.includes('afternoon')) return '☀️';
    if (timeLower.includes('evening') || timeLower.includes('night')) return '🌙';
    return '📍';
  };

  if (loading) return <div className="itinerary-loader">Loading your dream trip...</div>;
  if (error) return <div className="itinerary-error">{error}</div>;
  if (!trip) return <div className="itinerary-error">Trip not found.</div>;

  return (
    <div className="itinerary-page">
      {/* Massive Header Section */}
      <header className="itinerary-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1 className="destination-title">{trip.destination}</h1>
        <div className="trip-meta">
          <span className="meta-tag">🗓️ {trip.duration} Days</span>
          <span className="meta-tag">👥 {trip.groupType}</span>
          <span className="meta-tag">💰 {trip.budgetTier} Budget</span>
          <span className="meta-tag">✨ {trip.travelStyle}</span>
        </div>
      </header>

      {/* The Itinerary Timeline */}
      <div className="itinerary-content">
        {trip.itinerary && trip.itinerary.map((day, index) => (
          <div key={index} className="day-card">
            <div className="day-header">
              <h2>Day {day.day}</h2>
              <span className="day-theme">{day.theme}</span>
            </div>

            <div className="activities-list">
              {day.activities.map((activity, actIndex) => (
                <div key={actIndex} className="activity-item">
                  <div className="activity-time-col">
                    <span className="time-icon">{getTimeIcon(activity.time)}</span>
                    <span className="time-text">{activity.time}</span>
                  </div>
                  <div className="activity-details-col">
                    <h3 className="activity-title">{activity.title}</h3>
                    <p className="activity-desc">{activity.description}</p>
                    {activity.estimatedCost && (
                      <span className="activity-cost">Cost: {activity.estimatedCost}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Itinerary;