import React, { useState, useEffect } from 'react';
import './TripPage.css';
import { useAppSelector } from '../../features/store';
import { Trip as TripType } from '../../features/api.types';
import { useParams } from 'react-router-dom';
import { useGetExpensesByTripQuery, useGetTripDetailsQuery, useLazyGetUserByEmailQuery, useSplitExpensesMutation } from '../../features/api'; // Adjust import name/path if needed
import { useCreateExpenseMutation } from '../../features/api';
import { Expense } from '../../features/api.types';

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

  const [addExpense] = useCreateExpenseMutation();
  const [getUserByEmail] = useLazyGetUserByEmailQuery();
  const [saveExpenseSplits] = useSplitExpensesMutation();
  const { data: expenseData } = useGetExpensesByTripQuery({ tripId: Number(tripId) });

  // Form state for creating a new expense
  var [newExpense, setNewExpense] = useState({
    name: '',
    amount: 0,
    description: '',
    date: '',
    tripId: Number(tripId),
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

      if (expenseData) {
        console.log(expenseData.expenses);
        setExpenses(expenseData.expenses);
      }

      // 3) If tripData includes `participants`
      //    e.g. participants: [{ userId, firstName, lastName }, ...]
      if ((tripData as any).participants) {
        setParticipants((tripData as any).participants);
      }
    }
  }, [tripData, expenseData]);

  // Keep your original logic for adding a local expense
  const handleAddExpense = async () => {
    let expensePostData = {
      id: 0,
      name: newExpense.name,
      amount: Number(newExpense.amount),
      description: newExpense.description,
      date: newExpense.date,
      tripId: Number(tripId),
    };

    console.log(expensePostData);

    // Send the new expense to the backend
    const response = await addExpense(newExpense);
    const newExpenseId = response.data?.expenseId;
    expensePostData.id = response.data?.expenseId || 0;
    
    const userIdPromises = newExpense.contributors.map(async (email) => {
      try {
        const userResponse = await getUserByEmail(email); // Replace with your backend call
        return { email, userId: userResponse.data?.id };
      } catch (error) {
        console.error(`Failed to fetch user ID for email: ${email}`, error);
        return null;
      }
    });

    const contributorsWithIds = (await Promise.all(userIdPromises)).filter(Boolean);

    if (contributorsWithIds.length !== newExpense.contributors.length) {
      console.error('Some contributors could not be resolved to user IDs.');
      return;
    }

    // Equal split
    const splitAmount = Number(newExpense.amount) / contributorsWithIds.length;
    const userAmountMap = contributorsWithIds.reduce((map, contributor) => {
      if (contributor && contributor.userId) {
        map[contributor.userId] = splitAmount;
      }
      return map;
    }, {} as Record<string, number>);

    const expenseSplitPostData = {
      expenseId: Number(newExpenseId),
      userSplits: userAmountMap,
    };

    console.log('Expense Split Payload being sent:', JSON.stringify(expenseSplitPostData, null, 2));

    try {
      await saveExpenseSplits(expenseSplitPostData);
    } catch (error) {
      console.error('Failed to save expense splits', error);
      return;
    }

    setExpenses([...expenses, expensePostData]);
    // Reset the form
    setNewExpense({
      name: '',
      amount: 0,
      description: '',
      date: '',
      contributors: [''],
      tripId: 0,
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
      <ul className="trip-expenses-list">
        {expenses && expenses.length > 0 ? (
          expenses.map((expense) => (
            <li key={expense.id}>
              <strong>{expense.name}</strong> - ${expense.amount} ({expense.date})
              <p>{expense.description}</p>
              {/* <p><strong>Contributors:</strong> {expense.contributors.join(', ')}</p> */}
            </li>
          ))
        ) : (
          <li>No expenses found for this trip.</li>
        )}
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
              onChange={e => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
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
