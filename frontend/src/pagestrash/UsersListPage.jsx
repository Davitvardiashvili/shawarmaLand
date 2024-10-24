// src/components/UsersListPage.jsx
import React, { useState, useEffect } from 'react';
import './css/UsersListPage.css'; // Ensure this CSS file exists
import axiosInstance from '../axiosInstance/axiosInstance';
import { useNavigate } from 'react-router-dom';

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchMap, setBranchMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10); // Number of users per page
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, branches]);

  // Fetch all branches and create a mapping from ID to name
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
        const map = {};
        response.data.results.forEach((branch) => {
          map[branch.id] = branch.name;
        });
        setBranchMap(map);
      })
      .catch((error) => {
        console.error('Error fetching branches:', error);
        setError('Failed to load branches.');
      });
  };

  // Fetch users for the current page
  const fetchUsers = (page = 1) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    axiosInstance
      .get(`/users?page=${page}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data.results);
        const total = response.data.count;
        setTotalPages(Math.ceil(total / perPage));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setError('Failed to load users.');
        setLoading(false);
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on search term (username, first_name, last_name)
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    navigate('/users/create');
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="users-list-page">
      <h1 className="page-title">თანამშრომლები</h1>

      {/* Add User Button */}
      <div className="actions">
        <button className="add-button" onClick={handleAddUser}>
          დაამატე თანამშრომელი +
        </button>
      </div>

      {/* Search Filter */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by username, first name, or last name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Users Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>პროფილის სურათი</th>
                <th>მომხმარებლის სახელი</th>
                <th>სახელი</th>
                <th>გვარი</th>
                <th>ობიექტი</th>
                <th>კოდი</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="user-avatar"
                        />
                      ) : (
                        <div className="no-avatar">No Avatar</div>
                      )}
                    </td>
                    <td>{user.username}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.branch ? branchMap[user.branch] || 'N/A' : 'N/A'}</td>
                    <td>{user.code || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">თანამშრომელი არ მოიძებნა.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && !error && (
        <div className="pagination">
          <button
            className="page-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`page-button ${
                currentPage === index + 1 ? 'active' : ''
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="page-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersListPage;
