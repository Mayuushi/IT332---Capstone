import React, { useEffect, useState } from 'react';

export default function ResultScreen({ result, onRestart }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  if (!result) return null;
  const won = result.status === 'won';
  const accuracy = result.questionsAnswered > 0
    ? Math.round((result.correctAnswers / result.questionsAnswered) * 100) : 0;
  const grade = accuracy >= 80 ? { label: 'NEURO MASTER', icon: '🌟', cls: 'grade-s' }
              : accuracy >= 60 ? { label: 'BRAIN WARRIOR', icon: '⭐', cls: 'grade-a' }
              : accuracy >= 40 ? { label: 'KNOWLEDGE SEEKER', icon: '📚', cls: 'grade-b' }
              :                  { label: 'KEEP STUDYING!', icon: '💡', cls: 'grade-c' };

  return (
    <div className={`result-screen ${visible ? 'visible' : ''}`}>
      {/* Background particles */}
      {won && <div className="result-particles">
        {[...Array(12)].map((_,i) => <div key={i} className={`rp rp-${i%4}`} style={{left:`${Math.random()*100}%`,animationDelay:`${Math.random()*2}s`}}/>)}
      </div>}

      <div className={`result-card ${won ? 'rc-victory' : 'rc-defeat'}`}>

        {/* Big status */}
        <div className="rc-status">
          <div className="rc-status-icon">{won ? '🏆' : '💀'}</div>
          <h1 className="rc-title">{won ? 'VICTORY!' : 'DEFEATED!'}</h1>
          <p className="rc-subtitle">
            {won
              ? `You defeated ${result.enemyName}! Your brain is unstoppable!`
              : `${result.enemyName} was too strong... but knowledge grows with every battle!`}
          </p>
        </div>

        {/* Grade badge */}
        <div className={`rc-grade ${grade.cls}`}>
          <span>{grade.icon}</span>
          <span>{grade.label}</span>
        </div>

        {/* Stats */}
        <div className="rc-stats">
          <div className="rc-stat rc-stat-score">
            <div className="rc-stat-val">{result.score}</div>
            <div className="rc-stat-lbl">🏆 Score</div>
          </div>
          <div className="rc-stat">
            <div className="rc-stat-val">{result.questionsAnswered}</div>
            <div className="rc-stat-lbl">🧠 Questions</div>
          </div>
          <div className="rc-stat">
            <div className="rc-stat-val">{result.correctAnswers}</div>
            <div className="rc-stat-lbl">✅ Correct</div>
          </div>
          <div className="rc-stat">
            <div className="rc-stat-val">{accuracy}%</div>
            <div className="rc-stat-lbl">🎯 Accuracy</div>
          </div>
        </div>

        {/* Learning moment */}
        <div className="rc-learn">
          <div className="rc-learn-header">🔬 Did You Know?</div>
          <p className="rc-learn-text">
            Your nervous system has <strong>86 billion neurons</strong> — more than stars visible in the night sky.
            Every correct answer you give actually <strong>strengthens real neural pathways</strong> in your brain! 🧠⚡
          </p>
        </div>

        <button className="rc-btn" onClick={onRestart}>
          {won ? '⚔️ BATTLE AGAIN!' : '💪 TRY AGAIN!'}
        </button>
      </div>
    </div>
  );
}