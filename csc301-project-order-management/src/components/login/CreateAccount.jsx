import React from 'react';

import './style.css'; // Assuming a single CSS file for all components
import Navbar from "../navbar/Navbar.jsx"

function CreateAccount() {
  return (
    <div className="wrapper"> 
    <Navbar />
      <main>
        <div className="form-container">
          <form id="createAccountForm">
            <h2>Create Account</h2>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required />
            </div>
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