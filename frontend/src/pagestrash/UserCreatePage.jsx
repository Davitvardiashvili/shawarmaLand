// src/components/UserCreatePage.jsx
import React, { useState, useEffect } from 'react';
import './css/UserCreatePage.css'; // Ensure this CSS file exists
import axiosInstance from '../axiosInstance/axiosInstance';
import { useNavigate } from 'react-router-dom'; // Updated import

const UserCreatePage = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    branch: '',
    first_name: '',
    last_name: '',
    password: '',
    avatar: null,
    code: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Updated hook

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = () => {
    const token = localStorage.getItem('token');
    axiosInstance
      .get('/branches', {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setBranches(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching branches:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('username', formData.username);
    form.append('branch', formData.branch);
    form.append('first_name', formData.first_name);
    form.append('last_name', formData.last_name);
    form.append('password', formData.password);
    if (formData.avatar) {
      form.append('avatar', formData.avatar);
    }
    if (formData.code) {
      form.append('code', formData.code);
    }

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post('/user/create', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });
      // Redirect back to users list after successful creation
      navigate('/users'); // Updated navigation
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user. Please check the form and try again.');
    }
  };

  const handleCancel = () => {
    navigate('/users'); // Updated navigation
  };

  return (
    <div className="user-create-page">
      <h1 className="page-title">ახალი თანამშრომელი</h1>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* User Creation Form */}
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username">მომხმარებელი<span className="required">*</span></label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="branch">ობიექტი<span className="required">*</span></label>
            <select
              name="branch"
              id="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">აირჩიე ობიექტი</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="first_name">სახელი<span className="required">*</span></label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              placeholder="Enter first name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">გვარი<span className="required">*</span></label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              placeholder="Enter last name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">პაროლი<span className="required">*</span></label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar">პროფილის სურათი</label>
            <input
              type="file"
              name="avatar"
              id="avatar"
              onChange={handleAvatarChange}
              className="input-file"
              accept="image/*"
            />
          </div>

        </div>

        {/* Form Buttons */}
        <div className="form-buttons">
          <button type="submit" className="submit-button">
            შექმნა
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            გაუქმება
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreatePage;
