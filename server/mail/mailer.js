import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use SSL/TLS
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  },
  family: 4
});

// Notice the "export const" right here! This is what auth.js is looking for.
export const sendOTP = async (userEmail, otpCode) => {
  const mailOptions = {
    from: `"AI Travel Planner" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Verify your AI Travel Planner Account',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Welcome to AI Travel Planner! ✈️</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #2563eb; letter-spacing: 5px;">${otpCode}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ OTP Email sent successfully to:', userEmail);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};