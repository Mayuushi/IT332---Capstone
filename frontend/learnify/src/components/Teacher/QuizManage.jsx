import React, { useState } from 'react';
import ManageQuizzes from './ManageQuizzes'; // Your existing update/edit component
import QuizForm from './QuizForm'; // Your existing create component

const QuizManager = () => {
  const [mode, setMode] = useState(null); // null | 'create' | 'update'

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
  };

  return (
    <div className="container mx-auto p-4">
      {!mode ? (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Manage Quizzes</h2>
          <p className="text-gray-600">What would you like to do?</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleModeChange('create')}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Create New Quiz
            </button>
            <button
              onClick={() => handleModeChange('update')}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Existing Quiz
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setMode(null)}
            className="text-sm text-blue-500 hover:underline mb-4"
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
