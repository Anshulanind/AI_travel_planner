import express from 'express';
import Trip from '../models/Trip.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// GET /api/trips - Fetch the user's trips
// ==========================================
router.get('/', auth, async (req, res) => {
  try {
    const userTrips = await Trip.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(userTrips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// POST /api/trips - Create a new trip with budget sync
// ==========================================
router.post('/', auth, async (req, res) => {
  try {
    let { 
      startingPoint, 
      destination, 
      duration, 
      groupType, 
      budgetTier, 
      budgetBreakdown, 
      dietaryPreference, 
      travelStyle, 
      itinerary 
    } = req.body;

    // Smart Budget Syncing Logic
    if (budgetBreakdown && Object.keys(budgetBreakdown).length > 0) {
      const { travel, food, stay, adventures } = budgetBreakdown;
      
      const isUniform = (travel === food && food === stay && stay === adventures);

      if (isUniform && travel) {
        budgetTier = travel;
      } else {
        budgetTier = 'Custom';
      }
    } else if (budgetTier && budgetTier !== 'Custom') {
      budgetBreakdown = {
        travel: budgetTier,
        food: budgetTier,
        stay: budgetTier,
        adventures: budgetTier
      };
    }

    const newTrip = new Trip({
      userId: req.user.userId,
      startingPoint,
      destination,
      duration,
      groupType,
      budgetTier,
      budgetBreakdown,
      dietaryPreference,
      travelStyle,
      itinerary
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;