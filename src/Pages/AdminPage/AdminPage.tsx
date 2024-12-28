import React, { useState, useEffect } from 'react';
import './AdminPage.css'; 

interface User {
  id: string;
  username: string;
  email: string;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users'); 
      const data: User[] = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    };
    fetchUsers();
  }, []);

  const sortUsers = (order: 'asc' | 'desc') => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a.username.toLowerCase() < b.username.toLowerCase()) return order === 'asc' ? -1 : 1;
      if (a.username.toLowerCase() > b.username.toLowerCase()) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredUsers(sortedUsers);
    setSortOrder(order);
  };

  
  const searchUsers = (query: string) => {
    setSearchQuery(query);
    const result = users.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(result);
  };


  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    }
  };

  return (
    <div className="manage-users-admin">
      <h1>Manage Users</h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by username"
          value={searchQuery}
          onChange={(e) => searchUsers(e.target.value)}
        />
        <button onClick={() => sortUsers(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>UserId</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
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
