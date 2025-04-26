import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API base URL - change this to match your Spring Boot server
const API_BASE_URL = 'http://localhost:8080/api';

function LearnifyApp() {
  // State for various data
  const [students, setStudents] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentBadges, setStudentBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    grade: 0
  });
  
  const [pointsToAward, setPointsToAward] = useState({
    points: 10,
    activityType: 'LESSON_COMPLETION',
    activityId: 'lesson-1',
    description: 'Completed a lesson'
  });

  // Load initial data
  useEffect(() => {
    fetchStudents();
    fetchBadges();
  }, []);

  // Fetch all students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/students`);
      setStudents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  // Fetch all badges
  const fetchBadges = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/badges`);
      setBadges(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch badges');
      setLoading(false);
    }
  };

  // Select a student and fetch their badges
  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    try {
      const response = await axios.get(`${API_BASE_URL}/badges/student/${student.id}/all`);
      setStudentBadges(response.data);
    } catch (err) {
      setError('Failed to fetch student badges');
    }
  };

  // Create a new student
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/students`, newStudent);
      setStudents([...students, response.data]);
      setNewStudent({ name: '', email: '', grade: 0 });
      setLoading(false);
    } catch (err) {
      setError('Failed to create student');
      setLoading(false);
    }
  };

  // Award points to a student
  const handleAwardPoints = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/points/award`, {
        ...pointsToAward,
        studentId: selectedStudent.id
      });
      
      // Refresh student data to see updated points
      const studentResponse = await axios.get(`${API_BASE_URL}/students/${selectedStudent.id}`);
      setSelectedStudent(studentResponse.data);
      
      // Check if any new badges were earned
      const badgesResponse = await axios.get(`${API_BASE_URL}/badges/student/${selectedStudent.id}/all`);
      setStudentBadges(badgesResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to award points');
      setLoading(false);
    }
  };

  // Award a badge directly to a student
  const handleAwardBadge = async (badgeId) => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/badges/award/${selectedStudent.id}/${badgeId}`);
      
      // Refresh student badges
      const badgesResponse = await axios.get(`${API_BASE_URL}/badges/student/${selectedStudent.id}/all`);
      setStudentBadges(badgesResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to award badge');
      setLoading(false);
    }
  };

  // Handle form input changes for new student
  const handleStudentInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: name === 'grade' ? parseInt(value, 10) : value
    });
  };

  // Handle form input changes for points
  const handlePointsInputChange = (e) => {
    const { name, value } = e.target;
    setPointsToAward({
      ...pointsToAward,
      [name]: name === 'points' ? parseInt(value, 10) : value
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Learnify Gamification Test App</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Create Student Form */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Create New Student</h2>
          <form onSubmit={handleCreateStudent}>
            <div className="mb-2">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={newStudent.name}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={newStudent.email}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Grade</label>
              <input
                type="number"
                name="grade"
                value={newStudent.grade}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Student'}
            </button>
          </form>
        </div>
        
        {/* Student List */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Students</h2>
          {students.length === 0 ? (
            <p>No students found</p>
          ) : (
            <ul className="divide-y">
              {students.map(student => (
                <li 
                  key={student.id} 
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedStudent?.id === student.id ? 'bg-blue-100' : ''}`}
                  onClick={() => handleSelectStudent(student)}
                >
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-600">{student.email}</div>
                  <div className="text-sm">Points: {student.totalPoints} | Level: {student.level}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Selected Student Details */}
        {selectedStudent && (
          <>
            {/* Award Points Form */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Award Points to {selectedStudent.name}</h2>
              <form onSubmit={handleAwardPoints}>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Points</label>
                  <input
                    type="number"
                    name="points"
                    value={pointsToAward.points}
                    onChange={handlePointsInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Activity Type</label>
                  <select
                    name="activityType"
                    value={pointsToAward.activityType}
                    onChange={handlePointsInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="QUIZ_COMPLETION">Quiz Completion</option>
                    <option value="LESSON_COMPLETION">Lesson Completion</option>
                    <option value="DAILY_LOGIN">Daily Login</option>
                    <option value="HOMEWORK_SUBMISSION">Homework Submission</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Activity ID</label>
                  <input
                    type="text"
                    name="activityId"
                    value={pointsToAward.activityId}
                    onChange={handlePointsInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={pointsToAward.description}
                    onChange={handlePointsInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white p-2 rounded"
                  disabled={loading}
                >
                  {loading ? 'Awarding...' : 'Award Points'}
                </button>
              </form>
            </div>
            
            {/* Student Badges */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{selectedStudent.name}'s Badges</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {studentBadges.map(badge => (
                  <div 
                    key={badge.id} 
                    className={`p-2 border rounded text-center ${badge.earnedAt ? 'bg-yellow-100' : 'bg-gray-100'}`}
                  >
                    <div className="font-medium">{badge.name}</div>
                    <div className="text-xs">{badge.description}</div>
                    {badge.earnedAt ? (
                      <div className="text-xs text-green-600 mt-1">
                        Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAwardBadge(badge.id)}
                        className="mt-1 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                        disabled={loading}
                      >
                        Award Badge
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Available Badges */}
        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Available Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {badges.map(badge => (
              <div key={badge.id} className="p-2 border rounded text-center">
                <div className="font-medium">{badge.name}</div>
                <div className="text-xs">{badge.description}</div>
                <div className="text-xs mt-1">Points: {badge.requiredPoints}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnifyApp;