import React from 'react';
import { Link } from 'react-router-dom';
import './css/footer.css';
import { useAuth } from '../context/AuthProvider';

const Footer = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Do not render the footer if the user is not authenticated
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Simplified Footer Content */}
        <div className="footer-row">
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://www.facebook.com/">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
