const QUESTION_BANK_API_URL = 'http://localhost:8080/api/question-bank';

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
