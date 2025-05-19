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
            <a href="https://github.com/AyushDubey-maker" className='a_footer_icon' target="_blank" rel="noopener noreferrer">
              <FaGithub className="icon" />
            </a>

            <a href="https://www.linkedin.com/in/ayush-dubey-b0b9b61b6/" className='a_footer_icon' target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="icon" />
            </a>

            <a href="https://x.com/FetchRewards" className='a_footer_icon' target="_blank" rel="noopener noreferrer">
              <FaTwitter className="icon" />
            </a>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
