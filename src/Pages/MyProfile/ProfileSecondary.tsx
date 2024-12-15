import React from 'react';
import './ProfileSecondary.css';

const ProfileSecondary = ({ user }) => {
  const defaultUser = {
    numberOfTrips: 0,
    amountSpent: 0,
    favoriteDestination: 'N/A',
  };

  const currentUser = user || defaultUser;

  return (
    <div className="profile-secondary-container">
      <h2>Personal Trips Overview</h2>
      <p><strong>Number of Trips:</strong> {currentUser.numberOfTrips}</p>
      <p><strong>Total Amount Spent:</strong> ${currentUser.amountSpent}</p>
      <p><strong>Favorite Destination:</strong> {currentUser.favoriteDestination}</p>
    </div>
  );
};

export default ProfileSecondary;