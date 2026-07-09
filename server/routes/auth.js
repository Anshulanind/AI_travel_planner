import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendOTP } from '../mail/mailer.js'; // 1. Import your sendOTP function

const router = express.Router();

// --- 1. REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Generate a random 6-digit OTP string
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes expiry window

    // 3. Attach the OTP details to the new user model
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false, // Explicit safety flag
      otp,
      otpExpires
    });

    await newUser.save();

    // 4. Trigger email dispatch out to your user
    await sendOTP(email, otp);

    // Status code changed to 200 to neatly fit the React transition steps
    res.status(200).json({ message: 'OTP sent to email. Please verify.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 2. VERIFY OTP ROUTE (NEW) ---
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Validate if OTP fields match and have not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code.' });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    // Success! Flip verification flags and clear sensitive OTP space
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 3. LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 5. Block the entry loop if the user skipped OTP registration
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';

    const token = jwt.sign(
      { userId: user._id }, 
      jwtSecret, 
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;