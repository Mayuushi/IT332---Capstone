import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import TitleScreen from './components/Lessons/TitleScreen';
import VisualNovelChapter1 from './components/Lessons/VisualNovelChapter1'
import VisualNovelChapter2 from './components/Lessons/VisualNovelChapter2'
import VisualNovelChapter3 from './components/Lessons/VisualNovelChapter3'
//import { Dashboard } from './components/Auth/Dashboard'; Sample Dashboard for Specific User
import QuizWrapper from './components/Quiz/QuizWrapper';
// import QuizForm from './components/Teacher/ManageQuizzes'; //managequiz like update delete
import Quiz from './components/Teacher/ManageQuizzes'; //create quiz
import QuizForm from './components/Teacher/QuizForm';
import QuizManager from './components/Teacher/QuizManager';
import NervousSystemLessonPicker from './components/Lessons/LessonPicker';
import TeacherDashboard from './components/Teacher/Dashboard';
import QuestionBankManager from './components/Teacher/QuestionBankManager';
import './App.css';
import ManageClasses from './components/Class/ManageClasses';
import EnrolledClasses from './components/Student/EnrolledClasses';
import ProgressReport from './components/Teacher/ProgressReport';
import TeacherOverview from './components/Teacher/TeacherOverview';
import PerformanceOverview from './components/Teacher/PerformanceOverview';
import Platformer from './components/Platformer/GameApp';
import TraceTheLineGame from './components/Lessons/TraceTheLineGame';
import ProfilePage from './components/Student/ProfilePage';

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

const AppInner = () => {
  const location = useLocation();
  const isAuthSelector = location.pathname === "/";
  const isRegister = location.pathname.startsWith("/register");
  const isLogin = location.pathname === "/login";
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <div className="content-container">
          <Sidebar />
          <main className={`main-content ${(isAuthSelector || isRegister || isLogin) ? 'full-bleed' : ''}`}>
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
                <Route path="/teacher-overview" element={
                  <ProtectedRoute>
                    <TeacherOverview />
                  </ProtectedRoute>
                } />
                <Route path="/question-bankmanager" element={
                  <ProtectedRoute>
                    <QuestionBankManager />
                  </ProtectedRoute>
                } />
                <Route path="/test" element={
                  <ProtectedRoute>
                    <LearnifyApp />
                  </ProtectedRoute>
                } />
                <Route path="/progressreport" element={
                  <ProtectedRoute>
                    <ProgressReport />
                  </ProtectedRoute>
                } />
                <Route path="/performance-overview" element={
                  <ProtectedRoute>
                    <PerformanceOverview />
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
                <Route path="/quizform" element={
                  <ProtectedRoute>
                    <QuizForm />
                  </ProtectedRoute>
                } />
                <Route path="/quiz" element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                } />
                <Route path="/quiz/:classId" element={
                  <ProtectedRoute>
                    <QuizWrapper />
                  </ProtectedRoute>
                } />
                <Route path="/quizmanager" element={
                  <ProtectedRoute>
                    <QuizManager />
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
                <Route path="/lessons/nervous-system" element={
                  <ProtectedRoute>
                    <TitleScreen />
                  </ProtectedRoute>
                } />
                <Route path="/lessons/nervous-system/play/chapter1" element={
                  <ProtectedRoute>
                    <VisualNovelChapter1 />
                  </ProtectedRoute>
                } />
                <Route path="/lessons/nervous-system/play/chapter2" element={
                  <ProtectedRoute>
                    <VisualNovelChapter2 />
                  </ProtectedRoute>
                } />
                <Route path="/lessons/nervous-system/play/chapter3" element={
                  <ProtectedRoute>
                    <VisualNovelChapter3 />
                  </ProtectedRoute>
                } />
                <Route path="/lessons" element={
                  <ProtectedRoute>
                    <NervousSystemLessonPicker />
                  </ProtectedRoute>
                } />
                <Route path="/platformer" element={
                  <ProtectedRoute>
                    <Platformer />
                  </ProtectedRoute>
                } />
                <Route path="/lessons/nervous-system/play/tracetheline" element={
                  <ProtectedRoute>
                    <TraceTheLineGame />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>

          </main>
        </div>
      </div>
    </AuthProvider>
  );
};

const App = () => (
  <Router>
    <AppInner />
  </Router>
);

export default App;
