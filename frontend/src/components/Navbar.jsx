// Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/navbar.css';
import { useAuth } from '../context/AuthProvider';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Get is_admin from localStorage
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    // If not authenticated, don't render the navbar
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side: Orders Link */}
        <div className="navbar-left">
          <Link to="/orders" className="navbar-links add-order">
             შეკვეთის დამატება +
          </Link>
        </div>

        {/* Center: Logo */}
        <div className="navbar-center">
          <Link to="/admin" className="navbar-logo">
            <img src="https://scontent.ftbs5-2.fna.fbcdn.net/v/t39.30808-6/260570660_1236871723499943_8888040991035723893_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=w3U8K-3YOt4Q7kNvgHwJ10y&_nc_zt=23&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=A__7bgYZ674SWrl1L64l-le&oh=00_AYCfwtdfwmkinXNAN25BEpSrR0RwOVWsX9PUN9DZd7-RgQ&oe=671DC5A4" alt="Logo" className="navbar-logo-img" />
          </Link>
        </div>

        {/* Right Side: Other Links and Logout */}
        <div className="navbar-right">
          {isAdmin && (
            <>
              <Link to="/branches" className="navbar-links">
                ობიექტები
              </Link>
              <Link to="/users" className="navbar-links">
                პერსონალი
              </Link>
              <Link to="/categories" className="navbar-links">
                კატეგორიები
              </Link>
              <Link to="/products" className="navbar-links">
                პროდუქტები
              </Link>
            </>
          )}
          <button onClick={handleLogout} className="navbar-links navbar-links-button logout-button">
            გასვლა
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
