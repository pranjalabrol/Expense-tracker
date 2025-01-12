import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ChartComponent from "../ChartComponent";

const CalendarTab = () => {
  const [value, setValue] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expenses, setExpenses] = useState([]); // Store all expenses from API
  const [filteredExpenses, setFilteredExpenses] = useState([]); // Store filtered expenses for the selected date

  // Function to fetch expenses from the API
  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/records/get-records"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json(); // API response
      setExpenses(data); // Save all expenses to state
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Format date as YYYY-MM-DD without affecting time zone
  const formatDate = (date) => {
    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return offsetDate.toISOString().split("T")[0];
  };

  // Filter expenses for the selected date
  const filterExpensesForDate = (date) => {
    const formattedDate = formatDate(date);
    const filtered = expenses.filter(
      (expense) => formatDate(new Date(expense.date)) === formattedDate
    );
    setFilteredExpenses(filtered);
  };

  // Fetch expenses when the component mounts
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Update filtered expenses whenever the selected date or expenses change
  useEffect(() => {
    filterExpensesForDate(value);
  }, [value, expenses]);

  return (
    <div>
      <h2>Calendar</h2>
      {/* <ChartComponent
        apiEndpoint={`http://localhost:5001/api/records/get-records`}
        dateFilter={formatDate(selectedDate)}
      /> */}
      <Calendar style={{ margin: "Auto" }} onChange={setValue} value={value} />

      <div>
        <h3>Expenses for {formatDate(value)}</h3>
        {filteredExpenses.length ? (
          <table
            border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Category</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, index) => (
                <tr key={expense._id}>
                  <td>{index + 1}</td>
                  <td>{expense.category}</td>
                  <td>${expense.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses for this date.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarTab;
