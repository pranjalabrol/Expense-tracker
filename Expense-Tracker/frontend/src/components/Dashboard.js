import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Profile icon
import Daily from './Tabs/Daily';
import Calendar from './Tabs/Calendar';
import Monthly from './Tabs/Monthly';
import Summary from './Tabs/Summary';
import './Dashboard.css'; // Add your CSS file for styling

const Dashboard = () => {
  const location = useLocation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });

  useEffect(() => {
    // Fetch username and email from localStorage
    const username = localStorage.getItem('username') || 'Guest';
    const email = localStorage.getItem('email') || 'Not Available';
    setUser({ name: username, email: email });
  }, []);

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    window.location.href = '/login'; // Redirect to login page after logout
  };

  // Redirect to "daily" tab by default when visiting /dashboard
  if (location.pathname === '/dashboard') {
    return <Navigate to="/dashboard/daily" />;
  }

  return (
    <div className="dashboard-container">
      <h1>Expense Tracker</h1>

      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <Link
          to="/dashboard/daily"
          className={`tab-link ${location.pathname === '/dashboard/daily' ? 'active' : ''}`}
        >
          🗓️ Daily
        </Link>
        <Link
          to="/dashboard/calendar"
          className={`tab-link ${location.pathname === '/dashboard/calendar' ? 'active' : ''}`}
        >
          📅 Calendar
        </Link>
        <Link
          to="/dashboard/monthly"
          className={`tab-link ${location.pathname === '/dashboard/monthly' ? 'active' : ''}`}
        >
          📈 Monthly
        </Link>
        <Link
          to="/dashboard/summary"
          className={`tab-link ${location.pathname === '/dashboard/summary' ? 'active' : ''}`}
        >
          📊 Summary
        </Link>

        {/* Profile Icon */}
        <div className="profile-container">
          <FaUserCircle
            className="profile-icon"
            onClick={toggleProfileDropdown}
            title="Profile"
          />
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        <Routes>
          <Route path="daily" element={<Daily />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="monthly" element={<Monthly />} />
          <Route path="summary" element={<Summary />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
