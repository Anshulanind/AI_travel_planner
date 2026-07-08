import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your pages (ensure the file paths match your folder structure)
import HomePage from './pages/Home/HomePage';
import RegisterPage from './pages/register/RegisterPage';
import LoginPage from './pages/login/login';

function App() {
  return (
    <BrowserRouter>
      {/* The Routes component acts like a switchboard. 
        It looks at the URL in the browser and renders the matching component.
      */}
      <Routes>
        {/* When the URL is exactly "/", show the HomePage */}
        <Route path="/" element={<HomePage />} />
        
        {/* When the URL is "/register", show the RegisterPage */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* You can add your login page here later! */}
        { <Route path="/login" element={<LoginPage />} /> }
      </Routes>
    </BrowserRouter>
  );
}

export default App;