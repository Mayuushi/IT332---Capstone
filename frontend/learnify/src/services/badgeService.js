import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const badgeService = {
  // Get all badges for a student
  getStudentBadges: async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/badges/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student badges:', error);
      throw error;
    }
  },

  // Get new (unviewed) badges for a student
  getNewBadges: async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/badges/student/${studentId}/new`);
      return response.data;
    } catch (error) {
      console.error('Error fetching new badges:', error);
      throw error;
    }
  },

  // Get all available badges
  getAllBadges: async () => {
    try {
      const response = await axios.get(`${API_URL}/badges`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all badges:', error);
      throw error;
    }
  },

  // Get badges by category
  getBadgesByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_URL}/badges/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching badges by category:', error);
      throw error;
    }
  }
};
