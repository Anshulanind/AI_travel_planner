import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage.jsx';
import RegisterPage from './pages/register/RegisterPage.jsx';
import LoginPage from './pages/login/login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx'; // 1. Make sure this is imported
import CreateTrip from './pages/CreateTrip/CreateTrip.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* 2. Add this route */}
        <Route path="/create-trip" element={<CreateTrip />} /> {/* 3. Add this route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;