import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const LoginPage = () => {
  // Capture Input
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    // Stop page reload
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Make API call and send data
      const response = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      // Handle the result
      if (response.ok) {
        // Store the authentication token (usually a JWT) in localStorage
        if (data.token) {
          // FIXED: Changed 'authToken' to 'token' to match Dashboard and API interceptor
          localStorage.setItem('token', data.token);
        }
        navigate('/dashboard');
      } else {
        // Display error (e.g., "Invalid credentials")
        setErrorMsg(data.message || 'Invalid email or password.');
      }
    } catch (error) {
      setErrorMsg('Cannot connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Log in to access your saved itineraries and intern trips.</p>
        
        {/* Error Display */}
        {errorMsg && <div className="auth-error" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={credentials.email} onChange={handleChange} placeholder="jane@example.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={credentials.password} onChange={handleChange} placeholder="••••••••" required />
          </div>

          <div className="forgot-password-container">
            <a href="#reset" className="forgot-password-link">Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary auth-btn" disabled={isLoading}>
             {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;