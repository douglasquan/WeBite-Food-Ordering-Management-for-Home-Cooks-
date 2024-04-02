import React, { useState } from "react";
import { Link } from "react-router-dom"; // Add this line
import logoImage from "./logo1.png";
import { Collapse, Ripple, initTWE } from "tw-elements";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initialize tw-elements functionalities
  initTWE({ Collapse, Ripple });

  return (
    <header>
      <nav className='relative flex w-full items-center justify-between bg-white py-2 shadow-md lg:flex-wrap lg:justify-start lg:py-4'>
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
            <Link to='/home' className='p-0'>
              <img src={logoImage} alt='Logo' className='h-10 w-auto sm:h-10' />
            </Link>
          </div>
          {/* Navigation Links */}
          <div
            className={`${isMenuOpen ? "block" : "hidden"} grow basis-full lg:flex lg:basis-auto`}
            id='navbarSupportedContentX'
          >
            <ul className='me-auto flex flex-col items-center lg:flex-row lg:mx-6'>
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
                <Link
                  className='block text-black/60 transition duration-200 hover:text-black/80 lg:px-2'
                  to='/login'
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
