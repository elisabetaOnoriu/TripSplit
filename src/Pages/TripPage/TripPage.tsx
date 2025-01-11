import React, { useState, useEffect } from 'react';
import './TripPage.css';
import { useAppSelector } from '../../features/store';
import { Trip as TripType } from '../../features/api.types';
import { useParams } from 'react-router-dom';
import { useGetTripDetailsQuery } from '../../features/api'; // Adjust import name/path if needed

type Expense = {
  id: string;
  name: string;
  amount: number;
  description: string;
  date: string;
  contributors: string[];
};

// Example type for participants, assuming your backend sends these fields
type Participant = {
  userId: string;
  firstName: string;
  lastName: string;
};

const TripPage = () => {
  // Get tripId from URL: /TripPage/:tripId
  const { tripId } = useParams<{ tripId: string }>();

  // Fetch trip data from backend
  const {
    data: tripData,
    isLoading,
    isError,
  } = useGetTripDetailsQuery(Number(tripId));

  // Local states mirroring your original code structure
  const [trip, setTrip] = useState<TripType | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Form state for creating a new expense
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    description: '',
    date: '',
    contributors: [''],
  });

  useEffect(() => {
    if (tripData) {
      // 1) Map the main trip details
      const loadedTrip: TripType = {
        id: String(tripData.id), // if your backend uses numeric IDs
        name: tripData.name,
        destination: tripData.destination,
        description: tripData.description,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
      };
      setTrip(loadedTrip);

      // 2) If tripData includes an `expenses` array, populate local state
      if ((tripData as any).expenses) {
        setExpenses((tripData as any).expenses);
      }

      // 3) If tripData includes `participants`
      //    e.g. participants: [{ userId, firstName, lastName }, ...]
      if ((tripData as any).participants) {
        setParticipants((tripData as any).participants);
      }
    }
  }, [tripData]);

  // Keep your original logic for adding a local expense
  const handleAddExpense = () => {
    const newExp: Expense = {
      ...newExpense,
      id: (expenses.length + 1).toString(),
      amount: Number(newExpense.amount), // Convert amount to number
    };
    setExpenses([...expenses, newExp]);
    // Reset the form
    setNewExpense({
      name: '',
      amount: '',
      description: '',
      date: '',
      contributors: [''],
    });
  };

  const handleContributorChange = (index: number, value: string) => {
    const updatedContributors = [...newExpense.contributors];
    updatedContributors[index] = value;
    setNewExpense({ ...newExpense, contributors: updatedContributors });
  };

  const handleAddContributor = () => {
    setNewExpense({
      ...newExpense,
      contributors: [...newExpense.contributors, ''],
    });
  };

  // Handle loading / error states
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !tripData) {
    return <div>Failed to load trip data.</div>;
  }
  if (!trip) {
    // Safety check if data is not yet set
    return <div>Loading trip...</div>;
  }

  // Preserve original layout & design:
  return (
    <div className='trip-container'>
      <div className='section-container'>
        <h1 className="trip-destination">Trip to {trip.destination}</h1>
        <p><strong>Description:</strong> {trip.description || 'No description available'}</p>
        <p><strong>Start Date:</strong> {trip.startDate}</p>
        <p><strong>End Date:</strong> {trip.endDate}</p>
      </div>

      {/* New Box for Participants */}
      <div className="section-container">
        <h2>Participants</h2>
        {participants.length > 0 ? (
          <ul>
            {participants.map((p) => (
              <li key={p.userId}>
                {p.firstName} {p.lastName}
              </li>
            ))}
          </ul>
        ) : (
          <p>No participants found for this trip.</p>
        )}
      </div>

      <div className="section-container">
        <h2 className="expenses-title">Expenses</h2>
        <ul className='trip-expenses-list'>
          {expenses.map((expense) => (
            <li key={expense.id}>
              <strong>{expense.name}</strong> - ${expense.amount} ({expense.date})
              <p>{expense.description}</p>
              <p><strong>Contributors:</strong> {expense.contributors.join(', ')}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="section-container">
        <h2>Add Expense</h2>
        <form>
          <div className="inline-fields">
            <input
              type="text"
              placeholder="Expense Name"
              value={newExpense.name}
              onChange={e => setNewExpense({ ...newExpense, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
            />
          </div>

          <textarea
            className="description-expense"
            placeholder="Description"
            value={newExpense.description}
            onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
          />

          <input
            type="date"
            value={newExpense.date}
            onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
          />

          <div>
            <h4>Contributors</h4>
            {newExpense.contributors.map((email, index) => (
              <div key={index}>
                <input
                  type="email"
                  placeholder="Contributor Email"
                  value={email}
                  onChange={(e) => handleContributorChange(index, e.target.value)}
                />
              </div>
            ))}
            <div className="buttons-expenses">
              <button
                type="button"
                onClick={handleAddContributor}
                className="generate-button"
              >
                Add Another Contributor
              </button>
              <button
                type="button"
                onClick={handleAddExpense}
                className="generate-button"
              >
                Add Expense
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="section-container">
        <h2 className="report-text">Report</h2>
        <button className="generate-button">Generate Report</button>
      </div>
    </div>
  );
};

export default TripPage;
