import React, { useState, useEffect, useMemo } from 'react';
import { useAppSelector } from '../../features/store';
import { useDeleteUserMutation, useGetAllUsersQuery, useIsUserAdminQuery } from '../../features/api';
import './AdminPage.css'; 
import { User } from '../../features/api.types';

// interface User {
//   id: string;
//   username: string;
//   email: string;
// }

const AdminPage: React.FC = () => {
  const { data: userQuery } = useGetAllUsersQuery();
  const [deleteUserMutation] = useDeleteUserMutation();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 
  const [searchQuery, setSearchQuery] = useState(''); 

  const userId = useAppSelector(state => state.auth.userId);
  
  const users: User[] = useMemo(() => {
    return userQuery?.users.filter(user => user.id !== userId) || [];
  }, [userQuery?.users, userId]);

  useEffect(() => {
    if (users.length > 0) {
      setFilteredUsers(users);
    }
  }, [users]);

  const sortUsers = (order: 'asc' | 'desc') => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return order === 'asc' ? -1 : 1;
      if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredUsers(sortedUsers);
    setSortOrder(order);
  };

 
  const searchUsers = (query: string) => {
    setSearchQuery(query);
    const result = users.filter(user =>
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(result);
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUserMutation({ userId });
      const updatedUsers = users.filter(user => user.id !== userId);
      setFilteredUsers(updatedUsers);
    }
  };

  return (
    <div className="manage-users-admin">
      <h1 className="titlemanage">Manage Users</h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by email"
          value={searchQuery}
          onChange={(e) => searchUsers(e.target.value)}
        />
        <button onClick={() => sortUsers(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
        </button>
      </div>
      <table>
        <thead className="antet">
          <tr>
            <th>FirstName</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default AdminPage;
