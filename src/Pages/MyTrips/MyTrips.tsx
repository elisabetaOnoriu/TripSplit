import React from "react";
import "./MyTrips.css";
import { useAppSelector } from "../../features/store";
import { Trip } from "../../features/api.types";
import { useTripHistoryQuery } from "../../features/api";


const MyTrips = () => {

  const userId = useAppSelector(state => state.auth.userId);
  const { data: tripHistory } = useTripHistoryQuery({ userId: userId! });

  const pastTrips: Trip[] = tripHistory || [];

  return (
    <div className="my-trips-container">
      <h1 className="my-trips-title">List of Trips</h1>

      {/* Current Trip Section */}
      {/* <div className="current-trip">
        <h2>Current Trip</h2>
        {currentTrip ? (
          <div className="trip-item">
            <div className="trip-info">
              <h3>{currentTrip.destination}</h3>
              <p>{currentTrip.caption}</p>
              <p>
                Period: {currentTrip.startDate} - {currentTrip.endDate}
              </p>
            </div>
            <div className="trip-cost">{currentTrip.cost}</div>
            <div
              className="see-more-arrow"
              onClick={() => alert("Redirecting to current trip page...")}
            >
              ➔
            </div>
          </div>
        ) : (
          <p>No current trip available.</p>
        )}
      </div> */}

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
              <div
                className="see-more-arrow"
                onClick={() =>
                  alert(`Redirecting to trip page for ${trip.destination}`)
                }
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