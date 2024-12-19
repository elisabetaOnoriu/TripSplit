import React from "react";
import "./MyTrips.css";

// Define interfaces for trip data
interface Trip {
  destination: string;
  caption: string;
  startDate: string;
  endDate: string;
  cost: string;
}

const MyTrips: React.FC = () => {
  // Mockup data
  const currentTrip: Trip = {
    destination: "Bali",
    caption: "A relaxing tropical vacation.",
    startDate: "2024-12-18",
    endDate: "2024-12-25",
    cost: "$1000",
  };

  const pastTrips: Trip[] = [
    {
      destination: "London",
      caption: "Exploring the heart of England.",
      startDate: "2023-05-10",
      endDate: "2023-05-15",
      cost: "$500",
    },
    {
      destination: "Paris",
      caption: "A romantic getaway.",
      startDate: "2022-11-01",
      endDate: "2022-11-08",
      cost: "$800",
    },
    {
      destination: "Dubai",
      caption: "Adventures in the desert.",
      startDate: "2022-06-15",
      endDate: "2022-06-20",
      cost: "$1200",
    },
  ];

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
      </div>

      {/* Past Trips Section */}
      <div className="past-trips">
        <h2>Past Trips</h2>
        {pastTrips.length > 0 ? (
          pastTrips.map((trip, index) => (
            <div className="trip-item" key={index}>
              <div className="trip-info">
                <h3>{trip.destination}</h3>
                <p>{trip.caption}</p>
                <p>
                  Period: {trip.startDate} - {trip.endDate}
                </p>
              </div>
              <div className="trip-cost">{trip.cost}</div>
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