import React, { useState } from 'react';

import { multiGetReq } from "../view_control.js";

function LoginForm({ onLogin }) {
  let uid = useState('');
  let custid = useState('');
  let chefid = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    const name = "John doe";
    const data = {"username": name, "email": email, "password": password};
    const url = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    let response = await multiGetReq("user", url);
    if (response !== "invalid user"){
        uid = response['uid'];
        custid = response['custid'];
        chefid = response['chefid'];
        onLogin({ uid, custid, chefid, email, password });
        console.log("User in database");
    } else {
        console.log("User not in database");
    };
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email address
          </label>
          <input
              id="email"
              type="email"
              placeholder="Email address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              onChange={(e) => setPassword(e.target.value)}
          />
      </div>
      <div className="flex flex-col items-center justify-between">
          <button
              type="submit"
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
  );
}

export default LoginForm;
