import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/UsersPage.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    branch: '',
    first_name: '',
    last_name: '',
    is_superuser: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/list');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.name === 'is_superuser' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/user/create', formData);
      fetchUsers();
      setFormData({
        username: '',
        password: '',
        branch: '',
        first_name: '',
        last_name: '',
        is_superuser: false,
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="users-page">
      <h1>Users</h1>
      <form className="user-form" onSubmit={handleCreate}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="branch"
          placeholder="Branch ID"
          value={formData.branch}
          onChange={handleChange}
          required
        />
        <label>
          Admin User:
          <input
            type="checkbox"
            name="is_superuser"
            checked={formData.is_superuser}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add User</button>
      </form>
      <ul className="users-list">
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.is_superuser ? 'Admin' : 'Employee'})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
