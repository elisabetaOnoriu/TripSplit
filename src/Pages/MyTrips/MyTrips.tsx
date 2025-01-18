import React from 'react';
import './MyTrips.css';
import { useAppSelector } from '../../features/store';
import { useNavigate } from 'react-router-dom';
import { useTripHistoryQuery } from '../../features/api'; 
import { Trip } from '../../features/api.types';

const MyTrips = () => {
  const userId = useAppSelector((state) => state.auth.userId);
  const { data: tripHistory, isLoading, isError } = useTripHistoryQuery({
    userId: userId!,
  });

  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading your trips...</div>;
  }
  if (isError || !tripHistory) {
    return <div>Failed to load trips.</div>;
  }


  return (
    <div className="my-trips-container">
      <h1 className="my-trips-title">My Trips</h1>
      <div className="past-trips">
        {tripHistory.length > 0 ? (
          tripHistory.map((trip: Trip, index: number) => (
            <div className="trip-item" key={index}>
              <div className="trip-info">
                <h3>{trip.destination}</h3>
                <p>{trip.description}</p>
                <p>
                  Period: {trip.startDate} - {trip.endDate}
                </p>
              </div>

              <div className="trip-actions">
                <button
                  className="inviting_friend"
                  onClick={() => navigate(`/invite/${trip.id}`)}
                >
                  Invite a Friend
                </button>
              </div>

              <div
                className="see-more-arrow"
                onClick={() => navigate(`/TripPage/${trip.id}`)}
              >
                ➔
              </div>
            </div>
          ))
        ) : (
          <p>No trips available.</p>
        )}
      </div>

      <button
        className="add-trip-button"
        onClick={() => navigate('/CreateTrip')}
      >
        Add Trip
      </button>
    </div>
  );
};

export default MyTrips;
  