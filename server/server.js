// 1. Force Node to use Google DNS (Bypasses Windows SRV Bug)
// import dns from 'node:dns';
// dns.setServers(['8.8.8.8', '8.8.4.4']);

// 2. Import packages
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; 

import path from 'path';
import { fileURLToPath } from 'url';

// These three lines force Node to look for the .env file in the EXACT 
// same folder that this server.js file is sitting in.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// 3. Import Routes
import authRoutes from './routes/auth.js';
import tripsRoutes from './routes/trips.js';

const app = express();

// Middleware
app.use(cors({
  origin: "https://ai-travel-planner-flame-zeta.vercel.app", // The exact URL of your frontend
  credentials: true
}));
app.use(express.json());

// 4. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    // Quick debug check to prove the variables loaded!
    console.log("📧 Email configured as:", process.env.EMAIL_USER);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });

// 5. Use Auth Routes
// This wires up your routes so they prepend /api/auth to endpoints
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripsRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});