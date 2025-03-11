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
      <Link to="/video-call">Video Call</Link>
      </div>
    </div>
    </div>
  );
}

export default Navbar;
