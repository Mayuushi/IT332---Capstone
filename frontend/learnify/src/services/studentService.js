import axios from 'axios';

const API_URL = 'http://localhost:8080/api/students';

const registerStudent = async (studentData) => {
    const response = await axios.post(API_URL, studentData);
    return response.data;
  };

const getAllStudents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getStudentByEmail = async (email) => {
  const response = await axios.get(`${API_URL}/email/${email}`);
  return response.data;
};

export default {
  registerStudent,
  getAllStudents,
  getStudentByEmail,
};
