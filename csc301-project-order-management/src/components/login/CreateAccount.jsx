import React, { useState } from "react";

import "./style.css"; // Assuming a single CSS file for all components
import Navbar from "../navbar/Navbar.jsx";
import { postReq } from "../view_control.js";

const RegisterAccount = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [role, setRole] = useState(""); // New state for role

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    // Ensure a role is selected
    if (!role) {
      alert("Please select a role.");
      return;
    }

    try {
      // Step 1: Create the user
      const userData = { username, email, password };
      const userResp = await postReq("user/register", userData); // Adjust endpoint as needed

      if (userResp && userResp.status === 200) {
        // Assuming the response includes the user ID
        const user_id = userResp.data.user_id; // Adjust based on actual response structure

        // Additional data that might be specific to chefs or customers
        // can be included here. For simplicity, we are just using user_id.

        // Step 2: Create the chef or customer profile based on the selected role
        if (role === "chef" || role === "customer") {
          const profileData = { user_id };
          const profileResp = await postReq(`user/${role}`, profileData); // Use the role in the URL

          if (profileResp && profileResp.status === 200) {
            // Profile created successfully
            window.location.href = "/"; // Redirect to homepage or dashboard
          } else {
            // Handle error in profile creation
            alert(`${role.charAt(0).toUpperCase() + role.slice(1)} profile creation failed.`);
          }
        } else {
          // Handle other roles if necessary
          window.location.href = "/";
        }
      } else {
        // Handle user creation failure
        alert("User registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <Navbar />
      <main className='flex flex-grow items-center justify-center bg-custom-grey'>
        <div className='w-full max-w-md p-8 bg-white shadow-md rounded'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <h2 className='text-2xl font-bold mb-4 text-center'>Create Account</h2>
            {/* Username, Email, Password Inputs */}
            <div className='form-group mb-4'>
              <label htmlFor='username' className='block text-gray-700 text-sm font-bold mb-2'>
                Username:
              </label>
              <input
                type='text'
                id='username'
                required
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='form-group mb-4'>
              <label htmlFor='email' className='block text-gray-700 text-sm font-bold mb-2'>
                Email:
              </label>
              <input
                type='email'
                id='email'
                required
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='form-group mb-4'>
              <label htmlFor='password' className='block text-gray-700 text-sm font-bold mb-2'>
                Password:
              </label>
              <input
                type='password'
                id='password'
                required
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='form-group mb-4'>
              <label
                htmlFor='confirmPassword'
                className='block text-gray-700 text-sm font-bold mb-2'
              >
                Confirm Password:
              </label>
              <input
                type='password'
                id='confirmPassword'
                required
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Role Selection */}
            <div className='form-group mb-4'>
              <label htmlFor='role' className='block text-gray-700 text-sm font-bold mb-2'>
                Role:
              </label>
              <select
                id='role'
                required
                className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                onChange={(e) => setRole(e.target.value)}
              >
                <option value=''>Select your role</option>
                <option value='chef'>Chef</option>
                <option value='customer'>Customer</option>
              </select>
            </div>

            {/* Confirm Password Input */}
            {!passwordsMatch && (
              <p className='text-red-500 text-sm text-center'>Passwords do not match</p>
            )}
            <button
              type='submit'
              className='bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full'
            >
              Create Account
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterAccount;
