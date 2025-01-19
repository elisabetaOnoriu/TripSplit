import React, { useState, useEffect, useRef } from "react";
import "./ExpensePage.css";
import { useCreateTripMutation } from "../../features/api";
import { useAppSelector } from "../../features/store";
import {
  useGetExpensesByTripQuery,
  useGetTripDetailsQuery,
  useCreateExpenseMutation,
  useLazyGetUserByEmailQuery,
  useSplitExpensesMutation,
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
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const userId = useAppSelector((state) => state.auth.userId);
  const [createTrip] = useCreateTripMutation();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const [addExpense] = useCreateExpenseMutation();
  const [getUserByEmail] = useLazyGetUserByEmailQuery();
  const [saveExpenseSplits] = useSplitExpensesMutation();
  const { data: expenseData } = useGetExpensesByTripQuery({ tripId: Number(tripId) });

  const [newExpense, setNewExpense] = useState<{
    name: string;
    amount: number;
    description: string;
    date: string;
    tripId: number;
    division: string;
    contributors: string[];
    contributorAmounts: (number | "")[];
  }>({
    name: "",
    amount: 0,
    description: "",
    date: "",
    division: "equally",
    contributors: [""],
    contributorAmounts: [""],
    tripId: Number(tripId),
  });

  const contributorAmountRefs = useRef<HTMLInputElement[]>([]);
  const amountRef = useRef<HTMLInputElement | null>(null);

  const getAvailableParticipants = (currentUserId?: string) => {
    return participants.filter(
      (participant) =>
        participant.userId === currentUserId ||
        !newExpense.contributors.includes(participant.userId)
    );
  };
  
  

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

  const calculateRemainingAmount = (): number => {
    const totalContributorAmount = newExpense.contributorAmounts.reduce<number>(
      (acc, amount) =>
        acc + (typeof amount === "number" ? amount : parseFloat(amount) || 0),
      0
    );
    return Math.max(0, newExpense.amount - totalContributorAmount);
  };

  const remainingAmount = calculateRemainingAmount();

  const handleAddExpense = async () => {
    const totalContributorAmount = newExpense.contributorAmounts.reduce<number>(
      (acc, amount) =>
        acc + (typeof amount === "number" ? amount : parseFloat(amount) || 0),
      0
    );

    if (totalContributorAmount !== newExpense.amount) {
      setErrorMessage("Contributor amounts must fully cover the total expense.");
      return;
    }

    const postData = {
      id: 0,
      name: newExpense.name,
      amount: newExpense.amount,
      description: newExpense.description,
      date: new Date().toISOString(),
      tripId: Number(tripId),
      userId: userId,
    };

    try {
      console.log(postData);
      const response = await addExpense(postData);
      const newExpenseId = response.data?.expenseId;
      postData.id = response.data?.expenseId || 0;

      const userIdPromises = newExpense.contributors.map(async (email) => {
        try {
          const userResponse = await getUserByEmail(email);
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

      const userAmountMap = contributorsWithIds.reduce((acc, user) => {
        if (user && user.userId) {
          const amount =  newExpense.contributorAmounts[contributorsWithIds.indexOf(user)];
          acc[user.userId] = typeof amount === "number" ? amount : parseFloat(amount) || 0;
        }
        return acc;
      }, {} as Record<string, number>);

      const expenseSplitPostData = {
        expenseId: Number(newExpenseId),
        userSplits: userAmountMap,
      };

      try {
        console.log(expenseSplitPostData);
        await saveExpenseSplits(expenseSplitPostData);
      } catch (error) {
        console.error('Failed to save expense splits', error);
        return;
      }

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
        contributorAmounts: [""],
        tripId: Number(tripId),
      });
    } catch (error) {
      setErrorMessage("Failed to add expense. Please try again.");
    }
  };

  const handleContributorChange = (index, value) => {
    const updatedContributors = [...newExpense.contributors];
    updatedContributors[index] = value;
    setNewExpense((prev) => ({
      ...prev,
      contributors: updatedContributors,
    }));
  };
  
  

  const handleContributorAmountChange = (index: number, value: string) => {
    let amount = Math.max(0, parseFloat(value) || 0);

    const totalOtherContributions = newExpense.contributorAmounts.reduce<number>(
      (acc, amt, i) =>
        i === index || amt === ""
          ? acc
          : acc + (typeof amt === "number" ? amt : Number(amt) || 0),
      0
    );

    const maxAllowed = Math.max(0, newExpense.amount - totalOtherContributions);
    if (amount > maxAllowed) {
      amount = maxAllowed; 
    }

    const updatedAmounts = [...newExpense.contributorAmounts];
    updatedAmounts[index] = amount; 
    setNewExpense({ ...newExpense, contributorAmounts: updatedAmounts });
  };

  const handleAddContributor = () => {
    const updatedContributors = [...newExpense.contributors, ""];
    if (newExpense.division === "equally") {
      const equalAmount = parseFloat((newExpense.amount / updatedContributors.length).toFixed(2));
      const updatedAmounts = updatedContributors.map(() => equalAmount);
      setNewExpense({
        ...newExpense,
        contributors: updatedContributors,
        contributorAmounts: updatedAmounts,
      });
    } else {
      setNewExpense({
        ...newExpense,
        contributors: updatedContributors,
        contributorAmounts: [...newExpense.contributorAmounts, ""],
      });
    }
  };

  const handleRemoveContributor = (index: number) => {
    const updatedContributors = [...newExpense.contributors];
    const updatedAmounts = [...newExpense.contributorAmounts];
    updatedContributors.splice(index, 1);
    updatedAmounts.splice(index, 1);

    if (newExpense.division === "equally" && updatedContributors.length > 0) {
      const equalAmount = parseFloat((newExpense.amount / updatedContributors.length).toFixed(2));
      const recalculatedAmounts = updatedContributors.map(() => equalAmount);
      setNewExpense({
        ...newExpense,
        contributors: updatedContributors,
        contributorAmounts: recalculatedAmounts,
      });
    } else {
      setNewExpense({
        ...newExpense,
        contributors: updatedContributors,
        contributorAmounts: updatedAmounts,
      });
    }
  };

  const handleDivisionChange = (value: string) => {
    if (value === "equally" && newExpense.contributors.length > 0) {
      const equalAmount = parseFloat((newExpense.amount / newExpense.contributors.length).toFixed(2));
      const updatedAmounts = newExpense.contributors.map(() => equalAmount);
      setNewExpense({ ...newExpense, division: value, contributorAmounts: updatedAmounts });
    } else if (value === "custom") {
      setNewExpense({ ...newExpense, division: value });
    }
  };

  const handleAmountChange = (value: string) => {
    const cursorPosition = amountRef.current?.selectionStart || 0;
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;

    setNewExpense({ ...newExpense, amount: parseFloat(numericValue.toFixed(2)) });

    if (newExpense.division === "equally" && newExpense.contributors.length > 0) {
      const equalAmount = parseFloat((numericValue / newExpense.contributors.length).toFixed(2));
      setNewExpense((prev) => ({
        ...prev,
        contributorAmounts: newExpense.contributors.map(() => equalAmount),
      }));
    }

    setTimeout(() => {
      if (amountRef.current) {
        amountRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  };

  const displayRemainingAmount =
    remainingAmount === 0 ? "Fully covered" : `Remaining: ${remainingAmount.toFixed(2)}`;

  return (
    <div className="expensePage">
      <h1 className="title">Add an expense for your trip</h1>

      <div className="section-container">
      <h3 className="subtitle">Name</h3>
        <input
          id="expense-name"
          type="text"
          value={newExpense.name}
          onChange={(e) =>
            setNewExpense({ ...newExpense, name: e.target.value })
          }
          placeholder="Enter an expense name"
        />
      </div>

      <div className="section-container">
      <h3 className="subtitle">Description</h3>
        <input
          id="expense-description"
          type="text"
          value={newExpense.description}
          onChange={(e) =>
            setNewExpense({ ...newExpense, description: e.target.value })
          }
          placeholder="Enter a description"
        />
      </div>

      <div className="section-container">
      <h3 className="subtitle">Amount</h3>
        <input
          id="expense-amount"
          type="text"
          ref={amountRef}
          placeholder="Amount"
          value={newExpense.amount ? newExpense.amount.toFixed(2) : ""}
          onChange={(e) => handleAmountChange(e.target.value)}
        />
      </div>

      <div className="section-container">
      <h3 className="subtitle">Division</h3>
        <select
          className="division-select"
          value={newExpense.division}
          onChange={(e) => handleDivisionChange(e.target.value)}
        >
          <option value="equally">Equally</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="section-container">
  <h3 className="subtitle">Contributors</h3>
  {newExpense.contributors.map((userId, index) => (
    <div key={index} className="contributor-row">
      <label htmlFor={`contributor-${index}`}>Contributor</label>
      <select
        id={`contributor-${index}`}
        className="division-select"
        value={userId}
        onChange={(e) => handleContributorChange(index, e.target.value)}
      >
        <option value="">Select Contributor</option>
        {getAvailableParticipants(userId).map((participant) => (
          <option key={participant.userId} value={participant.userId}>
            {participant.firstName} {participant.lastName}
          </option>
        ))}
      </select>
      <input
        type="text"
        ref={(el) => {
          if (el) contributorAmountRefs.current[index] = el;
        }}
        value={
          typeof newExpense.contributorAmounts[index] === "number"
            ? newExpense.contributorAmounts[index].toFixed(2)
            : ""
        }
        placeholder="Contributor Amount"
        onChange={(e) => {
          const cursorPosition = e.target.selectionStart;
          handleContributorAmountChange(index, e.target.value);
          setTimeout(() => {
            if (contributorAmountRefs.current[index]) {
              contributorAmountRefs.current[index].setSelectionRange(
                cursorPosition!,
                cursorPosition!
              );
            }
          });
        }}
        readOnly={newExpense.division !== "custom"}
      />
      <button onClick={() => handleRemoveContributor(index)}>Remove</button>
    </div>
  ))}

  {newExpense.contributors.length < participants.length && (
    <button
      type="button"
      onClick={handleAddContributor}
      className="generate-button"
    >
      Add Another Contributor
    </button>
  )}
</div>




      {newExpense.division === "custom" && (
        <div className="section-container">
          <h3 className="subtitle">Remaining Amount</h3>
          <input
            id="remaining-amount"
            type="text"
            value={displayRemainingAmount}
            readOnly
          />
        </div>
      )}

      <div className="buttons-expenses">
        <button
          type="button"
          onClick={handleAddExpense}
          className="generate-button"
        >
          Add Expense
        </button>
      </div>

      {notificationMessage && (
        <div className="success-message">{notificationMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default ExpensePage;
