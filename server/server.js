// 1. Force Node to use Google DNS (Bypasses Windows SRV Bug)
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

// 2. Import packages
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config'; 

// 3. Import Routes
import authRoutes from './routes/auth.js';
import tripsRoutes from './routes/trips.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // The exact URL of your frontend
  credentials: true
}));
app.use(express.json());

// 4. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
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