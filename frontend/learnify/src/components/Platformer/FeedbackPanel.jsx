import React, { useEffect, useState } from 'react';

export default function FeedbackPanel({ result, onContinue }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 30); }, []);

  if (!result) return null;
  const { correct, correctAnswer, explanation, funFact, feedback, damageDealt, damageTaken, streak } = result;

  return (
    <div className={`modal-overlay ${visible ? 'visible' : ''}`}>
      <div className={`fb-panel ${correct ? 'fb-correct' : 'fb-wrong'}`}>

        {/* Big result banner */}
        <div className="fb-banner">
          <div className="fb-result-icon">{correct ? '✅' : '❌'}</div>
          <div className="fb-result-label">
            {correct
              ? (streak > 2 ? `🔥 ${streak}x STREAK!` : streak > 1 ? '🔥 COMBO!' : '✨ CORRECT!')
              : '💀 NOT QUITE!'}
          </div>
          {correct && <div className="confetti-strip">{['🎉','⭐','💥','✨','🌟','⚡','🎊'].map((e,i)=><span key={i} style={{animationDelay:`${i*0.08}s`}}>{e}</span>)}</div>}
        </div>

        {/* AI feedback quote */}
        <div className="fb-quote">
          <span className="fb-quote-icon">🤖</span>
          <p>"{feedback}"</p>
        </div>

        {/* Damage numbers */}
        <div className="fb-damage-row">
          {correct && damageDealt > 0 && (
            <div className="fb-dmg-chip fb-dmg-good">
              <span className="fb-dmg-num">-{damageDealt}</span>
              <span className="fb-dmg-lbl">Enemy HP</span>
            </div>
          )}
          {damageTaken > 0 && (
            <div className="fb-dmg-chip fb-dmg-bad">
              <span className="fb-dmg-num">-{damageTaken}</span>
              <span className="fb-dmg-lbl">Your HP</span>
            </div>
          )}
          {streak > 1 && correct && (
            <div className="fb-dmg-chip fb-dmg-streak">
              <span className="fb-dmg-num">🔥{streak}x</span>
              <span className="fb-dmg-lbl">Streak</span>
            </div>
          )}
        </div>

        {/* Correct answer reveal */}
        {!correct && (
          <div className="fb-answer-reveal">
            <span className="fb-ar-label">✅ Correct Answer</span>
            <span className="fb-ar-value">{correctAnswer}</span>
          </div>
        )}

        {/* Info cards */}
        <div className="fb-info-cards">
          <div className="fb-info-card fb-explain">
            <div className="fb-info-icon">🔬</div>
            <div>
              <p className="fb-info-title">Explanation</p>
              <p className="fb-info-text">{explanation}</p>
            </div>
          </div>
          <div className="fb-info-card fb-fact">
            <div className="fb-info-icon">🌟</div>
            <div>
              <p className="fb-info-title">Fun Fact!</p>
              <p className="fb-info-text">{funFact}</p>
            </div>
          </div>
        </div>

        <button className={`fb-continue ${correct ? 'fb-continue-good' : 'fb-continue-retry'}`} onClick={onContinue}>
          {correct ? '⚔️ KEEP FIGHTING!' : '💪 TRY AGAIN!'}
        </button>
      </div>
    </div>
  );
}