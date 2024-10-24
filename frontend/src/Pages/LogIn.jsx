import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import "./css/login.css";

const LogIn = () => {
  const { login, isAuthenticated, setCredential } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  useEffect(() => {
    setCredential({ username: formData.username, password: formData.password });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin");
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login();
  };

  return (
    <div className="loginBody">



      <div className="login-container">
        <div className="logo-container">
          <img src="https://scontent.ftbs5-2.fna.fbcdn.net/v/t39.30808-6/260570660_1236871723499943_8888040991035723893_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=w3U8K-3YOt4Q7kNvgHwJ10y&_nc_zt=23&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=A__7bgYZ674SWrl1L64l-le&oh=00_AYCfwtdfwmkinXNAN25BEpSrR0RwOVWsX9PUN9DZd7-RgQ&oe=671DC5A4" alt="Logo" className="login-logo" />
        </div>
        <h1 className="login-title">შაურმალენდი</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              id="username"
              required
              autoComplete="off"
              value={formData.username}
              onChange={handleChange}
            />
            <label htmlFor="username">მომხმარებელი</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              id="password"
              required
              autoComplete="off"
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="password">პაროლი</label>
          </div>
          <button type="submit" className="login-button">შესვლა</button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
