import React, { useState } from 'react';
import './CreateTrip.css';

const CreateTrip = ({ user }) => {
  const [tripName, setTripName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [newParticipant, setNewParticipant] = useState('');
  const [newExpense, setNewExpense] = useState({
    item: '',
    location: '',
    message: '',
    amount: '',
  });

  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const handleAddExpense = () => {
    if (newExpense.item && newExpense.amount) {
      setExpenses([...expenses, { ...newExpense }]);
      setNewExpense({ item: '', location: '', message: '', amount: '' });
    }
  };

  const handleSaveTrip = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          tripName,
          participants,
          expenses,
          createdBy: user.id,
        }),
      });

      if (response.ok) {
        alert('Trip saved successfully!');
      } else {
        alert('Error saving trip.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className = "createTrip">
      <h1>Create Trip</h1>

      <div>
        <h2>Trip Name</h2>
        <input
          type="text"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          placeholder="Enter trip name"
        />
      </div>

      <div>
        <h2>Participants</h2>
        <input
          type="text"
          value={newParticipant}
          onChange={(e) => setNewParticipant(e.target.value)}
          placeholder="Add participant"
        />
        <button onClick={handleAddParticipant}>Add</button>
        <ul>
          {participants.map((participant, index) => (
            <li key={index}>{participant}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Expenses</h2>
        <input
          type="text"
          value={newExpense.item}
          onChange={(e) => setNewExpense({ ...newExpense, item: e.target.value })}
          placeholder="What did you buy?"
        />
        <input
          type="text"
          value={newExpense.location}
          onChange={(e) => setNewExpense({ ...newExpense, location: e.target.value })}
          placeholder="Where did you buy it?"
        />
        <input
          type="text"
          value={newExpense.message}
          onChange={(e) => setNewExpense({ ...newExpense, message: e.target.value })}
          placeholder="Why did you buy it?"
        />
        <input
          type="number"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          placeholder="How much did you spend?"
        />
        <button onClick={handleAddExpense}>Add Expense</button>
        <ul>
          {expenses.map((expense, index) => (
            <li key={index}>
              {expense.item} - {expense.amount} (Location: {expense.location}, Reason: {expense.message})
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleSaveTrip}>Save Trip</button>
    </div>
  );
};

export default CreateTrip;
