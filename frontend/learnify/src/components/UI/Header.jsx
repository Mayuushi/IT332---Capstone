import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="logo">
        <img src="/LearnifyLogo.png" alt="Learnify Logo" />
        <div className="logo-text">
          <h1>Learnify</h1>
          <p className="subheader">
            <span className="play">Play.</span>
            <span className="learn">Learn.</span>
            <span className="grow">Grow.</span>
          </p>
        </div>
      </div>
      {currentUser && (
        <div className="user-info">
          <span>Welcome, {currentUser.name}</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;