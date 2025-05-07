import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { deleteQuiz, updateQuiz } from '../../services/quizService';
import axios from 'axios';
import '../CSS/ManageQuizzes.css';

const ManageQuizzes = () => {
  const { currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/quizzes/teacher/${currentUser.id}`);
        const normalizedQuizzes = response.data.map(quiz => ({
          ...quiz,
          questions: Array.isArray(quiz.questions) ? quiz.questions : []
        }));
        setQuizzes(normalizedQuizzes);
      } catch (error) {
        setError('Failed to load quizzes.');
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, [currentUser]);

  const handleEditQuiz = (quizId) => {
    setEditMode(quizId);
    setEditingQuestion(null);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditingQuestion(null);
  };

  const handleQuizChange = (quizId, field, value) => {
    setQuizzes(prev =>
      prev.map(quiz =>
        quiz.id === quizId ? { ...quiz, [field]: value } : quiz
      )
    );
  };

  const handleQuestionChange = (quizId, index, field, value) => {
    setQuizzes(prev =>
      prev.map(quiz => {
        if (quiz.id !== quizId) return quiz;
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        return { ...quiz, questions: updatedQuestions };
      })
    );
  };

  const handleAddQuestion = (quizId) => {
    setQuizzes(prev =>
      prev.map(quiz => {
        if (quiz.id !== quizId) return quiz;

        const lastQuestion = quiz.questions[quiz.questions.length - 1];

        // Validate the last question
        if (
          lastQuestion &&
          (!lastQuestion.questionText ||
            (lastQuestion.type === 'multiple-choice' && lastQuestion.options.some(opt => !opt)) ||
            !lastQuestion.correctAnswer)
        ) {
          setError('Please complete the current question before adding a new one.');
          return quiz;
        }

        // Clear error if validation passes
        setError('');

        const newQuestion = {
          questionText: '',
          type: 'multiple-choice',
          correctAnswer: '',
          options: ['', '', '', '']
        };
        return { ...quiz, questions: [...quiz.questions, newQuestion] };
      })
    );
  };

  const handleDeleteQuestion = (quizId, index) => {
    setQuizzes(prev =>
      prev.map(quiz => {
        if (quiz.id !== quizId) return quiz;
        const updatedQuestions = [...quiz.questions];
        updatedQuestions.splice(index, 1);
        return { ...quiz, questions: updatedQuestions };
      })
    );
  };

  const handleEditQuestion = (index) => {
    setEditingQuestion(index);
  };

  const handleSave = async (quizId) => {
    const quizToUpdate = quizzes.find(q => q.id === quizId);
    if (!quizToUpdate) return;

    try {
      await updateQuiz(quizId, {
        ...quizToUpdate,
        questions: quizToUpdate.questions || []
      });
      setEditMode(null);
      setEditingQuestion(null);
      setError('');
    } catch (error) {
      setError('Failed to update quiz.');
      console.error(error);
    }
  };

  const handleDelete = async (quizId) => {
    try {
      await deleteQuiz(quizId);
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
    } catch (error) {
      setError('Failed to delete quiz.');
      console.error(error);
    }
  };

  return (
    <div className="quizzes-container">
      <h1 className="quizzes-title">📚 My Quizzes</h1>
      {error && <p className="error-message">{error}</p>}

      {quizzes.length === 0 ? (
        <p className="no-quizzes-message">No quizzes found.</p>
      ) : (
        <div className="quizzes-list">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="quiz-card">
              {editMode === quiz.id ? (
                <div className="quiz-edit-container">
                  <input
                    type="text"
                    placeholder="Quiz Title"
                    value={quiz.title || ''}
                    onChange={(e) => handleQuizChange(quiz.id, 'title', e.target.value)}
                    className="quiz-title-input"
                  />
                  <h2 className="questions-heading">Questions</h2>

                  {(quiz.questions || []).map((q, qIndex) => (
                    <div key={qIndex} className="question-card">
                      {editingQuestion === qIndex ? (
                        <div className="question-edit-form">
                          <input
                            type="text"
                            placeholder="Question Text"
                            value={q.questionText}
                            onChange={(e) => handleQuestionChange(quiz.id, qIndex, 'questionText', e.target.value)}
                            className="question-text-input"
                          />

                          <select
                            value={q.type}
                            onChange={(e) => handleQuestionChange(quiz.id, qIndex, 'type', e.target.value)}
                            className="question-type-select"
                          >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="true-false">True/False</option>
                            <option value="short-answer">Short Answer</option>
                          </select>

                          {q.type === 'multiple-choice' && (
                            <div className="options-container">
                              <p className="options-label">Options:</p>
                              <div className="options-grid">
                                {(q.options || []).map((option, oIndex) => (
                                  <div key={oIndex} className="option-item">
                                    <input
                                      type="radio"
                                      name={`correctAnswer-${qIndex}`}
                                      checked={q.correctAnswer === option}
                                      onChange={() => handleQuestionChange(quiz.id, qIndex, 'correctAnswer', option)}
                                      className="option-radio"
                                    />
                                    <input
                                      type="text"
                                      placeholder={`Option ${oIndex + 1}`}
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...q.options];
                                        newOptions[oIndex] = e.target.value;
                                        handleQuestionChange(quiz.id, qIndex, 'options', newOptions);
                                      }}
                                      className="option-text-input"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {(q.type === 'true-false' || q.type === 'short-answer') && (
                            <input
                              type="text"
                              placeholder="Correct Answer"
                              value={q.correctAnswer}
                              onChange={(e) => handleQuestionChange(quiz.id, qIndex, 'correctAnswer', e.target.value)}
                              className="correct-answer-input"
                            />
                          )}

                          <div className="question-edit-actions">
                            <button onClick={() => setEditingQuestion(null)} className="btn-cancel">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="question-display">
                          <p className="question-text">{q.questionText || 'Untitled Question'}</p>
                          {q.type === 'multiple-choice' ? (
                            <ul className="options-list">
                              {q.options.map((opt, i) => (
                                <li key={i} className={opt === q.correctAnswer ? 'correct-option' : ''}>
                                  {opt || 'Empty Option'}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="correct-answer">Answer: {q.correctAnswer}</p>
                          )}
                          <div className="question-actions">
                            <button onClick={() => handleEditQuestion(qIndex)} className="btn-link btn-edit">Edit</button>
                            <button onClick={() => handleDeleteQuestion(quiz.id, qIndex)} className="btn-link btn-delete">Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="quiz-edit-actions">
                    <button onClick={() => handleAddQuestion(quiz.id)} className="btn btn-add">
                      ➕ Add Question
                    </button>
                    <button onClick={() => handleSave(quiz.id)} className="btn btn-save">
                      💾 Save Quiz
                    </button>
                    <button onClick={handleCancelEdit} className="btn btn-cancel-edit">
                      ❌ Cancel
                    </button>

                    {/* Error Message */}
                    {error && (
                      <p className="error-message">
                        ⚠️ {error || 'Please complete all question details before proceeding.'}
                      </p>
                    )}

                    {/* Always-visible Helper Message */}
                    <p className="helper-text">
                      ℹ️ Each question must include text, a correct answer, and filled options (if multiple choice).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="quiz-summary">
                  <h2 className="quiz-title-display">{quiz.title || 'Untitled Quiz'}</h2>
                  <p className="quiz-stats">{quiz.questions.length} questions</p>
                  <div className="quiz-actions">
                    <button onClick={() => handleEditQuiz(quiz.id)} className="btn btn-edit-quiz">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(quiz.id)} className="btn btn-delete-quiz">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageQuizzes;
