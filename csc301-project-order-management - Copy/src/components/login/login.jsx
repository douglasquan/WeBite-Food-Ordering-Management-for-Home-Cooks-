import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Ensure this is the correct path to your CSS file

function Login() {
  let navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/create-account');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

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
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
        </nav>
      </header>
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
              <a onClick={handleForgotPassword} className="forgot-password">Forgot Password?</a>
              <button type="button" className="create-account-btn" onClick={handleCreateAccount}>Create Account</button>
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
