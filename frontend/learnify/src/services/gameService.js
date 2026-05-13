import axios from 'axios';

const API = axios.create({ baseURL: 'https://it332-capstone.onrender.com/api/game' });

export const gameService = {
  startGame: (playerName) =>
    API.post('/start', { playerName }).then(r => r.data),

  getGame: (sessionId) =>
    API.get(`/${sessionId}`).then(r => r.data),

  getQuestion: (sessionId) =>
    API.post(`/${sessionId}/question`).then(r => r.data),

  submitAnswer: (sessionId, selectedOption) =>
    API.post(`/${sessionId}/answer`, { selectedOption }).then(r => r.data),

  getLeaderboard: () =>
    API.get('/leaderboard').then(r => r.data),
};
