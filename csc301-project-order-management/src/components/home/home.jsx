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
          <div className='flex-grow flex flex-wrap md:flex-nowrap justify-center md:justify-between items-start p-4'>
            {/* Chef Container on the left */}
            <div className='w-full md:w-1/2 p-4'>
              <div className='bg-gray-400 text-white m-2 rounded-lg p-4'>
                <h2 className='text-2xl font-bold mb-4'>CHEF CONTAINER</h2>
                <div className='grid grid-cols-4 gap-4'>
                  <Link
                    to='/chef'
                    className='bg-white rounded shadow p-4 block text-center'
                    href='Chef'
                  >
                    Chef 1
                  </Link>
                  <Link
                    to='/chef'
                    className='bg-white rounded shadow p-4 block text-center'
                    href='Chef'
                  >
                    Chef 2
                  </Link>
                  <Link
                    to='/chef'
                    className='bg-white rounded shadow p-4 block text-center'
                    href='Chef'
                  >
                    Chef 3
                  </Link>
                  <Link
                    to='/chef'
                    className='bg-white rounded shadow p-4 block text-center'
                    href='Chef'
                  >
                    Chef 4
                  </Link>
                </div>
              </div>
            </div>
            {/* Customer Container on the right */}
            <div className='w-full md:w-1/2 p-4'>
              <div className='bg-gray-400 text-white m-2 rounded-lg p-4'>
                <h2 className='text-2xl font-bold mb-4'>CUSTOMER CONTAINER</h2>
                <div className='grid grid-cols-4 gap-4'>
                  <Link
                    to='/customer'
                    className='bg-white rounded shadow p-4 block text-center'
                    href='Customer'
                  >
                    Customer 1
                  </Link>
                  <Link
                    to='/customer'
                    className='bg-white rounded shadow p-4 block text-center'
                    href='Customer'
                  >
                    Customer 2
                  </Link>
                  <Link
                    to='/customer'
                    className='bg-white rounded shadow p-4 block text-center'
                    href='Customer'
                  >
                    Customer 3
                  </Link>
                  <Link
                    to='/customer'
                    className='bg-white rounded shadow p-4 block text-center'
                    href='Customer'
                  >
                    Customer 4
                  </Link>
                </div>
              </div>
            </div>
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
