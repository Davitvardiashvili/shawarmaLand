// src/components/UserForm.jsx
import React from 'react';

const UserForm = ({
    formData,
    handleChange,
    handleAvatarChange,
    handleSubmit,
    editMode,
    handleCancelEdit,
    branches,
}) => {
  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="username">Username</label>
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
          <label htmlFor="branch">Branch</label>
          <select
            name="branch"
            id="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
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
          <label htmlFor="last_name">Last Name</label>
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
        {!editMode && (
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required={!editMode}
              className="input-field"
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="avatar">Avatar</label>
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={handleAvatarChange}
            className="input-file"
            accept="image/*"
          />
        </div>
        <div className="form-group">
          <label htmlFor="code">User Code (Optional)</label>
          <input
            type="number"
            name="code"
            id="code"
            placeholder="Enter unique 4-digit code"
            value={formData.code}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button">
            {editMode ? 'Update User' : 'Create User'}
          </button>
        </div>
        {editMode && (
          <div className="form-group">
            <button type="button" className="cancel-button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default UserForm;
