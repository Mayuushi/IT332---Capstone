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

// ✅ Add this method
const getAllClassesWithStudents = async () => {
  const res = await axios.get(`${API_URL}/with-students`);
  return res.data;
};

const classService = {
  createClass,
  getAllClasses,
  getAllClassesWithStudents, // ✅ Make sure this is exported!
};

export default classService;
