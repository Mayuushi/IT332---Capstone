import React, { useState } from 'react';
import StartScreen from './StartScreen';
import GameBoard from './GameBoard';
import ResultScreen from './ResultScreen';
import { pointsService } from '../../services/pointsService';
import './GameApp.css';

// ── Points formula ────────────────────────────────────────────────────────────
const calcPointsEarned = (session) => {
  const accuracy    = session.questionsAnswered > 0
    ? session.correctAnswers / session.questionsAnswered : 0;
  const basePoints  = session.status === 'won' ? 100 : 30;
  const scoreBonus  = Math.floor(session.score * 0.5);
  const accuracyMul = Math.round(accuracy * 50);
  return basePoints + scoreBonus + accuracyMul;
};

// ── Helper: get studentId from wherever YOUR app stores it ────────────────────
// Tries the most common patterns. If none work, add a console.log to
// localStorage and find the key that holds your logged-in user's ID.
const getStudentId = () => {
  // Pattern 1: user object stored as JSON (most common)
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id)        return user.id;
    if (user?.studentId) return user.studentId;
    if (user?.userId)    return user.userId;
    if (user?._id)       return user._id;
  } catch (_) {}

  // Pattern 2: raw string stored directly
  const raw = localStorage.getItem('studentId')
           || localStorage.getItem('userId')
           || localStorage.getItem('id');
  if (raw) return raw;

  // Pattern 3: sessionStorage fallback
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user?.id) return user.id;
  } catch (_) {}

  return null;
};

export default function GameApp({ studentId: studentIdProp }) {
  // Prefer explicit prop → fall back to reading from storage
  const studentId = studentIdProp || getStudentId();

  if (!studentId) {
    console.warn(
      '[GameApp] studentId is null — points will NOT be awarded.\n' +
      'To fix, either:\n' +
      '  A) Pass the prop:  <GameApp studentId={user.id} />\n' +
      '  B) Update getStudentId() above to match your auth storage key.\n' +
      '  Hint: run  console.log(localStorage)  to see all stored keys.'
    );
  }

  const [screen,       setScreen]       = useState('start');
  const [session,      setSession]      = useState(null);
  const [finalResult,  setFinalResult]  = useState(null);
  const [pointsResult, setPointsResult] = useState(null);
  const [pointsError,  setPointsError]  = useState(null);

  const handleGameStart = (sessionData) => {
    setSession(sessionData);
    setPointsResult(null);
    setPointsError(null);
    setScreen('game');
  };

  const handleGameEnd = async (result) => {
    setFinalResult(result);
    setScreen('result'); // show result immediately, award points in background

    if (!studentId) {
      setPointsError('Not logged in — points could not be saved.');
      return;
    }

    try {
      const pointsEarned = calcPointsEarned(result);
      const accuracy     = result.questionsAnswered > 0
        ? Math.round((result.correctAnswers / result.questionsAnswered) * 100) : 0;

      const pointsData = {
        studentId:    studentId,
        points:       pointsEarned,
        activityType: 'GAME',
        activityId:   `neuroquest-${result.id || Date.now()}`,
        description:  `NeuroQuest: defeated ${result.enemyName} | ` +
                      `Score: ${result.score} | Accuracy: ${accuracy}% | ` +
                      `${result.status === 'won' ? 'Victory' : 'Defeat'}`,
      };

      console.log('[GameApp] Awarding points:', pointsData); // useful for debugging
      const awarded = await pointsService.awardPoints(pointsData);
      setPointsResult({ earned: pointsEarned, response: awarded });
    } catch (err) {
      console.error('Failed to award points:', err);
      setPointsError('Points could not be saved this time.');
    }
  };

  const handleRestart = () => {
    setSession(null);
    setFinalResult(null);
    setPointsResult(null);
    setPointsError(null);
    setScreen('start');
  };

  return (
    <div className="neurogame-root">
      <div className="app-content">
        {screen === 'start'  && <StartScreen onStart={handleGameStart} />}
        {screen === 'game'   && <GameBoard session={session} onGameEnd={handleGameEnd} />}
        {screen === 'result' && (
          <ResultScreen
            result={finalResult}
            pointsResult={pointsResult}
            pointsError={pointsError}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}