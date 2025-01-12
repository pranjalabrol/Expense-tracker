import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const SummaryPage = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/records/get-summary', {
          params: { year: 2024, month: 12 },
        });
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    fetchSummary();
  }, []);

  if (!summary) return <div>Loading...</div>;

  const { totalExpense, highestSpendingCategory, categoryBreakdown, detailedRecords } = summary;

  const chartData = {
    labels: Object.keys(categoryBreakdown),
    datasets: [
      {
        label: 'Expense by Category',
        data: Object.values(categoryBreakdown),
        backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ffeb3b'], // Example colors
      },
    ],
  };

  return (
    <div>
    <h1>Expense Summary</h1>
    <h3>Total Expenses: ${totalExpense}</h3>
    <h3>Highest Spending Category: {highestSpendingCategory.category} (${highestSpendingCategory.amount})</h3>
  
    <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', alignItems: 'flex-start' }}>
      {/* First Table */}
      <div>
        <h4>Category Breakdown</h4>
        <table  border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Category</th>
              <th>Expense</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(categoryBreakdown).map(([category, amount], index) => (
              <tr key={category}>
                <td>{index + 1}</td>
                <td>{category}</td>
                <td>${amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Second Table */}
      <div>
        <h4>Detailed Records</h4>
        <table  border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {detailedRecords.map((record, index) => (
              <tr key={index}>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.category}</td>
                <td>${record.amount}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2">Total</td>
              <td>${totalExpense}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  
    <div>
      <h4>Expense by Category</h4>
      <Bar data={chartData} />
    </div>
  </div>
  
  );
};

export default SummaryPage;
