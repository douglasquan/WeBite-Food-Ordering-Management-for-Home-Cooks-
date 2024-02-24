
import React from 'react';

import './style.css'; // Assuming a single CSS file for all components
import Navbar from "../navbar/Navbar.jsx"

function ForgotPassword() {
  return (
    <div className="wrapper"> 
    <Navbar />
      <main>
        <div className="form-container">
          <form id="forgetPasswordForm" method="POST">
            <h2>Forget Password</h2>
            <p>Please enter your email address. You will receive a link to create a new password via email.</p>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <button type="submit">Send Reset Link</button>
          </form>
        </div>
      </main>
      <footer> {/* This footer will stick to the bottom */}
        <p>Copyright 2024 by WeBite.Inc.</p>
      </footer>
    </div>
  );
}

export default ForgotPassword;