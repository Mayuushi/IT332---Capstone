import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import '../../components/CSS/Register.css';

const StudentRegister = () => {
  const [student, setStudent] = useState({
    name: '',
    email: '',
    grade: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await studentService.registerStudent({
        name: student.name,
        email: student.email,
        grade: parseInt(student.grade),
        password: student.password
      });

      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register student');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Student Registration</h2>
          <p>Join our learning platform to access courses and materials</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={student.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={student.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="grade">Grade Level</label>
            <select
              id="grade"
              name="grade"
              value={student.grade}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select your grade</option>
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={student.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="register-button">Create Account</button>
        </form>
        
        <div className="login-link">
          Already have an account? <span onClick={() => navigate('/login')}>Log in</span>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;