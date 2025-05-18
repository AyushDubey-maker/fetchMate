import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import './styles/Footer.css';
import logo from '../assets/fetchmate-logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src={logo} alt="FetchMate Logo" className="footer-logo" />
        </div>
        <p className="credit">🐾 Made with love for dogs by Ayush.</p>
        <div className="footer-right">
          <div className="socials">
            <FaGithub className="icon" />
            <FaLinkedin className="icon" />
            <FaTwitter className="icon" />
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
