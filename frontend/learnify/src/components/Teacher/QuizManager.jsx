import React, { useState } from 'react';
import ManageQuizzes from './ManageQuizzes';
import QuizForm from './QuizForm';
import '../CSS/QuizManager.css'; // Import the CSS file

const QuizManager = () => {
  const [mode, setMode] = useState(null); // null | 'create' | 'update'

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
  };

  return (
    <div className="quiz-container">
      {!mode ? (
        <div className="quiz-selection">
          <h2 className="quiz-title">Manage Quizzes</h2>
          <p className="quiz-subtitle">What would you like to do?</p>
          <div className="quiz-buttons">
            <button
              onClick={() => handleModeChange('create')}
              className="quiz-button quiz-button-create"
            >
              Create New Quiz
            </button>
            <button
              onClick={() => handleModeChange('update')}
              className="quiz-button quiz-button-update"
            >
              Update Existing Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-mode-container">
          <button
            onClick={() => setMode(null)}
            className="quiz-back-button"
          >
            ← Back to Quiz Options
          </button>

          {mode === 'create' && <QuizForm />}
          {mode === 'update' && <ManageQuizzes />}
        </div>
      )}
    </div>
  );
};

export default QuizManager;