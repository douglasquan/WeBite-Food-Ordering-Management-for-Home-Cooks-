import React, { useState } from 'react';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <form id="loginForm" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="form-group">
              <label htmlFor="email">Email/Username:</label>
              <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Login</button>
            <div className="helper-links">
              <a href = "forgot-password" className="forgot-password">Forgot Password?</a>
              <button type="button" className="create-account-btn">
                <a href = "/create-account"className= "create-account-btn"> Create Account </a>
              </button>
            </div>
          </form>
  );
}

export default LoginForm;
