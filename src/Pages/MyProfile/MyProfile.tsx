import React, { useState } from 'react';
import './MyProfile.css';
import ProfileSecondary from './ProfileSecondary';
import { useUpdateUserMutation, useUserQuery } from '../../features/api';
import { User } from '../../features/api.types';

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>();

  const { data: user } = useUserQuery({ userId: '6a475fec-a187-470f-9229-9cfad70e318b' });
  const [updateUser] = useUpdateUserMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prevUser => ({ ...prevUser!, [name]: value }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    const res = await updateUser(editedUser!);

    if ('error' in res) {
      console.log(res.error);
      return;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='profile-container'>
      <div className='profile-details-container'>
        <h1>Hello, {user.firstName}!</h1>
        <p>
          <strong>First Name:</strong>{' '}
          {isEditing ? (
            <input
              name='firstName'
              className='editable-input'
              value={editedUser!.firstName}
              onChange={handleInputChange}
            />
          ) : (
            user.firstName
          )}
        </p>
        <p>
          <strong>Last Name:</strong>{' '}
          {isEditing ? (
            <input
              name='lastName'
              className='editable-input'
              value={editedUser!.lastName}
              onChange={handleInputChange}
            />
          ) : (
            user.lastName
          )}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <div className='divider'></div>
        <p>
          <strong>Last Destination:</strong> {user.lastDestination || 'Unknown'}
        </p>
        <p>
          <strong>Last Trip Date:</strong> {user.lastTripDate || 'Unknown'}
        </p>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setEditedUser(user);
          }}
          className='edit-profile-btn'
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
        {isEditing && (
          <button onClick={handleSave} className='save-profile-btn'>
            Save Changes
          </button>
        )}
      </div>
      <ProfileSecondary stats={user.stats} />
    </div>
  );
};

export default MyProfile;
