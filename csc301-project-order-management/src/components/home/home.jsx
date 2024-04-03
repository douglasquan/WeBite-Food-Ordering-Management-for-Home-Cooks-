import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar.jsx";
import logo from "./logo.png";
import "./input.css";
import backgroundImage from "./background.jpg";
import { getReq, postReq } from "../view_control";

function Home() {
  const [user, setUser] = useState(null);

  const logoutUser = async () => {
    await postReq("user/logout");
    setUser(null); // Clear user state
    // Using reload to refresh the page and clear state
    window.location.reload();
    // window.location.href = "/";
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await getReq("user/@me");
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, []);
  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      {user !== null && <Navbar />}
      {/* Hero Section */}
      {user ? (
        <div>
          <h1>Welcome, {user.email}!</h1>
          <button onClick={logoutUser}>Logout</button>
          {/* Main Content Section */}
          <div className='relative text-white text-center py-36 px-12'>
            <div
              className='absolute inset-0 bg-cover bg-center opacity-25'
              style={{ backgroundImage: `url(${backgroundImage})`, backdropFilter: "blur(0px)" }}
            ></div>
            <img src={logo} alt='Logo' className='mx-auto mb-4 w-48 h-auto' />
            <h1 className='text-4xl font-bold'>Connecting Chefs and Customers Worldwide</h1>
          </div>
        </div>
      ) : (
        <div>
          <p>You are not logged in</p>
          <div>
            <a href='/login'>
              <button>Login</button>
            </a>
            <a href='/register'>
              <button>Register</button>
            </a>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className='bg-white'>
        <p className='text-center text-sm text-gray-600 py-4'>Copyright © 2024 by WeBite.Inc.</p>
      </footer>
    </div>
  );
}

export default Home;
