import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { pointsService } from '../../services/pointsService';
import LoadingSpinner from '../UI/LoadingSpinner';
import './PointsDisplay.css';

const PointsDisplay = () => {
  const { currentUser } = useAuth();
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        if (currentUser) {
          const data = await pointsService.getStudentPoints(currentUser.id);
          setPoints(data);
        }
      } catch (err) {
        setError('Failed to load points data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;
  
  if (error) return <div className="error-message">{error}</div>;

  if (!points) return <div className="no-data">No points data available</div>;

  // Calculate progress to next level
  const currentLevel = points.level;
  const nextLevelPoints = currentLevel * 100; // Assuming 100 points per level
  const pointsToNextLevel = nextLevelPoints - (points.totalPoints % 100);
  const progressPercentage = 100 - (pointsToNextLevel / 100 * 100);

  return (
    <div className="points-display">
      <div className="points-card">
        <div className="points-header">
          <h2>Your Points</h2>
        </div>
        <div className="points-content">
          <div className="total-points">
            <span className="points-value">{points.totalPoints}</span>
            <span className="points-label">Total Points</span>
          </div>
          <div className="level-display">
            <div className="level-badge">Level {points.level}</div>
            <div className="level-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {pointsToNextLevel} points to Level {points.level + 1}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay;