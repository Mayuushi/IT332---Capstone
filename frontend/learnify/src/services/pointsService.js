import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const pointsService = {
  // Get student points info
  getStudentPoints: async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/points/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student points:', error);
      throw error;
    }
  },

  // Get points history for a student
  getPointsHistory: async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/points/history/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching points history:', error);
      throw error;
    }
  },

  // Get points earned in a time range
  getPointsInTimeRange: async (studentId, start, end) => {
    try {
      const response = await axios.get(
        `${API_URL}/points/timerange/${studentId}?start=${start.toISOString()}&end=${end.toISOString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching points in time range:', error);
      throw error;
    }
  },

  // Get points by activity type
  getPointsByActivityType: async (studentId, activityType) => {
    try {
      const response = await axios.get(
        `${API_URL}/points/activity/${studentId}?activityType=${activityType}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching points by activity type:', error);
      throw error;
    }
  },

  // Get leaderboard
  getLeaderboard: async (limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/points/leaderboard?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  // Award points
  awardPoints: async (pointsData) => {
    try {
      const response = await axios.post(`${API_URL}/points/award`, pointsData);
      return response.data;
    } catch (error) {
      console.error('Error awarding points:', error);
      throw error;
    }
  }
};
