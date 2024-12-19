import React, { useState, useEffect } from 'react';
import './TripHistory.css';

const TripHistory = ({ user }) => {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [pastTrips, setPastTrips] = useState([]);
  const [newExpense, setNewExpense] = useState({
    item: '',
    amount: '',
    splitType: 'equally',
  });

  useEffect(() => {
    // Fetch current and past trips from the backend
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/trips/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setCurrentTrip(data.currentTrip);
        setPastTrips(data.pastTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, []);

  const handleAddExpense = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/trips/${currentTrip.id}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newExpense),
      });
      if (response.ok) {
        alert('Expense added successfully!');
        setNewExpense({ item: '', amount: '', splitType: 'equally' });
      } else {
        alert('Error adding expense.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="tripHistory">
      {/* Current Trip Container */}
      {currentTrip && (
        <div className="currentTrip">
          <h2>Current Trip: {currentTrip.name}</h2>
          <p>Destination: {currentTrip.destination}</p>
          <p>Description: {currentTrip.description}</p>

          <div className="addExpense">
            <h3>Add New Expense</h3>
            <input
              type="text"
              placeholder="Expense Item"
              value={newExpense.item}
              onChange={(e) => setNewExpense({ ...newExpense, item: e.target.value })}
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            />
            <select
              value={newExpense.splitType}
              onChange={(e) => setNewExpense({ ...newExpense, splitType: e.target.value })}
            >
              <option value="equally">Split Equally</option>
              <option value="unequally">Split Unequally</option>
              <option value="specific">Specific Members</option>
            </select>
            <button onClick={handleAddExpense}>Add Expense</button>
          </div>
        </div>
      )}

      {/* Past Trips Container */}
      <div className="pastTrips">
        <h2>Past Trips</h2>
        {pastTrips.length > 0 ? (
          pastTrips.map((trip) => (
            <div key={trip.id} className="pastTrip">
              <h3>{trip.name}</h3>
              <p>Destination: {trip.destination}</p>
              <p>Description: {trip.description}</p>
              <p>Start Date: {new Date(trip.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(trip.endDate).toLocaleDateString()}</p>
              <h4>Expenses:</h4>
              <ul>
                {trip.expenses.map((expense, index) => (
                  <li key={index}>
                    {expense.item} - {expense.amount}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No past trips available.</p>
        )}
      </div>
    </div>
  );
};

export default TripHistory;
