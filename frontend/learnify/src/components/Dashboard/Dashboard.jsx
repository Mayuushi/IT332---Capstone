import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { pointsService } from '../../services/pointsService';
import { badgeService } from '../../services/badgeService';
import PointsDisplay from '../Points/PointsDisplay';
import BadgeCard from '../Badges/BadgeCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [newBadges, setNewBadges] = useState([]);
  const [recentPoints, setRecentPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (currentUser) {
          setLoading(true);

          // Fetch new badges
          const badges = await badgeService.getNewBadges(currentUser.id);
          setNewBadges(badges);

          // Fetch recent points history (last 5)
          const points = await pointsService.getPointsHistory(currentUser.id);
          setRecentPoints(points.slice(0, 5));
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) return <div className="error-message">{error}</div>;

  if (!currentUser) return <div className="not-logged-in">Please log in to view your dashboard</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h1>Welcome back, {currentUser.name}!</h1>
        <p>Here's your learning progress summary.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-item points-summary">
          <h2 className="section-title">Your Points</h2>
          <PointsDisplay />
        </div>

        <div className="dashboard-item recent-activity">
          <h2 className="section-title">Recent Activity</h2>
          {recentPoints.length === 0 ? (
            <div className="no-activity">No recent activity found</div>
          ) : (
            <div className="activity-list">
              {recentPoints.map((item) => (
                <div key={item.id} className="activity-item">
                  <div className="activity-points">+{item.pointsEarned}</div>
                  <div className="activity-details">
                    <div className="activity-title">{item.description}</div>
                    <div className="activity-date">{formatDate(item.earnedAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-item new-badges">
          <h2 className="section-title">New Badges</h2>
          {newBadges.length === 0 ? (
            <div className="no-badges">No new badges yet. Keep learning!</div>
          ) : (
            <div className="badges-container">
              {newBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}
        </div>
        
        <div className="dashboard-item recommendations">
          <h2 className="section-title">Recommended for You</h2>
          <div className="recommendation-list">
            <div className="recommendation-item">
              <div className="recommendation-icon lesson">📚</div>
              <div className="recommendation-details">
                <div className="recommendation-title">Introduction to Fractions</div>
                <div className="recommendation-type">Lesson • 15 mins</div>
              </div>
              <button className="start-btn">Start</button>
            </div>
            <div className="recommendation-item">
              <div className="recommendation-icon quiz">❓</div>
              <div className="recommendation-details">
                <div className="recommendation-title">Multiplication Quiz</div>
                <div className="recommendation-type">Quiz • 10 questions</div>
              </div>
              <button className="start-btn">Start</button>
            </div>
            <div className="recommendation-item">
              <div className="recommendation-icon challenge">🏆</div>
              <div className="recommendation-details">
                <div className="recommendation-title">Math Speed Challenge</div>
                <div className="recommendation-type">Challenge • 5 mins</div>
              </div>
              <button className="start-btn">Start</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;