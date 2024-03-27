import React, { useState } from 'react';

import { postReq } from "../view_control.js";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logInUser = async () => {
    console.log(email, password);

    try {
        const resp = await postReq("user/login", { email, password }, { credentials: 'include' });
      if (resp && resp.status === 200) {
              console.log(email);
        // window.location.href = "/";
      } else {
        // Handle non-200 responses if needed
        alert("Login failed");
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response && error.response.status === 401) {
        alert("Invalid credentials");
      } else {
        // General error alert for other types of errors
        alert("An error occurred during login.");
      }
    }
  };

  return (
      <div className="flex flex-col items-center justify-center">
          <form className="w-full max-w-xs">
              <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                      Email address
                  </label>
                  <input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
              </div>
              <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                      Password
                  </label>
                  <input
                      id="password"
                      type="password"
                      placeholder="Password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
              </div>
              <div className="flex flex-col items-center justify-between">
                  <button
                      type="button"
                      onClick={() => logInUser()}
                      className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-3"
                  >
                      Log In
                  </button>
                  <a
                      className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 mb-2"
                      href="/forgot-password"
                  >
                      Forgot password?
                  </a>
                  <a
                      className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                      href="/create-account"
                  >
                      Register here
                  </a>
              </div>
          </form>
      </div>
  );
}

export default LoginForm;
