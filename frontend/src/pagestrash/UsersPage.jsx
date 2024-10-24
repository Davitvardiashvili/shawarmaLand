// src/components/UsersPage.jsx
import React, { useState, useEffect } from 'react';
import './css/UsersPage.css'; // Create this CSS file based on branches.css
import axiosInstance from '../axiosInstance/axiosInstance';
import Modal from 'react-modal';
import UserForm from './UserForm';
import UserList from './UserList';

// Set the app element for accessibility
Modal.setAppElement('#root');

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    branch: '',
    first_name: '',
    last_name: '',
    password: '',
    avatar: null,
    code: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    axiosInstance
      .get('/users', {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
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
      if (editMode) {
        // Update user
        await axiosInstance.put(`/users/${editUserId}`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
          },
        });
        setEditMode(false);
        setEditUserId(null);
      } else {
        // Create new user
        await axiosInstance.post('/user/create', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
          },
        });
      }
      setFormData({
        username: '',
        branch: '',
        first_name: '',
        last_name: '',
        password: '',
        avatar: null,
        code: '',
      });
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      branch: user.branch,
      first_name: user.first_name,
      last_name: user.last_name,
      password: '', // Password cannot be pre-filled for security
      avatar: null, // Can't pre-fill the file input
      code: user.code || '',
    });
    setEditMode(true);
    setEditUserId(user.id);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const token = localStorage.getItem('token');
        await axiosInstance.delete(`/users/${userToDelete.id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        fetchUsers(); // Refresh the users list after deletion
        setIsModalOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditUserId(null);
    setFormData({
      username: '',
      branch: '',
      first_name: '',
      last_name: '',
      password: '',
      avatar: null,
      code: '',
    });
  };


  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetchBranches();
    fetchUsers();
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

  return (
    <div className="users-page">
      <h1 className="page-title">Users Management</h1>

      {/* User Form */}
      <UserForm
        formData={formData}
        handleChange={handleChange}
        handleAvatarChange={handleAvatarChange}
        handleSubmit={handleSubmit}
        editMode={editMode}
        handleCancelEdit={handleCancelEdit}
        branches={branches} // Pass branches as a prop
      />

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelDelete}
        contentLabel="Confirm Deletion"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Are you sure you want to delete this user?</h2>
        <p>User: {userToDelete && userToDelete.username}</p>
        <div className="modal-buttons">
          <button onClick={confirmDelete} className="confirm-button">
            Yes, delete
          </button>
          <button onClick={cancelDelete} className="cancel-button">
            Cancel
          </button>
        </div>
      </Modal>

      {/* Users Table */}
      <UserList users={users} handleEdit={handleEdit} handleDelete={handleDelete} />
    </div>
  );
};

export default UsersPage;
