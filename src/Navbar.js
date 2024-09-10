import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Navbar({ handleLeaveChat }) {
  return (
    <div>
        <div className="chat-app">
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      
      </div>
    </div>
    </div>
  );
}

export default Navbar;
