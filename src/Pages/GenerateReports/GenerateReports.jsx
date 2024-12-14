import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import './GenerateReports.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const GenerateReports = ({ theme }) => {
  const [expensesData, setExpensesData] = useState([]);

  const mockExpensesData = [
    { tripName: 'Paris', totalSpent: 500 },
    { tripName: 'London', totalSpent: 700 },
    { tripName: 'Rome', totalSpent: 300 },
    { tripName: 'Berlin', totalSpent: 400 },
    { tripName: 'Tokyo', totalSpent: 1200 },
  ];

  useEffect(() => {
    setExpensesData(mockExpensesData);
  }, []);

  const chartData = {
    labels: expensesData.map((expense) => expense.tripName),
    datasets: [
      {
        label: 'Total Spent ($)',
        data: expensesData.map((expense) => expense.totalSpent),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 1)' : 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? 'white' : 'black',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? 'white' : 'black',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: theme === 'dark' ? 'white' : 'black',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className={`generate-reports-container ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
      <h1 className="report-title">Expense Overview</h1>
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default GenerateReports;
