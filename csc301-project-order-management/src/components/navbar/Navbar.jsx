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
          <li className='nav-element'>
            <a id="link" class="active" href="..\">Home</a>
          </li>
          <li className='nav-element'>
            <a id="link" href="Login">Login</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;