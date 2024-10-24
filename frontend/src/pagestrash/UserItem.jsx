// src/components/UserItem.jsx
import React from 'react';

const UserItem = ({ user, handleEdit, handleDelete }) => {
  return (
    <tr>
      <td>
        {user.avatar ? (
          <img src={user.avatar} alt={user.username} className="user-avatar" />
        ) : (
          <div className="no-avatar">No Avatar</div>
        )}
      </td>
      <td>{user.username}</td>
      <td>{user.branch ? user.branch : 'N/A'}</td>
      <td>{user.first_name}</td>
      <td>{user.last_name}</td>
      <td>{user.code || 'N/A'}</td>
      <td>
        <button className="edit-button" onClick={() => handleEdit(user)}>
          Edit
        </button>
        <button className="delete-button" onClick={() => handleDelete(user)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default UserItem;
