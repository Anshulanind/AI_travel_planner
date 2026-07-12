import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  // Track which screen the user is on (1 = Register Form, 2 = OTP Form)
  const [step, setStep] = useState(1);

  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState(''); // New state just for the OTP code

  // UI State
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle normal input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // --- STEP 1: Handle Initial Registration ---
  const handleRegisterSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setErrorMsg(''); 

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });

      const data = await response.json();

      if (response.ok) {
        // Success! The backend sent the email. Switch to the OTP screen.
        setStep(2); 
      } else {
        setErrorMsg(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorMsg('Cannot connect to the server. Is your Node backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  // --- STEP 2: Handle OTP Verification ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We must send the email AND the otp so the backend knows who is verifying
        body: JSON.stringify({ email: formData.email, otp: otp }), 
      });

      const data = await response.json();

      if (response.ok) {
        // Verification complete! Send them to the dashboard to plan their trip.
        navigate('/dashboard'); 
      } else {
        setErrorMsg(data.message || 'Invalid or expired OTP.');
      }
    } catch (error) {
      setErrorMsg('Cannot connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        
        {/* Conditional Header based on the current step */}
        <h2 className="auth-title">
          {step === 1 ? 'Create an Account' : 'Check Your Email'}
        </h2>
        <p className="auth-subtitle">
          {step === 1 
            ? 'Start planning your intern weekend getaways today.' 
            : `We sent a 6-digit code to ${formData.email}. It expires in 10 minutes.`}
        </p>
        
        {errorMsg && (
          <div className="auth-error" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
            {errorMsg}
          </div>
        )}

        {/* --- RENDER STEP 1: REGISTRATION FORM --- */}
        {step === 1 && (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Jane Doe" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
            </div>

            <button type="submit" className="btn-primary auth-btn" disabled={isLoading}>
              {isLoading ? 'Sending Code...' : 'Register'}
            </button>
          </form>
        )}

        {/* --- RENDER STEP 2: OTP VERIFICATION FORM --- */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <input 
                type="text" 
                id="otp" 
                name="otp" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder="123456" 
                maxLength="6"
                required 
                style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '4px' }}
              />
            </div>

            <button type="submit" className="btn-primary auth-btn" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify & Enter'}
            </button>
            
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Back to Registration
            </button>
          </form>
        )}

        {step === 1 && (
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Log in here</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;