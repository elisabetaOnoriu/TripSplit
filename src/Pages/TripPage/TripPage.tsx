import React from 'react';
import './TripPage.css';
// import { useTripQuery } from '../../features/api';
import { useAppSelector } from '../../features/store';
import { Trip as TripType } from '../../features/api.types';

const TripPage = () => {
  const trip: TripType = {
    id: '1',
    name: 'Hawaii Adventure',
    destination: 'Hawaii',
    description: 'A wonderful tropical adventure!',
    startDate: '2024-01-15',
    endDate: '2024-01-22',
  };

  const users = [
    { id: '1', firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com' },
    { id: '2', firstName: 'Bob', lastName: 'Smith', email: 'bob.smith@example.com' },
  ];

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <div className='trip-container'>
      <div className='section-container'>
        <h1>Trip to {trip.destination}</h1>
        <p><strong>Description:</strong> {trip.description || 'No description available'}</p>
        <p><strong>Start Date:</strong> {trip.startDate}</p>
        <p><strong>End Date:</strong> {trip.endDate}</p>
      </div>

      <div className='section-container'>
        <h2>Users in Trip</h2>
        <ul className='trip-users-list'>
          {users.map(user => (
            <li key={user.id}>
              {user.firstName} {user.lastName} ({user.email})
            </li>
          ))}
        </ul>
      </div>

      <div className="section-container"> 
        <h2>Report</h2>
            <button className="generate-button">Generate Report</button>
      </div>
    </div>
  );
};

export default TripPage;