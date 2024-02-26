import React from 'react';
import logoImage from './logo1.png'

const Navbar = () => {
  return (
    <nav className="bg-white shadow" style={{ paddingLeft: '0px', height: '70px' }}>
      <div className="container mx-auto py-1 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center">
        <div>
            {/* Logo Image */}
            <a href="#" className="p-0">
              <img src={logoImage} alt="Logo" className="h-10 w-auto sm:h-10" />
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button type="button" className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600" aria-label="toggle menu">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path fillRule="evenodd" d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu open: "block", Menu closed: "hidden" */}
        <div className="items-center md:flex">
          <div className="flex flex-col md:flex-row md:mx-6">
            <a className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0" href="Home">Home</a>
            <a className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0" href="Chef">Chef</a>
            <a className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0" href="Customer">Customer</a>
            <a className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0" href="Login">Login</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;