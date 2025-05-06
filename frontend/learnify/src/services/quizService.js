import axios from 'axios';

const API_URL = 'http://localhost:8080/api/quizzes';

// ✅ Fetch all questions
export const fetchAllQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/questions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// ✅ Fetch quizzes by class ID
export const fetchQuizzesByClassId = async (classId) => {
  try {
    const response = await axios.get(`${API_URL}/class/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes by class ID:', error);
    throw error;
  }
};

// ✅ Fetch quizzes by teacher ID
export const fetchQuizzesByTeacherId = async (teacherId) => {
  try {
    const response = await axios.get(`${API_URL}/teacher/${teacherId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes by teacher ID:', error);
    throw error;
  }
};

// ✅ Create a new quiz
export const createQuiz = async (quizData) => {
  try {
    const response = await axios.post(`${API_URL}`, quizData);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};
