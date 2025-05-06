import axios from 'axios';

const API_URL = 'http://localhost:8080/api/quizzes';

export const fetchAllQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/questions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// Updated the fetchQuizzesByClassId to use axios instead of fetch
export const fetchQuizzesByClassId = async (classId) => {
  try {
    const response = await axios.get(`${API_URL}/class/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes by class ID:', error);
    throw error;
  }
};

// Later you can add more services here, like createQuiz(), submitAnswer(), etc.
