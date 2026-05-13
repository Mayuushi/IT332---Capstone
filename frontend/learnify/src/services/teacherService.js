import axios from "axios";

const API_URL = 'https://it332-capstone.onrender.com/api/teachers';

const createTeacher = async (teacher) => {
  const res = await axios.post(API_URL, teacher);
  return res.data;
};

const getAllTeachers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const teacherService ={
  createTeacher,
  getAllTeachers
}



export default teacherService;
