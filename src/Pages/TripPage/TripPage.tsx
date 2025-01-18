import React, { useState, useEffect } from 'react';
import './TripPage.css';
import { useAppSelector } from '../../features/store';
import { Trip as TripType } from '../../features/api.types';
import { useParams } from 'react-router-dom';
import { useGetExpensesByTripQuery, useGetTripDetailsQuery, useLazyGetUserByEmailQuery, useSplitExpensesMutation } from '../../features/api'; // Adjust import name/path if needed
import { useCreateExpenseMutation } from '../../features/api';
import { Expense } from '../../features/api.types';
import { useNavigate } from 'react-router-dom';

// Example type for participants, assuming your backend sends these fields
type Participant = {
  userId: string;
  firstName: string;
  lastName: string;
};

const TripPage = () => {
  const { tripId } = useParams<{ tripId: string }>();

  const {
    data: tripData,
    isLoading,
    isError,
  } = useGetTripDetailsQuery(Number(tripId));

  const [trip, setTrip] = useState<TripType | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const { data: expenseData } = useGetExpensesByTripQuery({ tripId: Number(tripId) });

  const navigate = useNavigate();


  useEffect(() => {
    if (tripData) {
      const loadedTrip: TripType = {
        id: String(tripData.id), 
        name: tripData.name,
        destination: tripData.destination,
        description: tripData.description,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
      };
      setTrip(loadedTrip);

      if (expenseData) {
        console.log(expenseData.expenses);
        setExpenses(expenseData.expenses);
      }

    
      if ((tripData as any).participants) {
        setParticipants((tripData as any).participants);
      }
    }
  }, [tripData, expenseData]);


  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !tripData) {
    return <div>Failed to load trip data.</div>;
  }
  if (!trip) {
    return <div>Loading trip...</div>;
  }

  return (
    <div className='trip-container'>
      <div className='section-container'>
        <h1 className="trip-destination">Trip to {trip.destination}</h1>
        <p><strong>Description:</strong> {trip.description || 'No description available'}</p>
        <p><strong>Start Date:</strong> {trip.startDate}</p>
        <p><strong>End Date:</strong> {trip.endDate}</p>
      </div>

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
      <ul className="trip-expenses-list">
        {expenses && expenses.length > 0 ? (
          expenses.map((expense) => (
            <li key={expense.id}>
              <strong>{expense.name}</strong> - ${expense.amount} ({expense.date})
              <p>{expense.description}</p>
            </li>
          ))
        ) : (
          <li>No expenses found for this trip.</li>
        )}
      </ul>
    </div>

      <div className="section-container">
        <h2>Add Expense</h2>
        <button
                type="button"
                onClick={() => navigate('/ExpensePage')}
                className="generate-button"
              >
                Add Expense
              </button>
      </div>

      <div className="section-container">
        <h2 className="report-text">Report</h2>
        <button className="generate-button">Generate Report</button>
      </div>
    </div>
  );
};

export default TripPage;
