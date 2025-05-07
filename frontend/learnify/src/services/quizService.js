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

// ✅ Update a quiz by ID
export const updateQuiz = async (quizId, updatedQuizData) => {
  try {
    const response = await axios.put(`${API_URL}/${quizId}`, updatedQuizData, {
      headers: {
        'Content-Type': 'application/json',  // Ensure the request is sent as JSON
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};

// ✅ Delete a quiz by ID
export const deleteQuiz = async (quizId) => {
  try {
    await axios.delete(`${API_URL}/${quizId}`);
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }

  
};
// ✅ Fetch a quiz by ID
export const fetchQuiz = async (quizId) => {
  try {
    const response = await axios.get(`${API_URL}/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    throw error;
  }
};

