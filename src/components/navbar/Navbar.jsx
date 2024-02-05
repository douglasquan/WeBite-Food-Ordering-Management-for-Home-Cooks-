import React from 'react';
import './NavBar.css';

const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='nav-title'>
        WeBite
      </div>
      <div className='nav-links'>
        <ul>
          <li>
            <a class="active" href="Home">Home</a>
          </li>
          <li>
            <a href="Chef">Chef</a>
          </li>
          <li>
            <a href="Customer">Customer</a>
          </li>
          <li>
            <a href="Login">Login</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;