import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

const ChartComponent = ({ expenses = [], isSummaryPage = false }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Destroy any existing chart before re-rendering
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Ensure expenses is an array
    if (Array.isArray(expenses) && expenses.length > 0) {
      const chartData = {
        labels: expenses.map((expense) => expense.date), // X-axis (dates in ISO format)
        datasets: [
          {
            label: isSummaryPage
              ? 'Summary Expense Amount ($)'
              : 'Expense Amount ($)', // Change label for summary
            data: expenses.map((expense) => expense.amount), // Y-axis (prices)
            backgroundColor: isSummaryPage
              ? 'rgba(255, 99, 132, 0.2)' // Different color for summary
              : 'rgba(75, 192, 192, 0.2)',
            borderColor: isSummaryPage
              ? 'rgba(255, 99, 132, 1)' // Different border color for summary
              : 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };

      // Chart configuration
      const config = {
        type: isSummaryPage ? 'bar' : 'line', // Use bar chart for summary
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: isSummaryPage
                ? 'Monthly Expense Summary'
                : 'Expense Tracking Chart',
            },
          },
          scales: {
            x: {
              type: 'time', // Use time scale
              time: {
                unit: isSummaryPage ? 'month' : 'day', // Monthly intervals for summary
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      };

      // Render chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, config);
    }
    console.log('Expenses data:', expenses,isSummaryPage);
  }, [expenses, isSummaryPage]);

  return (
    <div>
      {expenses && expenses.length > 0 ? (
        <canvas ref={chartRef}></canvas>
      ) : (
        <p>No data available to display the chart.</p>
      )}
    </div>
  );
};

export default ChartComponent;
