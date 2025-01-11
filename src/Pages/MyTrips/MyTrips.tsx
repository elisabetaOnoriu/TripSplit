import React from "react";
import "./MyTrips.css";
import { useAppSelector } from "../../features/store";
import { Trip } from "../../features/api.types";
import { useTripHistoryQuery } from "../../features/api";
import { useNavigate } from "react-router-dom";

const MyTrips = () => {
  const userId = useAppSelector(state => state.auth.userId);
  const { data: tripHistory } = useTripHistoryQuery({ userId: userId! });

  // If tripHistory is undefined, treat it as an empty array
  const pastTrips: Trip[] = tripHistory || [];
  const navigate = useNavigate();

  const getCurrentTrip = (trips: Trip[]): Trip | null => {
    const today = new Date();
    return (
      trips.find(trip => {
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);
        return today >= startDate && today <= endDate;
      }) || null
    );
  };

  const currentTrip = getCurrentTrip(pastTrips);

  // Helper function to extract just the YYYY-MM-DD part
  // from an ISO string like "2025-01-11T14:00:00Z"
  const formatDate = (dateString: string) => {
    // 1) If your date is guaranteed to be an ISO string
    //    "2025-01-11T14:00:00Z", you can do:
    // return dateString.split("T")[0];

    // 2) Or parse as Date and use toLocaleDateString
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-CA"); 
    // "en-CA" typically gives "YYYY-MM-DD" format.
  };

  return (
    <div className="my-trips-container">
      <h1 className="my-trips-title">My Trips</h1>
      <div className="past-trips">
        {pastTrips.length > 0 ? (
          pastTrips.map((trip, index) => {
            // Format the start/end dates
            const formattedStartDate = formatDate(trip.startDate);
            const formattedEndDate = formatDate(trip.endDate);

            return (
              <div className="trip-item" key={index}>
                <div className="trip-info">
                  {/* Show DESTINATION as heading */}
                  <h3>{trip.destination}</h3>
                  
                  {/* Show DESCRIPTION instead of name */}
                  <p>{trip.description}</p>
                  
                  <p>
                    Period: {formattedStartDate} - {formattedEndDate}
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
                  onClick={() => navigate("/TripPage")}
                >
                  ➔
                </div>
              </div>
            );
          })
        ) : (
          <p>No past trips available.</p>
        )}
      </div>

      <button className="add-trip-button" onClick={() => navigate("/CreateTrip")}>
        Add Trip
      </button>
    </div>
  );
};

export default MyTrips;
