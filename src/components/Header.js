import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/Header.css';
import logo from '../assets/fetchmate-logo.png';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <img src={logo} alt="FetchMate Logo" className="logo" />
        <nav>
          {isLoggedIn ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About</Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/about" className="nav-link">About</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
