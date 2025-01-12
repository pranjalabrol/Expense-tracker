// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5001/api/auth/login", {
//         email,
//         password,
//       });

//       if (response.status === 200) {
//         const { token } = response.data;

//         // Save the token in local storage
//         localStorage.setItem("token", token);
//         alert("Login successful!");
//          navigate("/dashboard");
//       } else {
//         alert("Failed to login. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error during login:", err.response?.data?.message || err.message);
//       alert(err.response?.data?.message || "An error occurred during login.");
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <button type="submit">Login</button>
//     </form>
//   );
// }

// export default Login;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Auth.css';  // Import the CSS for styling

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token ,user} = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", user.name);
        localStorage.setItem("email", user.email);
        navigate("/dashboard");
      } else {
        alert("Failed to login. Please try again.");
      }
    } catch (err) {
      console.error("Error during login:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "An error occurred during login.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
