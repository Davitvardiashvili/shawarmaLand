import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (authTokens) {
      axios.defaults.headers.common['Authorization'] = `Token ${authTokens}`;
      // Fetch user data if needed
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authTokens]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/login', { username, password });
      setAuthTokens(response.data.token);
      localStorage.setItem('token', response.data.token);
      // Set user data if returned
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ authTokens, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
