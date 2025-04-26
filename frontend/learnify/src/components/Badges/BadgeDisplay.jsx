import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { badgeService } from '../../services/badgeService';
import BadgeCard from './BadgeCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import './BadgeDisplay.css';

const BadgeDisplay = () => {
  const { currentUser } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, earned, unearned, new

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        if (currentUser) {
          const allBadges = await badgeService.getStudentBadges(currentUser.id);
          setBadges(allBadges);
        }
      } catch (err) {
        setError('Failed to load badges');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [currentUser]);

  const filteredBadges = badges.filter(badge => {
    if (filter === 'all') return true;
    if (filter === 'earned') return badge.earnedAt !== null;
    if (filter === 'unearned') return badge.earnedAt === null;
    if (filter === 'new') return badge.isNew === true;
    return true;
  });

  if (loading) return <LoadingSpinner />;
  
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="badge-display">
      <div className="badge-header">
        <h2>Your Badges</h2>
        <div className="filter-controls">
          <label>Filter:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Badges</option>
            <option value="earned">Earned</option>
            <option value="unearned">Not Earned</option>
            <option value="new">New</option>
          </select>
        </div>
      </div>

      <div className="badges-stats">
        <div className="stat-box">
          <span className="stat-value">{badges.filter(b => b.earnedAt !== null).length}</span>
          <span className="stat-label">Earned</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{badges.filter(b => b.earnedAt === null).length}</span>
          <span className="stat-label">Remaining</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">
            {Math.round((badges.filter(b => b.earnedAt !== null).length / badges.length) * 100)}%
          </span>
          <span className="stat-label">Complete</span>
        </div>
      </div>

      {filteredBadges.length === 0 ? (
        <div className="no-badges">No badges found</div>
      ) : (
        <div className="badges-list">
          {filteredBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;