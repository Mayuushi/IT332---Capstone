import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteQuiz, updateQuiz } from '../../services/quizService';
import axios from 'axios';

const ManageQuizzes = () => {
  const { currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const navigate = useNavigate();

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
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz =>
        quiz.id === quizId ? { ...quiz, [field]: value } : quiz
      )
    );
  };

  const handleQuestionChange = (quizId, questionIndex, field, value) => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz => {
        if (quiz.id !== quizId) return quiz;
        
        const updatedQuestions = [...(quiz.questions || [])];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          [field]: value
        };
        
        return { ...quiz, questions: updatedQuestions };
      })
    );
  };

  const handleAddQuestion = (quizId) => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz => {
        if (quiz.id !== quizId) return quiz;
        
        const newQuestion = {
          questionText: '',
          type: 'multiple-choice',
          correctAnswer: '',
          options: ['', '', '', '']
        };
        
        return {
          ...quiz,
          questions: [...(quiz.questions || []), newQuestion]
        };
      })
    );
  };

  const handleDeleteQuestion = (quizId, questionIndex) => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz => {
        if (quiz.id !== quizId) return quiz;
        
        const updatedQuestions = [...(quiz.questions || [])];
        updatedQuestions.splice(questionIndex, 1);
        
        return { ...quiz, questions: updatedQuestions };
      })
    );
  };

  const handleEditQuestion = (questionIndex) => {
    setEditingQuestion(questionIndex);
  };

  const handleSave = async (quizId) => {
    const quizToUpdate = quizzes.find(quiz => quiz.id === quizId);
    if (!quizToUpdate) return;

    try {
      await updateQuiz(quizId, {
        ...quizToUpdate,
        questions: quizToUpdate.questions || [] // Ensure questions is always an array
      });
      setEditMode(null);
      setEditingQuestion(null);
    } catch (error) {
      setError('Failed to update the quiz.');
      console.error('Error updating quiz:', error);
    }
  };

  const handleDelete = async (quizId) => {
    try {
      await deleteQuiz(quizId);
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
    } catch (error) {
      setError('Failed to delete the quiz.');
      console.error('Error deleting quiz:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Quizzes</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      {quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <div className="space-y-4">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="border rounded-lg p-4 shadow-sm">
              {editMode === quiz.id ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <label className="font-medium">Title:</label>
                    <input
                      type="text"
                      value={quiz.title || ''}
                      onChange={(e) => handleQuizChange(quiz.id, 'title', e.target.value)}
                      className="border rounded px-2 py-1 flex-grow"
                    />
                  </div>
                  
                  <h3 className="font-medium">Questions:</h3>
                  <div className="space-y-4">
                    {(quiz.questions || []).map((question, qIndex) => (
                      <div key={qIndex} className="border-l-4 border-blue-500 pl-4">
                        {editingQuestion === qIndex ? (
                          <div className="space-y-2">
                            <div>
                              <label className="block font-medium">Question Text:</label>
                              <input
                                type="text"
                                value={question.questionText || ''}
                                onChange={(e) => handleQuestionChange(quiz.id, qIndex, 'questionText', e.target.value)}
                                className="border rounded px-2 py-1 w-full"
                              />
                            </div>
                            
                            <div>
                              <label className="block font-medium">Type:</label>
                              <select
                                value={question.type || 'multiple-choice'}
                                onChange={(e) => handleQuestionChange(quiz.id, qIndex, 'type', e.target.value)}
                                className="border rounded px-2 py-1"
                              >
                                <option value="multiple-choice">Multiple Choice</option>
                                <option value="true-false">True/False</option>
                                <option value="short-answer">Short Answer</option>
                              </select>
                            </div>
                            
                            {(question.type === 'multiple-choice') && (
                              <div>
                                <label className="block font-medium">Options:</label>
                                {(question.options || ['', '', '', '']).map((option, oIndex) => (
                                  <div key={oIndex} className="flex items-center space-x-2 mb-1">
                                    <input
                                      type="radio"
                                      name={`correctAnswer-${qIndex}`}
                                      checked={question.correctAnswer === option}
                                      onChange={() => handleQuestionChange(quiz.id, qIndex, 'correctAnswer', option)}
                                    />
                                    <input
                                      type="text"
                                      value={option || ''}
                                      onChange={(e) => {
                                        const newOptions = [...(question.options || [])];
                                        newOptions[oIndex] = e.target.value;
                                        handleQuestionChange(quiz.id, qIndex, 'options', newOptions);
                                      }}
                                      className="border rounded px-2 py-1 flex-grow"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {(question.type === 'true-false' || question.type === 'short-answer') && (
                              <div>
                                <label className="block font-medium">Correct Answer:</label>
                                <input
                                  type="text"
                                  value={question.correctAnswer || ''}
                                  onChange={(e) => handleQuestionChange(quiz.id, qIndex, 'correctAnswer', e.target.value)}
                                  className="border rounded px-2 py-1 w-full"
                                />
                              </div>
                            )}
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingQuestion(null)}
                                className="bg-gray-500 text-white px-3 py-1 rounded"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => setEditingQuestion(null)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="font-medium">{question.questionText || 'Untitled Question'}</p>
                            {question.type === 'multiple-choice' && (
                              <ul className="list-disc pl-5">
                                {(question.options || []).map((option, oIndex) => (
                                  <li key={oIndex} className={option === question.correctAnswer ? 'text-green-600 font-medium' : ''}>
                                    {option || 'Empty option'}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {question.type !== 'multiple-choice' && (
                              <p className="text-green-600 font-medium">Correct answer: {question.correctAnswer || 'Not set'}</p>
                            )}
                            <div className="flex space-x-2 pt-2">
                              <button
                                onClick={() => handleEditQuestion(qIndex)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(quiz.id, qIndex)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddQuestion(quiz.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Add Question
                    </button>
                    <button
                      onClick={() => handleSave(quiz.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Save Quiz
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium text-lg">{quiz.title || 'Untitled Quiz'}</h3>
                  <p className="text-gray-600">{(quiz.questions || []).length} questions</p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleEditQuiz(quiz.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit Quiz
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete Quiz
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