import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';
import HealthBar from './HealthBar';
import QuestionModal from './QuestionModal';
import FeedbackPanel from './FeedbackPanel';
import EnemySprite from './EnemySprite';
import BattleLog from './BattleLog';

const PHASE = { IDLE: 'idle', QUESTION: 'question', FEEDBACK: 'feedback', LOADING: 'loading' };

export default function GameBoard({ session: initialSession, onGameEnd }) {
  const [session,    setSession]    = useState(initialSession);
  const [phase,      setPhase]      = useState(PHASE.IDLE);
  const [question,   setQuestion]   = useState(null);
  const [feedback,   setFeedback]   = useState(null);
  const [enemyHurt,  setEnemyHurt]  = useState(false);
  const [playerHurt, setPlayerHurt] = useState(false);
  const [statusMsg,  setStatusMsg]  = useState('');
  const [error,      setError]      = useState('');
  const [dmgPop,     setDmgPop]     = useState(null); // { value, type: 'enemy'|'player' }

  useEffect(() => {
    if (session.status !== 'active' && phase !== PHASE.FEEDBACK) {
      const timer = setTimeout(() => onGameEnd(session), 1800);
      return () => clearTimeout(timer);
    }
  }, [session.status, phase]);

  const showDamagePopup = (value, type) => {
    setDmgPop({ value, type });
    setTimeout(() => setDmgPop(null), 1200);
  };

  const handleAttack = async () => {
    if (phase !== PHASE.IDLE) return;
    setPhase(PHASE.LOADING); setError('');
    setStatusMsg('🧠 Generating your brain challenge...');
    try {
      const data = await gameService.getQuestion(session.id);
      setQuestion(data);
      setSession(prev => ({ ...prev, playerHp: data.playerHp, enemyHp: data.enemyHp, score: data.score, streak: data.streak }));
      setPhase(PHASE.QUESTION); setStatusMsg('');
    } catch (e) {
      setError('Failed to get a question. Check your connection.');
      setPhase(PHASE.IDLE); setStatusMsg('');
    }
  };

  const handleAnswer = async (selectedOption) => {
    setPhase(PHASE.LOADING);
    setStatusMsg('⚡ Checking your answer...');
    try {
      const result = await gameService.submitAnswer(session.id, selectedOption);
      if (result.correct) {
        setEnemyHurt(true);
        showDamagePopup(result.damageDealt, 'enemy');
        setTimeout(() => setEnemyHurt(false), 700);
      } else {
        setPlayerHurt(true);
        showDamagePopup(result.damageTaken, 'player');
        setTimeout(() => setPlayerHurt(false), 700);
      }
      setSession(prev => ({ ...prev, playerHp: result.playerHp, enemyHp: result.enemyHp, score: result.score, streak: result.streak, status: result.status, battleLog: result.battleLog }));
      setFeedback(result);
      setPhase(PHASE.FEEDBACK); setStatusMsg('');
    } catch (e) {
      setError('Something went wrong submitting your answer.');
      setPhase(PHASE.IDLE); setStatusMsg('');
    }
  };

  const handleContinue = () => {
    if (session.status !== 'active') { onGameEnd(session); }
    else { setFeedback(null); setPhase(PHASE.IDLE); }
  };

  const accuracy = session.questionsAnswered > 0
    ? Math.round((session.correctAnswers / session.questionsAnswered) * 100) : 0;
  const enemyPct = Math.round((session.enemyHp / session.enemyMaxHp) * 100);

  return (
    <div className="game-board">

      {/* ── Top HUD ── */}
      <div className="game-hud">
        <div className="hud-logo">⚡ NeuroQuest</div>
        <div className="hud-center">
          {session.streak > 1 && (
            <div className="hud-streak">🔥 {session.streak}x STREAK!</div>
          )}
        </div>
        <div className="hud-stats">
          <div className="hud-chip score-chip">🏆 <span>{session.score}</span></div>
          <div className="hud-chip acc-chip">🎯 <span>{accuracy}%</span></div>
        </div>
      </div>

      {/* ── Battle Stage ── */}
      <div className="battle-stage">

        {/* Enemy zone */}
        <div className="enemy-zone">
          <div className="fighter-card enemy-card">
            <div className="fighter-name-row">
              <span className="fighter-level">Lv.{session.enemyLevel}</span>
              <span className="fighter-name enemy-fighter-name">{session.enemyName}</span>
              <span className="enemy-hp-badge">{enemyPct}%</span>
            </div>
            <HealthBar current={session.enemyHp} max={session.enemyMaxHp} variant="enemy" />
          </div>
          <div className="sprite-wrap enemy-sprite-wrap">
            {dmgPop?.type === 'enemy' && (
              <div className="dmg-popup dmg-enemy">-{dmgPop.value}</div>
            )}
            <EnemySprite type={session.enemyType} isHurt={enemyHurt} isDefeated={session.enemyHp <= 0} />
          </div>
        </div>

        {/* Center decoration */}
        <div className="stage-center">
          <div className="vs-badge">VS</div>
          <div className="stage-divider" />
          <div className="turn-indicator">
            {phase === PHASE.LOADING ? '⏳' : '⚔️'} YOUR TURN
          </div>
        </div>

        {/* Player zone */}
        <div className="player-zone">
          <div className="sprite-wrap player-sprite-wrap">
            {dmgPop?.type === 'player' && (
              <div className="dmg-popup dmg-player">-{dmgPop.value}</div>
            )}
            <div className={`player-avatar ${playerHurt ? 'hurt' : ''}`}>
              <svg viewBox="0 0 100 120" width="120" height="144">
                <defs>
                  <radialGradient id="hg2" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
                  </radialGradient>
                  <radialGradient id="skin2" cx="40%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#fde68a"/>
                    <stop offset="100%" stopColor="#f59e0b"/>
                  </radialGradient>
                </defs>
                <circle cx="50" cy="60" r="48" fill="url(#hg2)"/>
                {/* Shadow */}
                <ellipse cx="50" cy="116" rx="28" ry="5" fill="#00d4ff" opacity="0.2"/>
                {/* Cape */}
                <path d="M25,62 Q16,94 22,115 Q50,108 78,115 Q84,94 75,62 Z" fill="#1e40af" opacity="0.9"/>
                <path d="M25,62 Q16,94 22,115 Q36,110 50,112" fill="#1d4ed8" opacity="0.6"/>
                {/* Body */}
                <rect x="30" y="60" width="40" height="44" rx="10" fill="#0284c7"/>
                {/* Chest glow */}
                <ellipse cx="50" cy="74" rx="12" ry="10" fill="#7c3aed" opacity="0.9"/>
                <path d="M43,72 Q50,67 57,72" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
                <path d="M43,77 Q50,72 57,77" fill="none" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round"/>
                {/* Head */}
                <circle cx="50" cy="36" r="23" fill="url(#skin2)"/>
                {/* Helmet */}
                <path d="M27,34 Q27,13 50,13 Q73,13 73,34" fill="#0369a1"/>
                <rect x="27" y="31" width="46" height="9" rx="4" fill="#0ea5e9"/>
                {/* Visor */}
                <rect x="33" y="33" width="34" height="6" rx="3" fill="#00d4ff" opacity="0.6"/>
                {/* Eyes */}
                <circle cx="41" cy="41" r="5.5" fill="#0c1a3a"/>
                <circle cx="59" cy="41" r="5.5" fill="#0c1a3a"/>
                <circle cx="42.5" cy="39.5" r="2.5" fill="white"/>
                <circle cx="60.5" cy="39.5" r="2.5" fill="white"/>
                {/* Smile */}
                <path d="M42,52 Q50,58 58,52" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round"/>
                {/* Arms */}
                <rect x="10" y="63" width="20" height="12" rx="6" fill="#0284c7">
                  <animate attributeName="y" values="63;67;63" dur="2s" repeatCount="indefinite"/>
                </rect>
                <rect x="70" y="63" width="20" height="12" rx="6" fill="#0284c7">
                  <animate attributeName="y" values="63;59;63" dur="2s" repeatCount="indefinite"/>
                </rect>
                {/* Legs */}
                <rect x="33" y="102" width="15" height="16" rx="6" fill="#1e3a8a"/>
                <rect x="52" y="102" width="15" height="16" rx="6" fill="#1e3a8a"/>
              </svg>
            </div>
          </div>
          <div className="fighter-card player-card">
            <div className="fighter-name-row">
              <span className="fighter-name player-fighter-name">⚡ {session.playerName}</span>
            </div>
            <HealthBar current={session.playerHp} max={session.playerMaxHp} variant="player" />
          </div>
        </div>
      </div>

      {/* ── Battle Log ── */}
      <BattleLog logs={session.battleLog || []} />

      {/* ── Action Bar ── */}
      <div className="action-bar">
        {error && <p className="error-inline">⚠️ {error}</p>}

        {phase === PHASE.IDLE && session.status === 'active' && (
          <button className="attack-btn" onClick={handleAttack}>
            <span className="attack-btn-icon">⚔️</span>
            <span className="attack-btn-text">ATTACK! Answer a Question!</span>
            <span className="attack-btn-icon">🧠</span>
          </button>
        )}

        {phase === PHASE.LOADING && (
          <div className="loading-state">
            <div className="loading-dots">
              <span/><span/><span/>
            </div>
            <p className="loading-text">{statusMsg}</p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {phase === PHASE.QUESTION && question && (
        <QuestionModal question={question.question} options={question.options} onSubmit={handleAnswer} />
      )}
      {phase === PHASE.FEEDBACK && feedback && (
        <FeedbackPanel result={feedback} onContinue={handleContinue} />
      )}
    </div>
  );
}