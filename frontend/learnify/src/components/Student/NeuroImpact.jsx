import React from 'react';
import './NeuroImpact.css';

const NeuroImpact = () => {
  return (
    <div className="neuro-impact-container">
      <div className="game-wrapper">
        <iframe
          src="/neuro-impact/index.html"
          title="Neuro Impact Game"
          className="game-iframe"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default NeuroImpact;
