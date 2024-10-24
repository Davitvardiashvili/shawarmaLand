import React, { useState, useEffect } from 'react';
import './css/BranchesPage.css';
import axiosInstance from '../axiosInstance/axiosInstance';

const CategoriesPage = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ name: '', address: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axiosInstance.get(`/branches`, {
        headers: {
            Authorization: `${token}`
        }
    })
        .then((response) => {
           setBranches(response.data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/branches', formData);
      fetchBranches();
      setFormData({ name: '', address: '' });
    } catch (error) {
      console.error('Error creating branch:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/branches/${id}`);
      fetchBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };

  return (
    <div className="branches-page">
      <h1>Branches</h1>
      <form className="branch-form" onSubmit={handleCreate}>
        <input
          type="text"
          name="name"
          placeholder="Branch Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Branch Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Branch</button>
      </form>
      <ul className="branches-list">
        {branches.map((branch) => (
          <li key={branch.id}>
            {branch.name} - {branch.address}
            <button onClick={() => handleDelete(branch.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
