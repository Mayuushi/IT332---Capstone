// src/services/teacherDashboardService.js

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/teacher-dashboard';


const getOverviewByClassId = async (classId) => {
  try {
    const response = await axios.get(`${BASE_URL}/overview/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher dashboard overview:', error);
    throw error;
  }
};

export default {
  getOverviewByClassId,
};
