
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Assuming a single CSS file for all components

function ForgotPassword() {
  let navigate = useNavigate();

  const handleLogin = (event) => {
    navigate('/Login');
  };

  return (
    <div className="wrapper"> 
      <header>
        <nav>
          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Food Group</a></li>
            <li><a href="#">Finance</a></li>    
          </ul>
          <button className="login-btn" onClick={handleLogin}>Login</button>
        </nav>
      </header>
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