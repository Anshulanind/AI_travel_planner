import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import './RegisterPage.css';

const RegisterPage = () => {
  // Step 1: Capture the Input
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // New state variables for handling the UI during the API call
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate(); // Initialize the navigation hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    // Step 2: Stop the Page Reload
    e.preventDefault(); 
    
    setIsLoading(true);
    setErrorMsg(''); // Clear any previous errors

    try {
      // Step 3 & 4: Make the API Call & Send the Data
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send state variables as JSON string
      });

      const data = await response.json();

      // Step 5: Handle the Result
      if (response.ok) {
        // If backend replies with success, redirect to dashboard
        navigate('/dashboard'); 
      } else {
        // If backend replies with an error (e.g., "Email already in use")
        setErrorMsg(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      // Catch network errors (e.g., if the backend server isn't running)
      setErrorMsg('Cannot connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Create an Account</h2>
        <p className="auth-subtitle">Start planning your intern weekend getaways today.</p>
        
        {/* Step 5: Display error message on the screen if it exists */}
        {errorMsg && <div className="auth-error" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Log in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;