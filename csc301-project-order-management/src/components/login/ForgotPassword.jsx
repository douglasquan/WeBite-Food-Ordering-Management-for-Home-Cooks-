
import React from 'react';

import './input.css'; // Assuming a single CSS file for all components
import Navbar from "../navbar/Navbar.jsx"

function ForgotPassword() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100"> 
      <Navbar />
      <main className="flex flex-grow items-center justify-center bg-custom-grey">
        <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
          <form id="forgetPasswordForm" method="POST" className="space-y-6">
            <h2 className="text-2xl font-bold mb-2 text-center">Forget Password</h2>
            <p>Please enter your email address. You will receive a link to create a new password via email.</p>
            <div className="form-group">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input type="email" id="email" name="email" required 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <button type="submit" 
              className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Send Reset Link
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;