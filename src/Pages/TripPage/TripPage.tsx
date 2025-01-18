import React, { useState, useEffect } from "react";
import "./TripPage.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetExpensesByTripQuery,
  useGetTripDetailsQuery,
} from "../../features/api";
import { Trip as TripType, Expense } from "../../features/api.types";

// Example type for participants
type Participant = {
  userId: string;
  firstName: string;
  lastName: string;
};

const TripPage = () => {
  const { tripId } = useParams<{ tripId: string }>();

  const { data: tripData, isLoading, isError } = useGetTripDetailsQuery(Number(tripId));
  const { data: expenseData } = useGetExpensesByTripQuery({ tripId: Number(tripId) });

  const [trip, setTrip] = useState<TripType | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [tooltipData, setTooltipData] = useState<{ name: string; amount: number }[]>([]);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const [activeTooltipExpenseId, setActiveTooltipExpenseId] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleArrowClick = (
    contributors: { name: string; amount: number }[] | undefined,
    expenseId: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    if (activeTooltipExpenseId === expenseId) {
      // Close tooltip if the same expense is clicked again
      setActiveTooltipExpenseId(null);
      setTooltipVisible(false);
    } else {
      // Open tooltip for the new expense
      setTooltipData(contributors?.length ? contributors : [{ name: "No contributors", amount: 0 }]);
      setTooltipPosition({
        top: rect.top + window.scrollY + rect.height + 5,
        left: rect.left + window.scrollX + rect.width + 10,
      });
      setActiveTooltipExpenseId(expenseId);
    }
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
    <div className="trip-container">
      <div className="section-container">
        <h1 className="trip-destination">Trip to {trip.destination}</h1>
        <p>
          <strong>Description:</strong> {trip.description || "No description available"}
        </p>
        <p>
          <strong>Start Date:</strong> {trip.startDate}
        </p>
        <p>
          <strong>End Date:</strong> {trip.endDate}
        </p>
      </div>

      <div className="section-container">
        <h2>Participants</h2>
        {participants.length > 0 ? (
          <ul className="no-dots">
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
        {expenses && expenses.length > 0 ? (
          <table className="trip-expenses-table">
            <thead className="antetexpenses">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Amount (RON)</th>
                <th>Contributors</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.name}</td>
                  <td>{expense.description}</td>
                  <td>{expense.amount}</td>
                  <td>
                    <span className="contributors-list">
                      {expense.contributors?.map((c) => c.name).join(", ") || "N/A"}
                    </span>
                    <button
                      className="tooltip-arrow"
                      onClick={(e) => handleArrowClick(expense.contributors, expense.id, e)}
                      aria-label="Show contributors' details"
                    >
                      ➔
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses found for this trip.</p>
        )}

        {/* Tooltip */}
        {activeTooltipExpenseId !== null && tooltipData.length > 0 && tooltipPosition && (
          <div
            className="contributors-tooltip"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>Contributor</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {tooltipData.map((contributor, index) => (
                  <tr key={index}>
                    <td>{contributor.name}</td>
                    <td>{contributor.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="section-container">
        <h2>Add Expense</h2>
        <button
          type="button"
          onClick={() => navigate("/ExpensePage")}
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
