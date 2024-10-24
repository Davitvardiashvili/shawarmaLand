// Footer.jsx
import React from 'react';
import './css/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Footer content */}
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} YourCompany. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
