// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false, // Use SSL/TLS
//   auth: {
//     user: process.env.EMAIL_USER, 
//     pass: process.env.EMAIL_PASS  
//   },
//   family: 4
// });

// // Notice the "export const" right here! This is what auth.js is looking for.
// export const sendOTP = async (userEmail, otpCode) => {
//   const mailOptions = {
//     from: `"AI Travel Planner" <${process.env.EMAIL_USER}>`,
//     to: userEmail,
//     subject: 'Verify your AI Travel Planner Account',
//     html: `
//       <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
//         <h2>Welcome to AI Travel Planner! ✈️</h2>
//         <p>Your verification code is:</p>
//         <h1 style="color: #2563eb; letter-spacing: 5px;">${otpCode}</h1>
//         <p>This code will expire in 10 minutes.</p>
//       </div>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('✅ OTP Email sent successfully to:', userEmail);
//   } catch (error) {
//     console.error('❌ Error sending email:', error);
//     throw error;
//   }
// };

// We can temporarily comment out nodemailer for the free-tier deployment
// import nodemailer from 'nodemailer'; 

export const sendOTP = async (userEmail, otpCode) => {
  // 1. Simulate a short network delay so the frontend loading spinner shows
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 2. Print the OTP beautifully to the Render server logs
  console.log(`\n========================================`);
  console.log(`🚀 DEV INBOX: EMAIL INTERCEPTED`);
  console.log(`To: ${userEmail}`);
  console.log(`Subject: Verify your AI Travel Planner Account`);
  console.log(`OTP CODE: --->  ${otpCode}  <---`);
  console.log(`========================================\n`);

  // 3. Force a successful response back to the register route
  return Promise.resolve();
};