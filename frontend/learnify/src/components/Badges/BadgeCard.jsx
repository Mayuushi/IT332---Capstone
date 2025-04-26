import React from 'react';
import './BadgeCard.css';

const BadgeCard = ({ badge }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not earned yet';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`badge-card ${badge.isNew ? 'new-badge' : ''} ${!badge.earnedAt ? 'locked-badge' : ''}`}>
      {badge.isNew && <div className="new-badge-label">New!</div>}
      
      <div className="badge-image">
        {badge.imageUrl ? (
          <img src={badge.imageUrl} alt={badge.name} />
        ) : (
          <div className="badge-placeholder">
            <span>{badge.name.substring(0, 1)}</span>
          </div>
        )}
      </div>
      
      <div className="badge-info">
        <h3 className="badge-name">{badge.name}</h3>
        <p className="badge-description">{badge.description}</p>
        
        {badge.earnedAt ? (
          <div className="badge-earned-date">
            Earned on {formatDate(badge.earnedAt)}
          </div>
        ) : (
          <div className="badge-locked">
            <i className="lock-icon">🔒</i> Not earned yet
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;