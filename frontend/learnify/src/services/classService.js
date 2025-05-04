import axios from "axios";

const API_URL = "http://localhost:8080/api/classes";

const createClass = async (classData) => {
  const res = await axios.post(API_URL, classData);
  return res.data;
};

const getAllClasses = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// ✅ Add this method to fetch classes with teacher and classmates data
const getClassesByStudentIdWithUsers = async (studentId) => {
  const res = await axios.get(`${API_URL}/student/${studentId}/with-users`);
  return res.data;
};

const updateClass = async (id, updatedData) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedData);
  return res.data;
};

const deleteClass = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

const getClassesByStudentId = async (studentId) => {
  const res = await axios.get(`${API_URL}/student/${studentId}`);
  return res.data;
};

const classService = {
  createClass,
  getAllClasses,
  getClassesByStudentIdWithUsers, // ✅ Add this method
  getClassesByStudentId,
  updateClass,
  deleteClass,
};

export default classService;
