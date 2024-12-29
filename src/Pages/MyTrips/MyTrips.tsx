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
      <h1 className="my-trips-title">My Trips</h1>
      <div className="past-trips">
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

      <button className="add-trip-button" onClick={() => navigate('/CreateTrip')}>
        Add Trip
      </button>
    </div>
  );
};

export default MyTrips;
