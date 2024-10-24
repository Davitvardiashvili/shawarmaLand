// src/components/UserList.jsx
import React from 'react';
import UserItem from './UserItem';

const UserList = ({ users, handleEdit, handleDelete }) => {
  return (
    <div className="table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Username</th>
            <th>Branch</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserItem key={user.id} user={user} handleEdit={handleEdit} handleDelete={handleDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
