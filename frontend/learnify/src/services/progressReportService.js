import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/progress'; // adjust if needed

export const fetchClassPerformance = (classId) =>
  axios.get(`${API_BASE}/class-performance/${classId}`);

export const fetchQuizAverages = (classId) =>
  axios.get(`${API_BASE}/quiz-averages/${classId}`);

export const fetchEngagementHeatmap = (classId) =>
  axios.get(`${API_BASE}/engagement-heatmap/${classId}`);

export const fetchTemporalProgress = (classId) =>
  axios.get(`${API_BASE}/temporal-analysis/${classId}`);
