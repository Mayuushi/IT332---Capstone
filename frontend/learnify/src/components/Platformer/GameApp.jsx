import React, { useState } from 'react';
import StartScreen from './StartScreen';
import GameBoard from './GameBoard';
import ResultScreen from './ResultScreen';
import './GameApp.css';

export default function GameApp() {
  const [screen, setScreen] = useState('start');
  const [session, setSession] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  const handleGameStart = (sessionData) => {
    setSession(sessionData);
    setScreen('game');
  };

  const handleGameEnd = (result) => {
    setFinalResult(result);
    setScreen('result');
  };

  const handleRestart = () => {
    setSession(null);
    setFinalResult(null);
    setScreen('start');
  };

  return (
    // ↓ This single class scopes ALL GameApp.css styles
    <div className="neurogame-root">
      <div className="neural-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`neuron neuron-${i % 5}`} style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }} />
        ))}
      </div>

      <div className="app-content">
        {screen === 'start'  && <StartScreen onStart={handleGameStart} />}
        {screen === 'game'   && <GameBoard session={session} onGameEnd={handleGameEnd} />}
        {screen === 'result' && <ResultScreen result={finalResult} onRestart={handleRestart} />}
      </div>
    </div>
  );
}