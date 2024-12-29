import React from "react";
import "./MyTrips.css";
import { useAppSelector } from "../../features/store";
import { Trip } from "../../features/api.types";
import { useTripHistoryQuery } from "../../features/api";
import { useNavigate } from 'react-router-dom';

const MyTrips = () => {
  const userId = useAppSelector(state => state.auth.userId);
  const { data: tripHistory } = useTripHistoryQuery({ userId: userId! });

  const pastTrips: Trip[] = tripHistory || [];
  const navigate = useNavigate();

  const getCurrentTrip = (trips: Trip[]): Trip | null => {
    const today = new Date();
    return trips.find(trip => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      return today >= startDate && today <= endDate;
    }) || null;
  };

  const currentTrip = getCurrentTrip(pastTrips);

  return (
    <div className="my-trips-container">
      <h1 className="my-trips-title">List of Trips</h1>

      {/* Current Trip Section */}
      <div className="current-trip">
        <h2>Current Trip</h2>
        {currentTrip ? (
          <div className="trip-item">
            <div className="trip-info">
              <h3>{currentTrip.destination}</h3>
              <p>{currentTrip.description}</p>
              <p>
                Period: {currentTrip.startDate} - {currentTrip.endDate}
              </p>
            </div>
            <div className="trip-cost">{1000}</div>
            <div className="trip-actions">
              <button onClick={() => navigate(`/invite/${currentTrip.id}`)}>
                Invite a Friend
              </button>
            </div>
            <div
              className="see-more-arrow"
              onClick={() => navigate('/Trip')}
            >
              ➔
            </div>
          </div>
        ) : (
          <p>No current trip available.</p>
        )}
      </div>

      {/* Past Trips Section */}
      <div className="past-trips">
        <h2>Past Trips</h2>
        {pastTrips.length > 0 ? (
          pastTrips.map((trip, index) => (
            <div className="trip-item" key={index}>
              <div className="trip-info">
                <h3>{trip.destination}</h3>
                <p>{trip.name}</p>
                <p>
                  Period: {trip.startDate} - {trip.endDate}
                </p>
              </div>
              <div className="trip-cost">{1000}</div>
              <div className="trip-actions">
                <button onClick={() => navigate(`/invite/${trip.id}`)}>
                  Invite a Friend
                </button>
              </div>
              <div
                className="see-more-arrow"
                onClick={() => navigate('/Trip')}
              >
                ➔
              </div>
            </div>
          ))
        ) : (
          <p>No past trips available.</p>
        )}
      </div>

      {/* Add Trip Button */}
      <button className="add-trip-button">Add Trip</button>
    </div>
  );
};

export default MyTrips;
