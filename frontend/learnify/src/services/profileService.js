import axios from 'axios';

const API_BASE_URL = 'https://it332-capstone.onrender.com/api/profiles';

// Uses the existing GET /api/profiles/{studentId} endpoint — no backend restart needed.
const getMyProfile = async (studentId) => {
  const response = await axios.get(`${API_BASE_URL}/${studentId}`);
  return response.data;
};

const profileService = { getMyProfile };

export default profileService;
