import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/Header.css';
import logo from '../assets/fetchmate-logo.png';

const Header = ({ favoriteCount = 0 }) => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    const user = localStorage.getItem('userEmail');
    if (user) {
      localStorage.removeItem(`favorites_${user}`);
      localStorage.removeItem('userEmail');
    }
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <img src={logo} alt="FetchMate Logo" className="logo" />

        <div
          className={`nav-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </div>

        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          {isLoggedIn ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                onClick={closeMenu}
              >
                Home
              </NavLink>

              <NavLink
                to="/my-favorites"
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                onClick={closeMenu}
              >
                My Favorites
                {favoriteCount > 0 && (
                  <span className="badge">{favoriteCount}</span>
                )}
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                onClick={closeMenu}
              >
                About
              </NavLink>

              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                onClick={closeMenu}
              >
                Login
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                onClick={closeMenu}
              >
                About
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
