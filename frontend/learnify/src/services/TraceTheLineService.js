import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const traceApi = axios.create({
  baseURL: `${API_BASE}/trace`
});

const handleError = (error, fallbackMessage) => {
  const serverMessage = error?.response?.data?.message;
  throw new Error(serverMessage || fallbackMessage);
};

const TraceTheLineService = {
  async startTrace(studentId, stage = 1) {
    try {
      const response = await traceApi.post('/start', { studentId, stage: String(stage) });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to start Trace The Line session.');
    }
  },

  async sendCoordinates(sessionId, pathPayload) {
    try {
      const response = await traceApi.post(`/${sessionId}/coordinates`, pathPayload);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to submit trace coordinates.');
    }
  },

  async completeTrace(sessionId) {
    try {
      const response = await traceApi.post(`/${sessionId}/complete`);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to complete Trace The Line session.');
    }
  },

  async getTraceHistory(studentId) {
    try {
      const response = await traceApi.get(`/history/${studentId}`);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch Trace The Line history.');
    }
  }
};

export default TraceTheLineService;
