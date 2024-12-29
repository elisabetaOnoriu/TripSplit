import React, { useState } from 'react';
import './Trip.css';
// import { useTripQuery, useUpdateExpenseMutation } from '../../features/api';
// import { Trip, Expense } from '../../features/api.types';
import { useAppSelector } from '../../features/store';

const Trip = () => {
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [editedExpense, setEditedExpense] = useState<Expense>();

  // Mockup data for a trip
  const trip = {
    destination: 'Hawaii',
    description: 'A wonderful tropical adventure!',
    startDate: '2024-01-15',
    endDate: '2024-01-22',
    users: [
      { id: '1', firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com' },
      { id: '2', firstName: 'Bob', lastName: 'Smith', email: 'bob.smith@example.com' },
    ],
    expenses: [
      { id: '1', category: 'Food', amount: 150, description: 'Dinner at a local restaurant' },
      { id: '2', category: 'Transport', amount: 50, description: 'Taxi to the hotel' },
      { id: '3', category: 'Activities', amount: 200, description: 'Snorkeling tour' },
    ],
  };

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedExpense(prevExpense => ({ ...prevExpense!, [name]: value }));
  };

  const handleSaveExpense = async () => {
    setIsEditingExpense(false);
    // Simulate an API call
    console.log('Expense saved:', editedExpense);
  };

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <div className='trip-container'>
      {/* Trip Details Section */}
      <div className='section-container'>
        <h1>Trip to {trip.destination}</h1>
        <p><strong>Description:</strong> {trip.description || 'No description available'}</p>
        <p><strong>Start Date:</strong> {trip.startDate}</p>
        <p><strong>End Date:</strong> {trip.endDate}</p>
      </div>

      {/* Users Section */}
      <div className='section-container'>
        <h2>Users in Trip</h2>
        <ul className='trip-users-list'>
          {trip.users.map(user => (
            <li key={user.id}>
              {user.firstName} {user.lastName} ({user.email})
            </li>
          ))}
        </ul>
      </div>

      {/* Expenses Section */}
      <div className='section-container'>
        <h2>Expenses</h2>
        <ul className='expenses-list'>
          {trip.expenses.map(expense => (
            <li key={expense.id} className='expense-item'>
              <p><strong>Category:</strong> {expense.category}</p>
              <p><strong>Amount:</strong> ${expense.amount}</p>
              <p><strong>Description:</strong> {expense.description}</p>
              {isEditingExpense && editedExpense?.id === expense.id ? (
                <div>
                  <input
                    name='amount'
                    value={editedExpense.amount}
                    onChange={handleExpenseChange}
                    className='editable-input'
                  />
                  <input
                    name='description'
                    value={editedExpense.description}
                    onChange={handleExpenseChange}
                    className='editable-input'
                  />
                  <button onClick={handleSaveExpense} className='save-expense-btn'>Save</button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsEditingExpense(true);
                    setEditedExpense(expense);
                  }}
                  className='edit-expense-btn'
                >
                  Edit
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Trip;
