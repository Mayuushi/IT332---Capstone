import React, { useState } from "react";
import teacherService from "../../services/teacherService";
import { useNavigate } from "react-router-dom";
import '../../components/CSS/Register.css';

const TeacherRegister = () => {
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await teacherService.createTeacher(teacher);
      const userWithRole = { ...result, isTeacher: true };
      localStorage.setItem("user", JSON.stringify(userWithRole));
      navigate("/dashboard");
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register teacher');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Teacher Registration</h2>
          <p>Create an account to manage courses and students</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Enter your full name" 
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
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Create a password" 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <button type="submit" className="register-button">Create Teacher Account</button>
        </form>
        
        <div className="login-link">
          Already have an account? <span onClick={() => navigate('/login')}>Log in</span>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;