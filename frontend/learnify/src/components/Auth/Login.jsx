import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

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
      if (role === 'teacher') {
        res = await axios.get(`http://localhost:8080/api/teachers`);
        const user = res.data.find(u => u.email === email && u.password === password);
        if (!user) throw new Error();
        login({ ...user, isTeacher: true });
      } else {
        res = await axios.get(`http://localhost:8080/api/students/email/${email}`);
        const user = res.data;
        if (!user || user.password !== password) throw new Error();
        login({ ...user, isTeacher: false });
      }

      navigate('/dashboard');
    } catch (err) {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login to Learnify</h2>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
