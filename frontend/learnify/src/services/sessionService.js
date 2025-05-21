import axios from 'axios';

const API_BASE = "http://localhost:8080/api/session";

const sessionService = {
  /**
   * Start a new session log
   * @param {string} studentId 
   * @param {string} classId 
   * @param {string} activityType - e.g., 'lesson' or 'quiz'
   */
  startSession: async (studentId, classId, activityType) => {
    try {
      const response = await axios.post(`${API_BASE}/start`, {
        studentId,
        classId,
        activityType,
      });
      return response.data;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  },

  /**
   * End an existing session by ID
   * @param {string} sessionId 
   */
  endSession: async (sessionId) => {
    try {
      const response = await axios.post(`${API_BASE}/end/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  },

  /**
   * Delete active quiz session for a student in a class
   * @param {string} studentId 
   * @param {string} classId 
   */
  deleteQuizSession: async (studentId, classId) => {
    try {
      const response = await axios.delete(`${API_BASE}/end-quiz/${studentId}/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quiz session:', error);
      throw error;
    }
  }
};

export default sessionService;
