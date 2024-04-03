import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar.jsx";
import logo from "./static/logo.png";
import delivery from "./static/food_delivery.jpg";
import home_page_hero from "./static/background1.jpg";
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
      {user && <Navbar />}
      {user ? (
        <div
          className='relative h-[500px] bg-no-repeat bg-center bg-cover'
          style={{ backgroundImage: `url(${home_page_hero})` }}
        >
          <div className='text-center py-36'>
            <img src={logo} alt='Logo' className='mx-auto w-48 h-auto' />
            <div>
              <h1 className='text-4xl font-extrabold leading-tight text-black'>
                Welcome, {user.username}!
              </h1>
              <button
                onClick={logoutUser}
                className='mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='relative px-4 pt-6 pb-16 sm:pb-24'>
          <div class='bg-neutral-50 px-6 py-12 text-center dark:bg-neutral-900 md:px-12 lg:text-left'>
            <div class='w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl'>
              <div class='grid items-center gap-12 lg:grid-cols-2'>
                <div class='mt-12 lg:mt-0'>
                  <img src={logo} alt='Logo' className='mx-auto w-48 h-auto' />
                  <h1 class='mt-2 mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl'>
                    Taste like <br />
                    <span class='text-[#0284c7]'>Home</span>
                  </h1>
                  <Link
                    to='/login'
                    class='bg-[#0284c7] hover:bg-[#0284c7] text-white font-bold py-2 px-4 rounded-full'
                  >
                    Get started
                  </Link>
                </div>
                <div class='mb-12 lg:mb-0'>
                  <img
                    src={delivery}
                    class='w-full rounded-lg shadow-lg dark:shadow-black/20'
                    alt=''
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <footer className='bg-gray-800  bottom-0 w-full'>
        <p className='text-center text-sm text-gray-300 py-4'>
          Copyright © 2024 by WeBite.Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
