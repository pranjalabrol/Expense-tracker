



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto'; // Assuming you're using Chart.js for the chart

const MonthlyPage = () => {
  const [year, setYear] = useState('2024'); // Default year
  const [month, setMonth] = useState('01'); // Default month (January)
  const [records, setRecords] = useState([]);
  const [chart, setChart] = useState(null); // Store chart instance

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

// Fetch records for selected month and year
useEffect(() => {
  const fetchRecords = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/records/get-monthly-records?year=${year}&month=${month}`
      );

      // Sort records by date before updating state
      const sortedRecords = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setRecords(sortedRecords); // Update state with sorted records
      updateChart(sortedRecords); // Update chart with sorted records
    } catch (err) {
      console.error('Error fetching records:', err);
    }
  };

  fetchRecords();
}, [year, month]); // Trigger whenever year or month changes

// Update Chart with new data
const updateChart = (data) => {
  // Sort records by date (if not already sorted)
  const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartLabels = sortedData.map((record) =>
    new Date(record.date).toLocaleDateString() // Format dates for the X-axis
  );
  const chartData = sortedData.map((record) => record.amount);

  if (chart) {
    // Destroy the existing chart instance to avoid canvas reuse error
    chart.destroy();
  }

  // Create a new chart instance
  const ctx = document.getElementById('recordsChart').getContext('2d');
  const newChart = new Chart(ctx, {
    type: 'line', // You can change this to 'bar', 'pie', etc.
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Expenses',
          data: chartData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4, // Smooth curve for the line chart
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Amount ($)',
          },
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
    },
  });

  setChart(newChart); // Save the new chart instance
};


  return (
    <div>
      <h1>Monthly Records</h1>
      
      {/* Dropdown for Year */}
      <select value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
      </select>

      {/* Dropdown for Month */}
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      {/* Chart */}
      <canvas id="recordsChart" width="400" height="200"></canvas>

      {/* Table */}
      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record) => (
              <tr key={record._id}>
                <td>{new Date(record.date).toDateString()}</td>
                <td>{record.category}</td>
                <td>${record.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                No records found for this month and year
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyPage;

