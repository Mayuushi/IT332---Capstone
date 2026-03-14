import React, { useState, useEffect } from 'react';

const OPTION_COLORS = ['#00d4ff', '#ff006e', '#06ffa5', '#ffbe0b'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuestionModal({ question, options, onSubmit, loading }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => { setTimeout(() => setRevealed(true), 50); }, []);

  const handleSubmit = () => {
    if (!selected || loading) return;
    onSubmit(selected);
    setSelected(null);
  };

  return (
    <div className={`modal-overlay ${revealed ? 'visible' : ''}`}>
      <div className="q-modal">
        {/* Header */}
        <div className="q-modal-header">
          <div className="q-badge">
            <span className="q-badge-icon">🧠</span>
            <span>BRAIN CHALLENGE</span>
          </div>
          <div className="q-instruction">Answer correctly to attack!</div>
        </div>

        {/* Question */}
        <div className="q-text-box">
          <p className="q-text">{question}</p>
        </div>

        {/* Options */}
        <div className="q-options">
          {options.map((opt, i) => {
            const letter = OPTION_LABELS[i];
            const color  = OPTION_COLORS[i];
            const isSelected = selected === letter;
            return (
              <button
                key={i}
                className={`q-option ${isSelected ? 'q-option-selected' : ''}`}
                style={{ '--opt-color': color }}
                onClick={() => setSelected(letter)}
                disabled={loading}
              >
                <span className="q-option-badge" style={{ background: color }}>
                  {letter}
                </span>
                <span className="q-option-text">{opt.substring(3)}</span>
                {isSelected && <span className="q-option-check">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Submit */}
        <button
          className={`q-submit ${selected ? 'q-submit-ready' : ''}`}
          onClick={handleSubmit}
          disabled={!selected || loading}
        >
          {loading
            ? <><span className="spinner" /> Checking...</>
            : selected
              ? <>⚔️ ATTACK with <strong>{selected}</strong>!</>
              : '👆 Pick an answer first'}
        </button>
      </div>
    </div>
  );
}