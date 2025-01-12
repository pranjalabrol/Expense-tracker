import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Check if the user is logged in (replace this with your actual logic)
  const isLoggedIn = !!localStorage.getItem("authToken"); // Example: Check for token in localStorage

  return isLoggedIn ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
