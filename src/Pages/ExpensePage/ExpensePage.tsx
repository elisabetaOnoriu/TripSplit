import React, { useState, useEffect } from "react";
import "./ExpensePage.css";
import { useCreateTripMutation } from "../../features/api";
import { useAppSelector } from "../../features/store";
import {
  useGetExpensesByTripQuery,
  useGetTripDetailsQuery,
  useCreateExpenseMutation,
} from "../../features/api";
import { Expense, Trip as TripType } from "../../features/api.types";
import { useParams } from "react-router-dom";

type Participant = {
  userId: string;
  firstName: string;
  lastName: string;
};

const ExpensePage = () => {
  const { tripId } = useParams<{ tripId: string }>();

  const { data: tripData, isLoading, isError } = useGetTripDetailsQuery(Number(tripId));

  const [trip, setTrip] = useState<TripType | null>(null);
  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const userId = useAppSelector((state) => state.auth.userId);
  const [createTrip] = useCreateTripMutation();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const [addExpense] = useCreateExpenseMutation();
  const { data: expenseData } = useGetExpensesByTripQuery({ tripId: Number(tripId) });

  const [newExpense, setNewExpense] = useState<{
    name: string;
    amount: number;
    description: string;
    date: string;
    tripId: number;
    division: string;
    contributors: string[];
    contributorAmounts: number[];
  }>({
    name: "",
    amount: 0,
    description: "",
    date: "",
    division: "equally",
    contributors: [""],
    contributorAmounts: [0],
    tripId: Number(tripId),
  });

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
        setExpenses(expenseData.expenses);
      }

      if ((tripData as any).participants) {
        setParticipants((tripData as any).participants);
      }
    }
  }, [tripData, expenseData]);

  const updateContributorAmounts = () => {
    if (newExpense.division === "equally") {
      const numberOfContributors = newExpense.contributors.length;
      const equalAmount = numberOfContributors > 0 ? newExpense.amount / numberOfContributors : 0;
      setNewExpense((prevExpense) => ({
        ...prevExpense,
        contributorAmounts: Array(numberOfContributors).fill(parseFloat(equalAmount.toFixed(2))),
      }));
    } else if (newExpense.division === "custom") {
     
      setNewExpense((prevExpense) => ({
        ...prevExpense,
        contributorAmounts: Array(newExpense.contributors.length).fill(0),
      }));
    }
  };

  useEffect(() => {
    updateContributorAmounts();
  }, [newExpense.amount, newExpense.contributors.length, newExpense.division]);

  const handleAddExpense = async () => {
    if (!newExpense.name || newExpense.amount <= 0 || !newExpense.date) {
      setErrorMessage("All fields are required.");
      return;
    }


    const totalContributorAmount = newExpense.contributorAmounts.reduce(
      (acc, amount) => acc + amount,
      0
    );

    if (totalContributorAmount > newExpense.amount) {
      setErrorMessage("Contributor amounts cannot exceed the total expense amount.");
      return;
    }

    const postData = {
      id: 0,
      name: newExpense.name,
      amount: newExpense.amount,
      description: newExpense.description,
      date: newExpense.date,
      tripId: Number(tripId),
      division: newExpense.division,
      contributors: newExpense.contributors.filter((c) => c !== ""),
      contributorAmounts: newExpense.contributorAmounts,
    };

    try {
      const response = await addExpense(postData).unwrap();
      postData.id = response?.expenseId || 0;

      setExpenses([...expenses, postData]);

      setNotificationMessage("Expense added successfully!");
      setErrorMessage("");

      setNewExpense({
        name: "",
        amount: 0,
        description: "",
        date: "",
        division: "equally",
        contributors: [""],
        contributorAmounts: [0],
        tripId: Number(tripId),
      });
    } catch (error) {
      setErrorMessage("Failed to add expense. Please try again.");
    }
  };

  const handleContributorChange = (index: number, value: string) => {
    const updatedContributors = [...newExpense.contributors];
    updatedContributors[index] = value;
    setNewExpense({ ...newExpense, contributors: updatedContributors });
  };

  const handleContributorAmountChange = (index: number, value: string) => {
    let amount = parseFloat(value);
    if (isNaN(amount)) {
      amount = 0;
    }

    if (amount > newExpense.amount) {
      amount = newExpense.amount;
    }

    const updatedAmounts = [...newExpense.contributorAmounts];
    updatedAmounts[index] = parseFloat(amount.toFixed(2)); 
    setNewExpense({ ...newExpense, contributorAmounts: updatedAmounts });
  };

  const handleAddContributor = () => {
    setNewExpense({
      ...newExpense,
      contributors: [...newExpense.contributors, ""],
      contributorAmounts: [...newExpense.contributorAmounts, 0], 
    });
  };

  const handleRemoveContributor = (index: number) => {
    const updatedContributors = [...newExpense.contributors];
    const updatedAmounts = [...newExpense.contributorAmounts];
    updatedContributors.splice(index, 1);
    updatedAmounts.splice(index, 1);
    setNewExpense({
      ...newExpense,
      contributors: updatedContributors,
      contributorAmounts: updatedAmounts,
    });
  };

  const remainingAmount = newExpense.amount - newExpense.contributorAmounts.reduce(
    (acc, amount) => acc + amount,
    0
  );

  return (
    <div className="expensePage">
      <h1 className="title">Add an Expense</h1>

      <div className="section-container">
        <h3 className="subtitle">Name</h3>
        <input
          type="text"
          value={newExpense.name}
          onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
          placeholder="Enter an expense name"
        />
      </div>

      <div className="section-container">
        <h3 className="subtitle">Description</h3>
        <input
          type="text"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          placeholder="Enter a description"
        />
      </div>

      <div className="section-container">
        <div>
          <h3 className="subtitle">Date:</h3>
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
          />
        </div>
      </div>

      <div className="section-container">
        <div>
          <h3 className="subtitle">Amount:</h3>
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount || ""}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value > 0) {
                setNewExpense({ ...newExpense, amount: value });
              } else if (e.target.value === "") {
                setNewExpense({ ...newExpense, amount: 0 });
              }
            }}
          />
        </div>
      </div>

      <div className="section-container">
        <div>
          <h3 className="subtitle">Divided:</h3>
          <select
            value={newExpense.division}
            onChange={(e) => setNewExpense({ ...newExpense, division: e.target.value })}
          >
            <option value="equally">Equally</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      <div className="section-container">
        <div>
          <h3 className="subtitle">Contributors:</h3>
          {newExpense.contributors.map((email, index) => (
            <div key={index} className="contributor-row">
              <input
                type="email"
                placeholder="Contributor Email"
                value={email}
                onChange={(e) => handleContributorChange(index, e.target.value)}
              />
              {newExpense.division === "custom" ? (
                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.contributorAmounts[index] || 0}
                  onChange={(e) => handleContributorAmountChange(index, e.target.value)}
                  step="1" 
                />
              ) : (
                <input
                  type="number"
                  value={newExpense.contributorAmounts[index].toFixed(2) || 0}
                  readOnly
                />
              )}
              <button onClick={() => handleRemoveContributor(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddContributor} className="generate-button">
            Add Another Contributor
          </button>
        </div>
      </div>

      {newExpense.division === "custom" && remainingAmount > 0 && (
        <div className="section-container">
          <h3 className="subtitle">Remaining Amount:</h3>
          <input
            type="text"
            value={remainingAmount.toFixed(2)}
            readOnly
            className="remaining-amount"
          />
        </div>
      )}

      <div className="buttons-expenses">
        <button type="button" onClick={handleAddExpense} className="generate-button">
          Add Expense
        </button>
      </div>

      {notificationMessage && <div className="success-message">{notificationMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default ExpensePage;
