import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../components/CSS/Login.css'
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const navigate = useNavigate();
  const { login } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let res;
    let user;

    if (role === 'teacher') {
      res = await axios.get(`http://localhost:8080/api/teachers`);
      user = res.data.find(u => u.email === email && u.password === password);
      if (!user) throw new Error();
      login({ ...user, isTeacher: true });
      navigate('/teacher-dashboard'); // redirect teacher
    } else {
      res = await axios.get(`http://localhost:8080/api/students/email/${email}`);
      user = res.data;
      if (!user || user.password !== password) throw new Error();
      login({ ...user, isTeacher: false });
      navigate('/dashboard'); // redirect student
    }
  } catch (err) {
    alert('Invalid email or password');
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Login to Learnify</h2>
          <p>Access your personalized learning experience</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="role">Select your role</label>
            <div className="input-wrapper">
              <select 
                id="role"
                className="form-control"
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                id="email"
                className="form-control"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <div className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                className="form-control"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <div className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="forgot-password">
            <a href="#reset-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="register">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;