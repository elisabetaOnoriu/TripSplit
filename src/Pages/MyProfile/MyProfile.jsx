import React, { useState, useEffect } from 'react';
import './MyProfile.css';
import ProfileSecondary from './ProfileSecondary';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  const defaultUser = {
    name: 'John Doe',
    email: 'johndoe@yahoo.com',
    phoneNumber: '+40 770 000 000',
    profileImage: 'https://th.bing.com/th/id/OIP.XrbQe3k8hBLddv1dztlCRwAAAA?rs=1&pid=ImgDetMain',
    description: 'Default description.',
    instagram: 'https://instagram.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    lastDestination: 'Paris',
    lastTripDate: '01-12-2024',
    stats: {
      numberOfTrips: 5,
      totalSpent: 1200,
      favoriteDestination: 'Paris',
      averageSpending: 240,
    },
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/user', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
            setEditedUser(data);
          } else {
            console.error('Failed to fetch user');
            setUser(defaultUser);
            setEditedUser(defaultUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(defaultUser);
          setEditedUser(defaultUser);
        }
      } else {
        setUser(defaultUser);
        setEditedUser(defaultUser);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    console.log('User data saved:', editedUser);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-details-container">
        <img
          src={user.profileImage || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="profile-image"
        />
        <h1>Hello, {user.name}!</h1>
        <p>
          <strong>Name:</strong>{' '}
          {isEditing ? (
            <input name="name" className="editable-input" value={editedUser.name} onChange={handleInputChange} />
          ) : (
            user.name
          )}
        </p>
        <p>
          <strong>Email:</strong>{' '}
          {isEditing ? (
            <input name="email" className="editable-input" value={editedUser.email} onChange={handleInputChange} />
          ) : (
            user.email
          )}
        </p>
        <p>
          <strong>Phone Number:</strong>{' '}
          {isEditing ? (
            <input
              name="phoneNumber"
              className="editable-input"
              value={editedUser.phoneNumber}
              onChange={handleInputChange}
            />
          ) : (
            user.phoneNumber || 'Not provided'
          )}
        </p>
        <p>
          <strong>Instagram:</strong>{' '}
          {isEditing ? (
            <input
              name="instagram"
              className="editable-input"
              value={editedUser.instagram}
              onChange={handleInputChange}
            />
          ) : (
            <a href={user.instagram || '#'} target="_blank" rel="noopener noreferrer">
              {user.instagram || 'Not linked'}
            </a>
          )}
        </p>
        <p>
          <strong>LinkedIn:</strong>{' '}
          {isEditing ? (
            <input
              name="linkedin"
              className="editable-input"
              value={editedUser.linkedin}
              onChange={handleInputChange}
            />
          ) : (
            <a href={user.linkedin || '#'} target="_blank" rel="noopener noreferrer">
              {user.linkedin || 'Not linked'}
            </a>
          )}
        </p>
        <div className="divider"></div>
        <p>
      <strong>Last Destination:</strong> {user.lastDestination || 'Unknown'}
        </p>
        <p>
          <strong>Last Trip Date:</strong> {user.lastTripDate || 'Unknown'}
        </p>
        <button onClick={() => setIsEditing(!isEditing)} className="edit-profile-btn">
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
        {isEditing && (
          <button onClick={handleSave} className="save-profile-btn">
            Save Changes
          </button>
        )}
      </div>
      <ProfileSecondary stats={user.stats} />
    </div>
  );
};

export default MyProfile;
