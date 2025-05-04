import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import teacherService from "../../services/teacherService";

const TeacherRegister = () => {
  const [teacher, setTeacher] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate(); // useNavigate hook to redirect after registration

  const handleChange = (e) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the teacher data to backend for registration
      const result = await teacherService.createTeacher(teacher);
      alert("Teacher registered with ID: " + result.id);
      
      // Redirect to login page after successful registration
      navigate("/login"); 
    } catch (error) {
      alert("Error registering teacher: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Teacher Registration</h2>
      <input 
        type="text" 
        name="name" 
        placeholder="Name" 
        onChange={handleChange} 
        required 
      />
      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        onChange={handleChange} 
        required 
      />
      <input 
        type="password" 
        name="password" 
        placeholder="Password" 
        onChange={handleChange} 
        required 
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default TeacherRegister;
