import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/UI/Header';
import Sidebar from './components/UI/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import PointsDisplay from './components/Points/PointsDisplay';
import PointsHistory from './components/Points/PointsHistory';
import Leaderboard from './components/Points/Leaderboard';
import BadgeDisplay from './components/Badges/BadgeDisplay';
import LearnifyApp from './components/Student/LearnifyApp';
import AuthSelector from './components/Auth/AuthSelector';
import TeacherRegister from './components/Auth/TeacherRegister';
import StudentRegister from './components/Auth/StudentRegister';
import ClassCreate from './components/Class/ManageClasses';
import Login from './components/Auth/Login';
//import { Dashboard } from './components/Auth/Dashboard'; Sample Dashboard for Specific User
import QuizWrapper from './components/Quiz/QuizWrapper';

import './App.css';
import ManageClasses from './components/Class/ManageClasses';
import EnrolledClasses from './components/Student/EnrolledClasses';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="loading-container">Loading...</div>;
  
  if (!currentUser) return <Navigate to="/login" />;
  
  return children;
};


const PointsPage = () => {
  return (
    <div className="points-page">
      <PointsDisplay />
      <PointsHistory />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <div className="content-container">
            <Sidebar />
            <main className="main-content">
            <Routes>
  <Route path="/" element={<AuthSelector />} />
  <Route path="/register/teacher" element={<TeacherRegister />} />
  <Route path="/register/student" element={<StudentRegister />} />
  <Route path="/class/create" element={
    <ProtectedRoute>
      <ClassCreate />
    </ProtectedRoute>
  } />

  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
  <Route path="/test" element={
    <ProtectedRoute>
      <LearnifyApp />
    </ProtectedRoute>
  } />
  <Route path="/points" element={
    <ProtectedRoute>
      <PointsPage />
    </ProtectedRoute>
  } />
  <Route path="/badges" element={
    <ProtectedRoute>
      <BadgeDisplay />
    </ProtectedRoute>
  } />
  <Route path="/leaderboard" element={
    <ProtectedRoute>
      <Leaderboard />
    </ProtectedRoute>
  } />
  <Route path="/quiz/:classId" element={
  <ProtectedRoute>
    <QuizWrapper />
  </ProtectedRoute>
} />


  

<Route path="/manageclasses" element={
    <ProtectedRoute>
      <ManageClasses />
    </ProtectedRoute>
  } />
  <Route path="/enrolledclasses" element={
    <ProtectedRoute>
      <EnrolledClasses />
    </ProtectedRoute>
  } />
  
  <Route path="*" element={<Navigate to="/" />} />
</Routes>

            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
