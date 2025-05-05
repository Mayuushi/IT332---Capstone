import React from "react";
import { BookOpen, GraduationCap } from "lucide-react";
import '../../components/CSS/AuthSelector.css'
import { useNavigate } from "react-router-dom";

const AuthSelector = () => {
  const navigate = useNavigate();  // Use navigate directly

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome to LearnSphere</h1>
          <p>Join our community of learners and educators</p>
        </div>
        
        <div className="auth-content">
          <h2>I am a...</h2>
          
          <div className="role-selection">
            <button 
              onClick={() => navigate("/register/teacher")}  // Use navigate instead of navigateTo
              className="role-button"
            >
              <div className="icon-container">
                <BookOpen size={32} />
              </div>
              <span className="role-title">Teacher</span>
              <p className="role-description">Create courses and guide students</p>
            </button>
            
            <button 
              onClick={() => navigate("/register/student")}  // Use navigate instead of navigateTo
              className="role-button"
            >
              <div className="icon-container">
                <GraduationCap size={32} />
              </div>
              <span className="role-title">Student</span>
              <p className="role-description">Access courses and start learning</p>
            </button>
          </div>
        </div>
        
        <div className="auth-footer">
          <p>Already have an account? <button onClick={() => navigate("/login")} className="sign-in-button">Sign in</button></p>
        </div>
      </div>
    </div>
  );
};

export default AuthSelector;
