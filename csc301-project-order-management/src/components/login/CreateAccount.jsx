import React, { useState } from 'react';

import './style.css'; // Assuming a single CSS file for all components
import Navbar from "../navbar/Navbar.jsx"
import { createUser } from "../view_control.js";

function CreateAccount() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const email = document.getElementById("email");
  // const password = document.getElementById("password");
  // const confirmPassword = document.getElementById("confirmPassword");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPasswordMismatchMessage, setShowPasswordMismatchMessage] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    //Check if passwords match
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      setShowPasswordMismatchMessage(true);
      setTimeout(() => {
        setShowPasswordMismatchMessage(false);
      }, 3000); // Hide message after 3 seconds
      return;
    } else {
      // create user
      createUser(email.value, password.value);
    }

    // Passwords match, proceed with form submission
    // Add your form submission logic here
    console.log("Form submitted successfully");
  };

  return (
    <div className="wrapper"> 
      <Navbar />
      <main>
        <div className="form-container">
          <form id="createAccountForm" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>
            {!passwordsMatch && showPasswordMismatchMessage && <p style={{ color: 'red' }}>Passwords do not match</p>}
            <button type="submit">Create Account</button>
          </form>
        </div>
      </main>
      <footer> {/* This footer will stick to the bottom */}
        <p>Copyright 2024 by WeBite.Inc.</p>
      </footer>
    </div>
  );
}

export default CreateAccount;
