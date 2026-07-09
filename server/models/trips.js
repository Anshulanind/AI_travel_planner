import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startingPoint: { 
    type: String, 
    required: [true, 'Starting location is required'] 
  },
  destination: { 
    type: String, 
    required: [true, 'Destination is required'] 
  },
  duration: { 
    type: Number,
    required: true,
    min: 1 
  }, 
  groupType: {
    type: String,
    enum: ['Solo', 'Couple', 'Family', 'Friends'],
    required: [true, 'Group type is required'],
    default: 'Solo'
  },
  budgetTier: { 
    type: String,
    enum: ['Budget', 'Moderate', 'Luxury', 'Custom'], 
    default: 'Moderate'
  },
  budgetBreakdown: {
    travel: { type: String, enum: ['Budget', 'Moderate', 'Luxury'] },
    food: { type: String, enum: ['Budget', 'Moderate', 'Luxury'] },
    stay: { type: String, enum: ['Budget', 'Moderate', 'Luxury'] },
    adventures: { type: String, enum: ['Budget', 'Moderate', 'Luxury'] }
  },
  dietaryPreference: {
    type: String,
    enum: ['Pure Veg', 'Non-Veg', 'Vegan', 'Jain', 'Any'],
    default: 'Any'
  },
  travelStyle: {
    type: String,
    enum: ['Relaxing', 'Adventure', 'Cultural', 'Nature', 'Nightlife'],
    default: 'Relaxing'
  },
  itinerary: { 
    type: Array, 
    default: [] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;