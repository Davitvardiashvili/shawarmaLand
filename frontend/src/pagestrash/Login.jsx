import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';
import './css/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.username, formData.password);
    if (success) {
      // Fetch user data if needed
      const response = await axios.get('http://localhost:8000/api/user/me');
      setUser(response.data);
      navigate('/');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="loginBody">
      <div className="login-container">
        <h1 className="login-title">Employee Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              required
              autoComplete="off"
              value={formData.username}
              onChange={handleChange}
            />
            <label>Username</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              required
              autoComplete="off"
              value={formData.password}
              onChange={handleChange}
            />
            <label>Password</label>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
