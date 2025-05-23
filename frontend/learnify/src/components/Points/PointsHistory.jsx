import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { pointsService } from '../../services/pointsService';
import LoadingSpinner from '../UI/LoadingSpinner';
import './PointsHistory.css';

const PointsHistory = () => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, quiz, lesson, etc.

  useEffect(() => {
    const fetchPointsHistory = async () => {
      try {
        if (currentUser) {
          let data;
          if (filter === 'all') {
            data = await pointsService.getPointsHistory(currentUser.id);
          } else {
            data = await pointsService.getPointsByActivityType(currentUser.id, filter);
          }
          setHistory(data);
        }
      } catch (err) {
        setError('Failed to load points history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsHistory();
  }, [currentUser, filter]);

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get activity type label
  const getActivityLabel = (type) => {
    const labels = {
      'QUIZ_COMPLETION': 'Quiz Completion',
      'LESSON_COMPLETION': 'Lesson Completion',
      'DAILY_LOGIN': 'Daily Login',
      'CHALLENGE_COMPLETION': 'Challenge Completion',
      'VISUAL_NOVEL_COMPLETION': 'Visual Novel Completion'
    };
    return labels[type] || type;
  };

  // Get activity icon
  const getActivityIcon = (type) => {
    const icons = {
      'QUIZ_COMPLETION': '📝',
      'LESSON_COMPLETION': '📚',
      'DAILY_LOGIN': '🔄',
      'CHALLENGE_COMPLETION': '🏆',
      'VISUAL_NOVEL_COMPLETION': '📖',
    };
    return icons[type] || '✨';
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) return (
    <div className="error-container">
      <div className="error-message">{error}</div>
    </div>
  );

  return (
    <div className="points-history">
      <div className="history-header">
        <h2>Points History</h2>
        <div className="filter-controls">
          <label>Filter by:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Activities</option>
            <option value="QUIZ_COMPLETION">Quizzes</option>
            <option value="LESSON_COMPLETION">Lessons</option>
            <option value="DAILY_LOGIN">Daily Logins</option>
            <option value="CHALLENGE_COMPLETION">Challenges</option>
            <option value="VISUAL_NOVEL_COMPLETION">Visual Novels</option>
          </select>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="no-history">No points history found</div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-item-content">
                <div className="activity-icon">{getActivityIcon(item.activityType)}</div>
                <div className="history-description">
                  <span className="activity-type">{getActivityLabel(item.activityType)}</span>
                  <p>{item.description}</p>
                  <div className="history-date">{formatDate(item.earnedAt)}</div>
                </div>
                <div className="history-points">+{item.pointsEarned}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PointsHistory;