import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './style.css'; // Ensure this is the correct path to your CSS file
import Navbar from "../navbar/Navbar.jsx"

import LoginForm from './LoginForm';

function Login() {
  let navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (userData) => {
    navigate('/Login');
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="wrapper"> 
      <Navbar />
      <main>
        <div className="form-container">
        {user ? (
        <div>
          <h1>Welcome, {user.email}!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
        </div>
      </main>
      <footer> {/* This footer will stick to the bottom */}
        <p>Copyright 2024 by WeBite.Inc.</p>
      </footer>
    </div>
  );
}

export default Login;
