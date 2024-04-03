import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImage from "./logo1.png";
import { Collapse, Ripple, initTWE } from "tw-elements";
import { getReq, postReq } from "../view_control";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Track user login state

  useEffect(() => {
    (async () => {
      try {
        const resp = await getReq("user/@me");
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
        setUser(null); // Ensure user is set to null if not authenticated
      }
    })();
  }, []);

  // Initialize tw-elements functionalities
  initTWE({ Collapse, Ripple });

  const logoutUser = async () => {
    await postReq("user/logout");
    setUser(null); // Clear user state
    window.location.href = "/";
  };

  return (
    <nav class='container flex items-center py-2 mt-2 sm:mt-12'>
      <div class='py-1'>
        <Link to='/home' className='p-0'>
          <img src={logoImage} alt='Logo' className='h-20 w-auto sm:h-20' />
        </Link>
      </div>

      <div className='flex w-full flex-wrap items-center justify-between px-3'>
        <div className='flex items-center'>
          <button
            className='border-0 bg-transparent px-2 text-xl leading-none hover:text-neutral-700 focus:text-neutral-700 lg:hidden'
            type='button'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls='navbarSupportedContentX'
            aria-expanded={isMenuOpen}
            aria-label='Toggle navigation'
          >
            <span className='[&>svg]:h-7 [&>svg]:w-7 [&>svg]:stroke-black/50'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        {/* Conditionally render "Login" link only when user is not logged in */}
        {!user ? (
          <div className='flex justify-end' id='navbarSupportedContentX'>
            <ul className='flex items-center gap-12 uppercase text-s'>
              <li>
                <Link
                  to='/login'
                  className='text-black/60 transition duration-200 hover:text-black/80'
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div
            className={`${isMenuOpen ? "block" : "hidden"} grow basis-full lg:flex lg:basis-auto`}
            id='navbarSupportedContentX'
            style={{ justifyContent: "flex-end" }}
          >
            <ul class='hidden sm:flex flex-1 justify-end items-center gap-12  uppercase text-s'>
              <li className='mb-4 lg:mb-0 lg:mx-2'>
                <Link
                  className='block text-black/60 transition duration-200 hover:text-black/80 lg:px-2'
                  to='/home'
                >
                  Home
                </Link>
              </li>
              <li className='mb-4 lg:mb-0 lg:mx-2'>
                <Link
                  className='block text-black/60 transition duration-200 hover:text-black/80 lg:px-2'
                  to='/menu'
                >
                  Order
                </Link>
              </li>
              <li className='mb-4 lg:mb-0 lg:mx-2'>
                <Link
                  className='block text-black/60 transition duration-200 hover:text-black/80 lg:px-2'
                  to='/review'
                >
                  Review
                </Link>
              </li>
              <li className='mb-4 lg:mb-0 lg:mx-2'>
                <Link
                  className='block text-black/60 transition duration-200 hover:text-black/80 lg:px-2'
                  to='/summary'
                >
                  Summary
                </Link>
              </li>
              <li className='mb-4 lg:mb-0 lg:mx-2'>
                {user ? (
                  <button
                    onClick={logoutUser}
                    className='block text-black/60 transition duration-200 hover:text-black/80 lg:px-2 cursor-pointer'
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    className='block text-black/60 transition duration-200 hover:text-black/80 lg:px-2'
                    to='/login'
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
