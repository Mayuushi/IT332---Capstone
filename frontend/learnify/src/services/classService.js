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

const updateClass = async (id, updatedData) => {
    const res = await axios.put(`${API_URL}/${id}`, updatedData);
    return res.data;
  };
  
  const deleteClass = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  };
  
  const classService = {
    createClass,
    getAllClasses,
    getAllClassesWithStudents,
    updateClass,
    deleteClass,
  };
  
  export default classService;
  