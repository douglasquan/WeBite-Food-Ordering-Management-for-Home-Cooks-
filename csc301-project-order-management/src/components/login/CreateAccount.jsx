import React, { useState } from 'react';

import './style.css'; // Assuming a single CSS file for all components
import Navbar from "../navbar/Navbar.jsx"
import { postReq } from "../view_control.js";

function CreateAccount() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  
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
    }
    // create user
    const name = "John doe";
    const phone_num = 1234567890;
    const data = {"name": name, "phone_num": phone_num, "email": email, "password": password};
    postReq("chef", data);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100"> 
      <Navbar />
      <main className="flex flex-grow items-center justify-center bg-custom-grey">
        <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
          <form id="createAccountForm" onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
            <div className="form-group mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input type="email" id="email" name="email" required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
              <input type="password" id="password" name="password" required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>
            {!passwordsMatch && showPasswordMismatchMessage && 
              <p className="text-red-500 text-sm text-center">Passwords do not match</p>}
            <button type="submit" 
              className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Create Account
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateAccount;
