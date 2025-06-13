import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Header = () => {
  return (
    <header>
      <div className="header-container">
        <h1><Link to="/" className="logo-link">Movie FLEx</Link></h1>
        <nav className="nav-links">
          <Link to="/help" className="nav-link">Help</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
