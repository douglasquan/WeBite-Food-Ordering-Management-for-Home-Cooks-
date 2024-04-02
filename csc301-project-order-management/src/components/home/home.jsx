import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar.jsx";
import logo from "./static/logo.png";
import backgroundImage from "./static/home_page_hero.jpg";
import home_page_hero from "./static/home_page_hero.jpg";
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
    <div className='flex flex-col min-h-screen'>
      {user !== null && <Navbar />}

      <div
        className='relative pt-6 pb-16 sm:pb-24'
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover" }}
      >
        <div className='absolute inset-0 bg-white opacity-50'></div>

        {user ? (
          <div className='relative px-4 pt-6 pb-16 sm:pb-24'>
            <div className='text-center'>
              <img src={logo} alt='Logo' className='mx-auto w-48 h-auto' />
              <h1 className='mt-2 text-4xl font-extrabold leading-tight text-black'>
                Welcome, {user.username}!
              </h1>
              <button
                onClick={logoutUser}
                className='mt-6 w-auto bg-red-600 text-white px-4 py-2 rounded-md text-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className='relative px-4 pt-6 pb-16 sm:pb-24'>
            <div className='text-center'>
              <h2 className='text-2xl font-extrabold text-white tracking-tight sm:text-4xl'>
                You are not logged in
              </h2>
              <div className='mt-10 max-w-md mx-auto'>
                <div className='flex flex-wrap justify-center gap-4'>
                  <Link
                    to='/login'
                    className='block w-full px-4 py-2 rounded bg-blue-600 text-white font-medium text-center hover:bg-blue-700'
                  >
                    Login
                  </Link>
                  <Link
                    to='/register'
                    className='block w-full px-4 py-2 rounded bg-green-600 text-white font-medium text-center hover:bg-green-700'
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className='bg-gray-800'>
        <p className='text-center text-sm text-gray-300 py-4'>
          Copyright © 2024 by WeBite.Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
