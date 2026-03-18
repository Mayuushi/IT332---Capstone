import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/profiles';

// Uses the existing GET /api/profiles/{studentId} endpoint — no backend restart needed.
const getMyProfile = async (studentId) => {
  const response = await axios.get(`${API_BASE_URL}/${studentId}`);
  return response.data;
};

const profileService = { getMyProfile };

export default profileService;
