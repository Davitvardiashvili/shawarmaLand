import React, { useState, useEffect } from 'react';
import './css/BranchesPage.css';
import axiosInstance from '../axiosInstance/axiosInstance';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root'); // Adjust '#root' if your app's root element has a different ID

const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ name: '', address: '', image: null });
  const [editMode, setEditMode] = useState(false);
  const [editBranchId, setEditBranchId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = () => {
    const token = localStorage.getItem('token');
    axiosInstance
      .get(`/branches`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setBranches(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('address', formData.address);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const token = localStorage.getItem('token');
      if (editMode) {
        // Update branch
        await axiosInstance.put(`/branches/${editBranchId}`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        });
        setEditMode(false);
        setEditBranchId(null);
      } else {
        // Create new branch
        await axiosInstance.post(`/branches`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        });
      }
      setFormData({ name: '', address: '', image: null });
      fetchBranches(); // Update the branches list
    } catch (error) {
      console.error('Error submitting branch:', error);
    }
  };

  const handleEdit = (branch) => {
    setFormData({
      name: branch.name,
      address: branch.address,
      image: null, // Can't pre-fill the file input
    });
    setEditMode(true);
    setEditBranchId(branch.id);
  };

  const handleDelete = (branch) => {
    setBranchToDelete(branch);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (branchToDelete) {
      try {
        const token = localStorage.getItem('token');
        await axiosInstance.delete(`/branches/${branchToDelete.id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        fetchBranches(); // Update the branches list after deletion
        setIsModalOpen(false);
        setBranchToDelete(null);
      } catch (error) {
        console.error('Error deleting branch:', error);
      }
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setBranchToDelete(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditBranchId(null);
    setFormData({ name: '', address: '', image: null });
  };

  return (
    <div className="branches-page">
      <h1 className="page-title">ობიექტები</h1>

      {/* Branch Form */}
      <form className="branch-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">ობიექტის სახელი</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="შეიყვანეთ ობიექტის სახელი"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">მისამართი</label>
            <input
              type="text"
              name="address"
              id="address"
              placeholder="შეიყვანეთ ობიექტის მისამართი"
              value={formData.address}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">ობიექტის სურათი</label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleImageChange}
              className="input-file"
              accept="image/*"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button">
              {editMode ? 'განახლება' : 'დამატება'}
            </button>
          </div>
          {editMode && (
            <div className="form-group">
              <button type="button" className="cancel-button" onClick={handleCancelEdit}>
                გაუქმება
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelDelete}
        contentLabel="Confirm Deletion"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>დარწმუნებული ხართ, რომ გსურთ წაშლა?</h2>
        <p>ობიექტი: {branchToDelete && branchToDelete.name}</p>
        <div className="modal-buttons">
          <button onClick={confirmDelete} className="confirm-button">
            დიახ, დარწმუნებული ვარ
          </button>
          <button onClick={cancelDelete} className="cancel-button">
            გაუქმება
          </button>
        </div>
      </Modal>

      {/* Branches Table */}
      <div className="table-container">
        <table className="branches-table">
          <thead>
            <tr>
              <th>სურათი</th>
              <th>სახელი</th>
              <th>მისამართი</th>
              <th>მოქმედება</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.id}>
                <td>
                  {branch.image ? (
                    <img src={branch.image} alt={branch.name} className="branch-image" />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </td>
                <td>{branch.name}</td>
                <td>{branch.address}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(branch)}>
                    რედაქტირება
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(branch)}>
                    წაშლა
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchesPage;
