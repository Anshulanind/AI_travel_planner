import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Prevents duplicate accounts with the same email
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  // --- OTP VERIFICATION FIELDS ---
  isVerified: {
    type: Boolean,
    default: false // Users start as unverified until they enter the code
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  // --- TRAVEL PLANNER DATA ---
  savedTrips: {
    type: Array,
    default: [] // Ready to store the JSON itineraries from the AI later
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
export default User;