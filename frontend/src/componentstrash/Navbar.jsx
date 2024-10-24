import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import './css/Navbar.css';

const Navbar = () => {
  const { authTokens, logout, user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          FastFoodApp
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-links">
              Home
            </Link>
          </li>
          {authTokens && (
            <>
              <li className="navbar-item">
                <Link to="/branches" className="navbar-links">
                  Branches
                </Link>
              </li>
              {user?.is_superuser && (
                <>
                  <li className="navbar-item">
                    <Link to="/users" className="navbar-links">
                      Users
                    </Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/categories" className="navbar-links">
                      Categories
                    </Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/products" className="navbar-links">
                      Products
                    </Link>
                  </li>
                </>
              )}
              <li className="navbar-item">
                <button onClick={logout} className="navbar-links navbar-logout">
                  Logout
                </button>
              </li>
            </>
          )}
          {!authTokens && (
            <li className="navbar-item">
              <Link to="/login" className="navbar-links navbar-login">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
