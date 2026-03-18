import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="sidebar">
      <Link to="/profile" className="profile profile-link">
        <div className="avatar">
          {currentUser.name.substring(0, 1).toUpperCase()}
        </div>
        <div className="user-details">
          <div className="name">{currentUser.name}</div>
          <div className="grade">Grade {currentUser.grade}</div>
        </div>
      </Link>
      
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
          <NavLink to="/teacher-overview" className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/manageclasses" className={({ isActive }) => isActive ? 'active' : ''}>
              Manage Classes
            </NavLink>
            <NavLink to="/progressreport" className={({ isActive }) => isActive ? 'active' : ''}>
              Visual Report
            </NavLink>
            <NavLink to="/performance-overview" className={({ isActive }) => isActive ? 'active' : ''}>
              Student Performance
            </NavLink>
            
            
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
