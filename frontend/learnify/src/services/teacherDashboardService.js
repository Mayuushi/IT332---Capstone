import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const teacherDashboardService = {
  /**
   * Get class overview data
   * @param {string} classId 
   * @returns {Promise<Object>} Overview data
   */
  getOverviewByClassId: async (classId) => {
    try {
      const response = await axios.get(`${BASE_URL}/teacher-dashboard/overview/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher dashboard overview:', error);
      throw error;
    }
  },

  /**
   * Get real-time monitoring data
   * @param {string} classId 
   * @returns {Promise<Object>} Real-time data
   */
  getRealTimeMonitoringByClassId: async (classId) => {
    try {
      const response = await axios.get(`${BASE_URL}/teacher-dashboard/realtime/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching real-time monitoring data:', error);
      throw error;
    }
  },

  /**
   * Get ongoing sessions
   * @param {string} classId 
   * @returns {Promise<Array>} Array of ongoing sessions
   */
  getOngoingSessionsByClassId: async (classId) => {
    try {
      const response = await axios.get(`${BASE_URL}/teacher-dashboard/sessions/ongoing/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ongoing sessions:', error);
      throw error;
    }
  },

  /**
   * Get basic completed sessions data
   * @param {string} classId 
   * @returns {Promise<Array>} Array of completed sessions
   */
  getCompletedSessionsByClassId: async (classId) => {
    try {
      const response = await axios.get(`${BASE_URL}/teacher-dashboard/sessions/completed/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching completed sessions:', error);
      throw error;
    }
  },

  /**
   * Get completed sessions with student names
   * @param {string} classId 
   * @returns {Promise<Array>} Array of completed sessions with student names
   */
  getCompletedSessionsWithNames: async (classId) => {
    try {
      const response = await axios.get(`${BASE_URL}/session/sessions/completed/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching completed sessions with names:', error);
      throw error;
    }
  }
};

export default teacherDashboardService;