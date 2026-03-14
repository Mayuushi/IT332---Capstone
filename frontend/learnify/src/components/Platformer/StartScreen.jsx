import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';

export default function StartScreen({ onStart }) {
  const [name, setName]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const handleStart = async () => {
    const playerName = name.trim() || 'Neuro Kid';
    setLoading(true); setError('');
    try {
      const session = await gameService.startGame(playerName);
      onStart(session);
    } catch (e) {
      setError('Cannot connect to server. Is the backend running?');
    } finally { setLoading(false); }
  };

  return (
    <div className={`start-screen ${mounted ? 'mounted' : ''}`}>
      {/* Floating orbs */}
      <div className="start-orbs">
        {[...Array(6)].map((_, i) => <div key={i} className={`orb orb-${i}`} />)}
      </div>

      {/* Left panel — brain art */}
      <div className="start-left">
        <div className="brain-stage">
          <div className="brain-ring ring-1" />
          <div className="brain-ring ring-2" />
          <div className="brain-ring ring-3" />
          <svg className="hero-brain-svg" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="bg1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="brainFill" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#7c3aed"/>
                <stop offset="60%" stopColor="#5b21b6"/>
                <stop offset="100%" stopColor="#3b0764"/>
              </radialGradient>
              <filter id="brainGlow">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {/* Background glow */}
            <circle cx="120" cy="120" r="100" fill="url(#bg1)"/>
            {/* Left hemisphere */}
            <ellipse cx="95"  cy="105" rx="52" ry="58" fill="url(#brainFill)" filter="url(#brainGlow)"/>
            {/* Right hemisphere */}
            <ellipse cx="145" cy="105" rx="52" ry="58" fill="url(#brainFill)" filter="url(#brainGlow)"/>
            {/* Bottom join */}
            <ellipse cx="120" cy="135" rx="48" ry="30" fill="#5b21b6"/>
            {/* Folds left */}
            <path d="M72,82 Q88,64 102,80"  fill="none" stroke="#a78bfa" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M76,105 Q92,88 108,104" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
            <path d="M78,125 Q90,112 103,124" fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Folds right */}
            <path d="M138,82 Q152,64 168,80"  fill="none" stroke="#a78bfa" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M132,105 Q148,88 164,104" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
            <path d="M137,125 Q150,112 163,124" fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Center split */}
            <line x1="120" y1="58" x2="120" y2="155" stroke="#2d1b69" strokeWidth="3" strokeDasharray="6,4"/>
            {/* Eyes */}
            <circle cx="100" cy="120" r="10" fill="#0f0a24"/>
            <circle cx="140" cy="120" r="10" fill="#0f0a24"/>
            <circle cx="103" cy="117" r="4"  fill="#00d4ff">
              <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="143" cy="117" r="4"  fill="#00d4ff">
              <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite"/>
            </circle>
            {/* Smile */}
            <path d="M105,138 Q120,152 135,138" fill="none" stroke="#c4b5fd" strokeWidth="3.5" strokeLinecap="round"/>
            {/* Neural sparks */}
            <g><circle cx="50" cy="72" r="5" fill="#ff006e">
              <animate attributeName="r" values="5;7;5" dur="1.4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite"/>
            </circle>
            <line x1="50" y1="72" x2="72" y2="88" stroke="#ff006e" strokeWidth="1.5" opacity="0.5"/></g>
            <g><circle cx="190" cy="68" r="5" fill="#ffbe0b">
              <animate attributeName="r" values="5;7;5" dur="1.8s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>
            </circle>
            <line x1="190" y1="68" x2="168" y2="88" stroke="#ffbe0b" strokeWidth="1.5" opacity="0.5"/></g>
            <g><circle cx="55" cy="155" r="4" fill="#06ffa5">
              <animate attributeName="r" values="4;6;4" dur="2.1s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0.2;1" dur="2.1s" repeatCount="indefinite"/>
            </circle>
            <line x1="55" y1="155" x2="75" y2="138" stroke="#06ffa5" strokeWidth="1.5" opacity="0.5"/></g>
            <g><circle cx="185" cy="155" r="4" fill="#00d4ff">
              <animate attributeName="r" values="4;6;4" dur="1.6s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite"/>
            </circle>
            <line x1="185" y1="155" x2="165" y2="138" stroke="#00d4ff" strokeWidth="1.5" opacity="0.5"/></g>
          </svg>
          {/* Floating label */}
          <div className="brain-label">⚡ BRAIN POWER ⚡</div>
        </div>

        {/* Stats strip */}
        <div className="start-stats-row">
          <div className="start-stat"><span className="ss-icon">🧠</span><span className="ss-val">5</span><span className="ss-lbl">Enemies</span></div>
          <div className="start-stat"><span className="ss-icon">🤖</span><span className="ss-val">AI</span><span className="ss-lbl">Questions</span></div>
          <div className="start-stat"><span className="ss-icon">🔥</span><span className="ss-val">∞</span><span className="ss-lbl">Combos</span></div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="start-right">
        <div className="start-logo-wrap">
          <span className="start-logo-n">NEURO</span>
          <span className="start-logo-q">QUEST</span>
        </div>
        <p className="start-tagline">Battle brain villains using the power of knowledge!</p>

        <div className="start-how">
          <div className="how-item"><span className="how-num">1</span><span>Press <strong>ATTACK</strong> to get a question</span></div>
          <div className="how-item"><span className="how-num">2</span><span>Pick the correct answer to deal damage</span></div>
          <div className="how-item"><span className="how-num">3</span><span>Build streaks for <strong>BONUS</strong> damage!</span></div>
          <div className="how-item"><span className="how-num">4</span><span>Defeat the villain before you faint 🏆</span></div>
        </div>

        <div className="start-form">
          <label className="input-label">⚡ YOUR HERO NAME</label>
          <input
            className="name-input"
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            maxLength={20}
          />
          {error && <p className="error-msg">⚠️ {error}</p>}
          <button className="start-btn" onClick={handleStart} disabled={loading}>
            {loading
              ? <span className="btn-loading"><span className="spinner"/>Entering Battle...</span>
              : <><span>⚡</span><span>START BATTLE!</span><span>⚡</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}