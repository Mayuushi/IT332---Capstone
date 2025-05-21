import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/profiles'; // Adjust as needed

export const fetchStudentProfile = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student profile:", error);
    throw error;
  }
};

export async function addStudentNote(studentId, note, teacherId) {
  try {
    await axios.post(
      `${API_BASE_URL}/${studentId}/notes`,
      { note },
      {
        headers: {
          teacherId
        }
      }
    );
  } catch (error) {
    console.error('Error adding student note:', error);
    throw error;
  }
}
