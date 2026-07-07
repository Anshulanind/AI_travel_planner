import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT =5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});