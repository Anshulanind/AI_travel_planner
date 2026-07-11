import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './CreateTrip.css'; 

const CreateTrip = () => {
  const navigate = useNavigate();
  const [isCustomBudget, setIsCustomBudget] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    startingPoint: '',
    destination: '',
    duration: 1,
    groupType: 'Solo',
    budgetTier: 'Moderate',
    budgetBreakdown: {
      travel: 'Moderate',
      food: 'Moderate',
      stay: 'Moderate',
      adventures: 'Moderate',
    },
    dietaryPreference: 'Any',
    travelStyle: 'Relaxing',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTierChange = (e) => {
    const tier = e.target.value;
    
    if (tier === 'Custom') {
      setIsCustomBudget(true);
      setFormData((prev) => ({ ...prev, budgetTier: 'Custom' }));
    } else {
      setFormData((prev) => ({
        ...prev,
        budgetTier: tier,
        budgetBreakdown: { travel: tier, food: tier, stay: tier, adventures: tier }
      }));
    }
  };

  const handleBreakdownChange = (category, value) => {
    setFormData((prev) => {
      const newBreakdown = { ...prev.budgetBreakdown, [category]: value };
      
      const values = Object.values(newBreakdown);
      const allMatch = values.every(val => val === values[0]);
      
      return {
        ...prev,
        budgetBreakdown: newBreakdown,
        budgetTier: allMatch ? values[0] : 'Custom', 
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    try {
      const payload = { ...formData };
      if (payload.budgetTier !== 'Custom') {
        delete payload.budgetBreakdown; 
      }

      const response = await api.post('/trips', payload);
      console.log('Trip created:', response.data);
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error creating trip:', error.response?.data || error.message);
      alert('Failed to save trip. Check the console.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="create-trip-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h2>Plan Your Next Adventure</h2>
          <p>Tell us what you want, and our AI will handle the rest.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="trip-form">
          
          {/* CARD 1: Core Info */}
          <div className="form-card">
            <h3>The Basics</h3>
            <div className="input-grid-2">
              <div className="input-group">
                <label>Starting Point</label>
                <input type="text" name="startingPoint" value={formData.startingPoint} onChange={handleChange} required placeholder="e.g., New Delhi" />
              </div>
              <div className="input-group">
                <label>Destination</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleChange} required placeholder="e.g., Bali, Indonesia" />
              </div>
              <div className="input-group">
                <label>Duration (Days)</label>
                <input type="number" name="duration" min="1" value={formData.duration} onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* CARD 2: Preferences */}
          <div className="form-card">
            <h3>Travel Preferences</h3>
            <div className="input-grid-3">
              <div className="input-group">
                <label>Group Type</label>
                <select name="groupType" value={formData.groupType} onChange={handleChange}>
                  <option value="Solo">Solo</option>
                  <option value="Couple">Couple</option>
                  <option value="Family">Family</option>
                  <option value="Friends">Friends</option>
                </select>
              </div>
              <div className="input-group">
                <label>Dietary</label>
                <select name="dietaryPreference" value={formData.dietaryPreference} onChange={handleChange}>
                  <option value="Pure Veg">Pure Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Jain">Jain</option>
                  <option value="Any">Any</option>
                </select>
              </div>
              <div className="input-group">
                <label>Travel Style</label>
                <select name="travelStyle" value={formData.travelStyle} onChange={handleChange}>
                  <option value="Relaxing">Relaxing</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Nature">Nature</option>
                  <option value="Nightlife">Nightlife</option>
                </select>
              </div>
            </div>
          </div>

          {/* CARD 3: Smart Budget Section */}
          <div className="form-card">
            <h3>Budget Planning</h3>
            
            <div className="budget-header">
              <label>Overall Budget Tier</label>
              <div className="custom-toggle-container">
                <input 
                  type="checkbox" 
                  id="customToggle"
                  checked={isCustomBudget} 
                  onChange={(e) => setIsCustomBudget(e.target.checked)} 
                />
                <label htmlFor="customToggle">Customize Budget</label>
              </div>
            </div>
            
            <select name="budgetTier" value={formData.budgetTier} onChange={handleTierChange} className="main-budget-select">
              <option value="Budget">Budget</option>
              <option value="Moderate">Moderate</option>
              <option value="Luxury">Luxury</option>
              <option value="Custom">Custom</option>
            </select>

            {/* Conditional Custom Breakdown */}
            {isCustomBudget && (
              <div className="custom-breakdown-grid">
                {['travel', 'food', 'stay', 'adventures'].map((category) => (
                  <div className="input-group" key={category}>
                    <label className="capitalize-label">{category}</label>
                    <select 
                      value={formData.budgetBreakdown[category]} 
                      onChange={(e) => handleBreakdownChange(category, e.target.value)}
                    >
                      <option value="Budget">Budget</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`submit-button ${isLoading ? 'is-loading' : ''}`}
          >
            {isLoading 
              ? `✨ Our AI is handcrafting your trip to ${formData.destination || 'your destination'}...` 
              : 'Generate Itinerary'
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;