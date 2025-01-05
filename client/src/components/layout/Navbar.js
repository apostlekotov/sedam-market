import React from 'react';
import { NavLink, Link } from 'react-router-dom';

function Navbar() {
  return (
    <header>
      <div>
        <Link to='/' className='logo'>
          <img src='/img/logo/sedam-logo-2024.svg' alt='Sedam Market Logo' />
        </Link>

        <input type='checkbox' id='onoff' />
        <label htmlFor='onoff'>
          <i className='fas fa-bars'></i>
        </label>

        <nav>
          <NavLink to='/about'>Про нас</NavLink>
          <NavLink to='/sales'>Акції</NavLink>
          <NavLink to='/work'>Робота в "Седам"</NavLink>
          <a href='#contacts'>Контакти</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
