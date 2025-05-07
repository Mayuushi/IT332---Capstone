import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="sidebar">
      <div className="profile">
        <div className="avatar">
          {currentUser.name.substring(0, 1).toUpperCase()}
        </div>
        <div className="user-details">
          <div className="name">{currentUser.name}</div>
          <div className="grade">Grade {currentUser.grade}</div>
        </div>
      </div>
      
      <nav className="nav-menu">
        {!currentUser.isTeacher && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/points" className={({ isActive }) => isActive ? 'active' : ''}>
              My Points
            </NavLink>
            <NavLink to="/badges" className={({ isActive }) => isActive ? 'active' : ''}>
              Badges
            </NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'active' : ''}>
              Leaderboard
            </NavLink>
            <NavLink to="/lessons" className={({ isActive }) => isActive ? 'active' : ''}>
              Lessons
            </NavLink>
            <NavLink to="/enrolledclasses" className={({ isActive }) => isActive ? 'active' : ''}>
              Enrolled Classes
            </NavLink>
          </>
        )}

        {currentUser.isTeacher && (
          <>
            <NavLink to="/manageclasses" className={({ isActive }) => isActive ? 'active' : ''}>
              Manage Classes
            </NavLink>
            <NavLink to="/quizmanager" className={({ isActive }) => isActive ? 'active' : ''}>
              Manage Quizzes
            </NavLink>
            <NavLink to="/quiz" className={({ isActive }) => isActive ? 'active' : ''}>
              Gradebook
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
