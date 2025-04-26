import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="logo">
        <img src="/logo.png" alt="Learnify Logo" />
        <h1>Learnify</h1>
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