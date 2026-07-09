import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Pointing one folder up to grab api.js

const CreateTrip = () => {
  const navigate = useNavigate();
  const [isCustomBudget, setIsCustomBudget] = useState(false);
  
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

  // Handle standard text/number inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Main Budget Tier Change
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

  // Handle Individual Breakdown Change
  const handleBreakdownChange = (category, value) => {
    setFormData((prev) => {
      const newBreakdown = { ...prev.budgetBreakdown, [category]: value };
      
      // Check if all breakdown values are identical
      const values = Object.values(newBreakdown);
      const allMatch = values.every(val => val === values[0]);
      
      return {
        ...prev,
        budgetBreakdown: newBreakdown,
        // If they mismatch, force the tier to 'Custom', otherwise set to the matched tier
        budgetTier: allMatch ? values[0] : 'Custom', 
      };
    });
  };

  // Submit the Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare payload: omit breakdown if not custom (as backend requested)
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
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">Plan Your Trip</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Core Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Starting Point</label>
            <input type="text" name="startingPoint" value={formData.startingPoint} onChange={handleChange} required className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Destination</label>
            <input type="text" name="destination" value={formData.destination} onChange={handleChange} required className="mt-1 block w-full border rounded-md p-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Duration (Days)</label>
            <input type="number" name="duration" min="1" value={formData.duration} onChange={handleChange} required className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Group Type</label>
            <select name="groupType" value={formData.groupType} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2">
              <option value="Solo">Solo</option>
              <option value="Couple">Couple</option>
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
            </select>
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Dietary Preference</label>
            <select name="dietaryPreference" value={formData.dietaryPreference} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2">
              <option value="Pure Veg">Pure Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Vegan">Vegan</option>
              <option value="Jain">Jain</option>
              <option value="Any">Any</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Travel Style</label>
            <select name="travelStyle" value={formData.travelStyle} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2">
              <option value="Relaxing">Relaxing</option>
              <option value="Adventure">Adventure</option>
              <option value="Cultural">Cultural</option>
              <option value="Nature">Nature</option>
              <option value="Nightlife">Nightlife</option>
            </select>
          </div>
        </div>

        <hr className="my-6" />

        {/* Smart Budget Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium">Overall Budget Tier</label>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="customToggle"
                checked={isCustomBudget} 
                onChange={(e) => setIsCustomBudget(e.target.checked)} 
              />
              <label htmlFor="customToggle" className="text-sm text-gray-600">Customize Budget</label>
            </div>
          </div>
          
          <select name="budgetTier" value={formData.budgetTier} onChange={handleTierChange} className="mt-1 block w-full border rounded-md p-2">
            <option value="Budget">Budget</option>
            <option value="Moderate">Moderate</option>
            <option value="Luxury">Luxury</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {/* Conditional Custom Breakdown */}
        {isCustomBudget && (
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border mt-4">
            {['travel', 'food', 'stay', 'adventures'].map((category) => (
              <div key={category}>
                <label className="block text-sm font-medium capitalize">{category}</label>
                <select 
                  value={formData.budgetBreakdown[category]} 
                  onChange={(e) => handleBreakdownChange(category, e.target.value)}
                  className="mt-1 block w-full border rounded-md p-2"
                >
                  <option value="Budget">Budget</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition">
          Generate Itinerary
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;