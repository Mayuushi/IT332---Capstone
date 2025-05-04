import axios from "axios";

const API_URL = "/api/classes";

const createClass = async (classData) => {
  const res = await axios.post(API_URL, classData);
  return res.data;
};

const getAllClasses = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export default {
  createClass,
  getAllClasses,
};
