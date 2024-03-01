import './input.css';
import React, { useState, useEffect } from 'react';
// Ensure Tailwind CSS is correctly imported in your project setup
import Navbar from "../navbar/Navbar.jsx";
import backgroundImage from './background.jpg';

import LoginForm from './LoginForm';

function Login() {
  const [user, setUser] = useState(null);
    
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = async (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };


    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex flex-grow">
                <div className="w-2/3 flex items-center justify-center p-12 bg-custom-grey">
                    <div className="w-full max-w-md">
                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <h2 className="text-2xl font-bold mb-8 text-center">Welcome.</h2>
                            {user ? (
                                <div>
                                    <h1>Welcome, {user.email}!</h1>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                                ) : (
                                <LoginForm onLogin={handleLogin} />
                                )}
                            </div>
                        </div>
                    </div>
                <div className="hidden lg:block lg:w-1/2" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}>
                </div>
            </div>
        </div>
    );
};

export default Login;