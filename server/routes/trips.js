import express from 'express';
import { GoogleGenAI } from '@google/genai';
import Trip from '../models/trips.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Initialize Gemini (It automatically looks for process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// POST /api/trips - Generate AI Itinerary & Save (GEMINI VERSION)
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
      travelStyle 
    } = req.body;

    // 1. Smart Budget Syncing Logic
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
        travel: budgetTier, food: budgetTier, stay: budgetTier, adventures: budgetTier
      };
    }

    // 2. The Magic Prompt
    const prompt = `
      You are an expert travel agent. Create a highly detailed, ${duration}-day travel itinerary for a ${groupType} trip.
      Starting Point: ${startingPoint}
      Destination: ${destination}
      Travel Style: ${travelStyle}
      Dietary Preference: ${dietaryPreference}
      Overall Budget: ${budgetTier}
      Specific Budget Details: Travel-${budgetBreakdown.travel}, Food-${budgetBreakdown.food}, Stay-${budgetBreakdown.stay}, Adventures-${budgetBreakdown.adventures}

      Provide a structured daily plan. You MUST respond strictly in JSON format matching the following structure exactly:
      {
        "itinerary": [
          {
            "day": 1,
            "theme": "Arrival and Exploration",
            "activities": [
              {
                "time": "Morning",
                "title": "Flight to Destination",
                "description": "Specific details about the activity.",
                "estimatedCost": "Estimated cost based on budget"
              }
            ]
          }
        ]
      }
    `;

    // 3. Call the Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash', 
      contents: prompt,
      config: {
        // This forces Gemini to output clean JSON without Markdown formatting
        responseMimeType: "application/json",
      }
    });

    // 4. Parse the AI Response
    const aiResponseString = response.text;
    const aiData = JSON.parse(aiResponseString);
    
    // Safety check just in case Gemini wrapped it in an array or object differently
    const generatedItinerary = aiData.itinerary || aiData; 

    // 5. Save everything to MongoDB
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
      itinerary: generatedItinerary 
    });

    const savedTrip = await newTrip.save();

    // 6. Send ONLY the _id back to the frontend
    res.status(201).json({ _id: savedTrip._id });

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;