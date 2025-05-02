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
import Quiz from './components/Quiz/Quiz';  // Import the Quiz component
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="loading-container">Loading...</div>;
  
  if (!currentUser) return <Navigate to="/login" />;
  
  return children;
};

// Login page component (simplified for demo)
const Login = () => {
  const { login } = useAuth();
  
  const handleLogin = () => {
    // Mock user data - in a real app, this would come from an API
    const userData = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      grade: '5'
    };
    
    login(userData);
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to Learnify</h2>
        <p>Log in to track your learning progress</p>
        <button className="login-button" onClick={handleLogin}>
          Login as Student
        </button>
      </div>
    </div>
  );
};

// Points page component that combines PointsDisplay and PointsHistory
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
                <Route path="/quiz/:quizId" element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
