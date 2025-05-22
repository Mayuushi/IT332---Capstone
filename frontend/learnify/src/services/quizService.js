import axios from 'axios';

const API_URL = 'http://localhost:8080/api/quizzes';
const QUESTION_BANK_API_URL = 'http://localhost:8080/api/question-bank';


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

// Submit quiz answers and get result from backend
export const submitQuizAnswers = async (quizId, studentId, answers) => {
  try {
    const response = await axios.post(`${API_URL}/${quizId}/submit`, {
      studentId,
      answers,
    });
    return response.data; // { score, totalPossible, percentage }
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    throw error;
  }
};

export const fetchQuizzesByClassAndStudent = async (classId, studentId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/quizzes/class/${classId}/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes with submission status:", error);
    throw error;
  }
};

// ✅ Fetch all submissions for a specific quiz
export const fetchQuizSubmissions = async (quizId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/quizzes/${quizId}/submissions`);
    return response.data; // Array of { studentId, studentName, score, totalPossible, percentage, submittedAt }
  } catch (error) {
    console.error('Error fetching quiz submissions:', error);
    throw error;
  }
};

export const fetchQuestionBankByTeacherId = async (teacherId) => {
  try {
    const response = await axios.get(`${QUESTION_BANK_API_URL}/teacher/${teacherId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching question bank items:', error);
    throw error;
  }
};

export const addQuestionToBank = async (questionBankItem) => {
  try {
    const response = await axios.post(`${QUESTION_BANK_API_URL}`, questionBankItem);
    return response.data;
  } catch (error) {
    console.error('Error adding question to bank:', error);
    throw error;
  }
};





