import React from 'react';

export default function HealthBar({ current, max, variant = 'player' }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const isLow = pct <= 25;
  const isMed = pct > 25 && pct <= 55;

  const color = isLow ? '#ff4d6d' : isMed ? '#ffbe0b' : variant === 'enemy' ? '#ff006e' : '#06ffa5';

  return (
    <div className="hp-bar-wrap">
      <div className="hp-bar-track">
        <div
          className={`hp-bar-fill ${isLow ? 'hp-critical' : ''}`}
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}cc, ${color})`, boxShadow: `0 0 12px ${color}88` }}
        />
        <div className="hp-bar-shine" />
      </div>
      <div className="hp-bar-nums">
        <span className="hp-current" style={{ color }}>{current}</span>
        <span className="hp-sep">/</span>
        <span className="hp-max">{max}</span>
        <span className="hp-pct">{Math.round(pct)}%</span>
      </div>
    </div>
  );
}