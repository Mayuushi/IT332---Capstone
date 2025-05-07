import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/vn';

export const getStartNode = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/start`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch start node');
  }
};

export const getNodeById = async (nodeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/node/${nodeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch node: ${nodeId}`);
  }
};

export const saveGameProgress = async (userId, nodeId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/progress`, null, {
      params: { userId, nodeId }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to save progress');
  }
};

export const getGameProgress = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/progress?userId=${userId}`);
    return response.data;
  } catch (error) {
    return null; // Return null if no progress found
  }
};