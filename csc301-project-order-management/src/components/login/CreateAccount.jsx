import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Assuming a single CSS file for all components

function CreateAccount() {
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