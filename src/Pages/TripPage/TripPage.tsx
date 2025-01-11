import React, { useState } from 'react';
import './TripPage.css';
import { useAppSelector } from '../../features/store';
import { Trip as TripType } from '../../features/api.types';

const TripPage = () => {
  const trip: TripType = {
    id: '1',
    name: 'Hawaii Adventure',
    destination: 'Hawaii',
    description: 'A wonderful tropical adventure!',
    startDate: '2024-01-15',
    endDate: '2024-01-22',
  };

  const [expenses, setExpenses] = useState([
    {
      id: '1',
      name: 'Flight',
      amount: 500,
      description: 'Round trip flight to Hawaii',
      date: '2024-01-10',
      contributors: ['alice.johnson@example.com'],
    },
    {
      id: '2',
      name: 'Hotel',
      amount: 1200,
      description: '7 nights at a 5-star resort',
      date: '2024-01-11',
      contributors: ['bob.smith@example.com'],
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    description: '',
    date: '',
    contributors: [''],
  });

  const handleAddExpense = () => {
    const newExp = {
      ...newExpense,
      id: (expenses.length + 1).toString(),
    };
    setExpenses([...expenses, newExp]);
    setNewExpense({ name: '', amount: '', description: '', date: '', contributors: [''] });
  };

  const handleContributorChange = (index: number, value: string) => {
    const updatedContributors = [...newExpense.contributors];
    updatedContributors[index] = value;
    setNewExpense({ ...newExpense, contributors: updatedContributors });
  };

  const handleAddContributor = () => {
    setNewExpense({ ...newExpense, contributors: [...newExpense.contributors, ''] });
  };

  if (!trip) {
    return <div>Loading...</div>;
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
        <h2 className="expenses-title">Expenses</h2>
        <ul className='trip-expenses-list'>
          {expenses.map(expense => (
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
              <button type="button" onClick={handleAddContributor} className="generate-button">
                Add Another Contributor
              </button>
              <button type="button" onClick={handleAddExpense} className="generate-button">
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
