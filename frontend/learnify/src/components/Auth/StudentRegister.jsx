import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';

const StudentRegister = () => {
  const [student, setStudent] = useState({
    name: '',
    email: '',
    grade: ''
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
        grade: parseInt(student.grade)
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
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Student Registration</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={student.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={student.email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="grade"
          placeholder="Grade (4 or 5)"
          value={student.grade}
          onChange={handleChange}
          required
          min="4"
          max="5"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default StudentRegister;
