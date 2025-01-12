import React, { useState, useEffect } from 'react';
import ChartComponent from '../ChartComponent';
// import '../css/Daily.css';
const Daily = () => {
  // Get today's date in local format (YYYY-MM-DD)
  const getLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getLocalDate()); // Use local date
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ amount: '', category: '', date: '' });

  // Fetch expenses from the API
  const fetchExpenses = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/records/get-records`);
      const data = await response.json();

      // Get the last 5 records (regardless of date)
      const last5Expenses = data.slice(-5);
      setExpenses(last5Expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  // Add expense to the API
  const addExpense = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/records/add-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Fetch updated expenses after adding a new one
        fetchExpenses();
        // Reset the form
        setFormData({ amount: '', category: '', date: '' });
      } else {
        console.error('Failed to add expense:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  // Delete expense from the API
  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/records/delete-record/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Fetch updated expenses after deletion
        fetchExpenses();
      } else {
        console.error('Failed to delete expense:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Fetch expenses when the component loads or when the selected date changes
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to format date (remove time)
  const formatDate = (date) => {
    return date.split('T')[0]; // This will remove the time part
  };

  return (
    <div>
      <h2>Daily Expenses</h2>

      {/* Date Picker for Chart */}
      {/* <div>
        <label>Select Date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div> */}

      {/* Chart Component */}
      <div>
        {/* <h2>Daily Tab</h2> */}
        <ChartComponent
          apiEndpoint={`http://localhost:5001/api/records/get-records`}
          dateFilter={selectedDate}
          expenses={expenses}
        />
      </div>
<br></br>
      {/* Add Expense Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addExpense();
        }}
      >
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Expense</button>
      </form>

 
   
      <h3>Expense List</h3>
<table border="1" style={{ width: '100%', textAlign: 'left' }}>
  <thead>
    <tr>
      <th>Sr. No.</th>
      <th>Date</th>
      <th>Category</th>
      <th>Amount</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {expenses.length > 0 ? (
      expenses.map((expense, index) => (
        <tr key={expense._id}>
          <td>{index + 1}</td>
          <td>{formatDate(expense.date)}</td>
          <td>{expense.category}</td>
          <td>${expense.amount}</td>
          <td>
            <button onClick={() => deleteExpense(expense._id)}>Delete</button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" style={{ textAlign: 'center' }}>
          No expenses found.
        </td>
      </tr>
    )}
  </tbody>
</table>

    </div>
  );
};

export default Daily;
