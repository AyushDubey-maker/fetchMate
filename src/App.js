import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import { useAuth } from './context/AuthContext';
import './App.css'
function App() {
  const { isLoggedIn, isCheckingAuth } = useAuth();

 if (isCheckingAuth) return <div className="loading-screen">Loading...🐶</div>;


  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

export default App;
