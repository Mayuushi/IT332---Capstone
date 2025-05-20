import axios from "axios";

const API_URL = "http://localhost:8080/api/classes";

// Create a new class
const createClass = async (classData) => {
  const res = await axios.post(API_URL, classData);
  return res.data;
};

// Get all classes
const getAllClasses = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Get classes by student ID with related user data (students and teacher)
const getClassesByStudentIdWithUsers = async (studentId) => {
  const res = await axios.get(`${API_URL}/student/${studentId}/with-users`);
  return res.data;
};

// Update an existing class
const updateClass = async (id, updatedData) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedData);
  return res.data;
};

// Delete a class
const deleteClass = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

// Get classes by student ID (without user data)
const getClassesByStudentId = async (studentId) => {
  const res = await axios.get(`${API_URL}/student/${studentId}`);
  return res.data;
};

// Get classes by teacher ID (without students)
const getClassesByTeacherId = async (teacherId) => {
  const res = await axios.get(`${API_URL}/teacher/${teacherId}`);
  return res.data;
};

// **New: Get classes by teacher ID with enrolled students**
const getClassesByTeacherIdWithStudents = async (teacherId) => {
  const res = await axios.get(`${API_URL}/teacher/${teacherId}/with-students`);
  return res.data;
};

const classService = {
  createClass,
  getAllClasses,
  getClassesByStudentIdWithUsers,
  getClassesByStudentId,
  getClassesByTeacherId,
  getClassesByTeacherIdWithStudents, // New method here
  updateClass,
  deleteClass,
};

export default classService;
