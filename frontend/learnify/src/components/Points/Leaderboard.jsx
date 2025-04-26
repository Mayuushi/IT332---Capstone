import React, { useState, useEffect } from 'react';
import { pointsService } from '../../services/pointsService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import './Leaderboard.css';

const Leaderboard = () => {
  const { currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await pointsService.getLeaderboard(10);
        setLeaderboard(data);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <LoadingSpinner />;
  
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Top Students</h2>
      </div>

      <div className="leaderboard-list">
        {leaderboard.map((student, index) => (
          <div 
            key={student.studentId} 
            className={`leaderboard-item ${currentUser && student.studentId === currentUser.id ? 'current-user' : ''}`}
          >
            <div className="rank">{index + 1}</div>
            <div className="student-info">
              <div className="leaderboard-avatar">
                {student.studentName.substring(0, 1).toUpperCase()}
              </div>
              <div className="student-name">
                {student.studentName}
                {currentUser && student.studentId === currentUser.id && <span className="you-badge">You</span>}
              </div>
            </div>
            <div className="student-stats">
              <div className="student-points">{student.totalPoints} points</div>
              <div className="student-level">Level {student.level}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;