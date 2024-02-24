import React from 'react';
import { useNavigate } from 'react-router-dom';

import './style.css'; // Ensure this is the correct path to your CSS file
import Navbar from "../navbar/Navbar.jsx"


function Login() {
  let navigate = useNavigate();

  const handleLogin = (event) => {
    navigate('/Login');
  };

  return (
    <div className="wrapper"> 
      <Navbar />
      <main>
        <div className="form-container">
          <form id="loginForm" onSubmit={handleLogin}>
            <h2>Login</h2>
            <div className="form-group">
              <label htmlFor="email">Email/Username:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Login</button>
            <div className="helper-links">
              <a href = "forgot-password" className="forgot-password">Forgot Password?</a>
              <button type="button" className="create-account-btn">
                <a href = "/create-account"className= "create-account-btn"> Create Account </a>
              </button>
            </div>
          </form>
        </div>
      </main>
      <footer> {/* This footer will stick to the bottom */}
        <p>Copyright 2024 by WeBite.Inc.</p>
      </footer>
    </div>
  );
}

export default Login;
