import React, { useEffect, useState } from 'react';
import './QuizStyles.css'; // Your styles
import { fetchAllQuestions } from '../../services/quizService';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState({});
    const [disabledQuestions, setDisabledQuestions] = useState(new Set()); // To track which questions are disabled
  
    useEffect(() => {
      const loadQuestions = async () => {
        try {
          const data = await fetchAllQuestions();
          setQuestions(data);
        } catch (error) {
          console.error("Failed to load questions");
        }
      };
  
      loadQuestions();
    }, []);
  
    const handleExpand = (id) => {
      setExpandedQuestion(expandedQuestion === id ? null : id);
    };
  
    const handleChange = (questionId, value) => {
      if (disabledQuestions.has(questionId)) return; // If the question is disabled, prevent changes
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    };
  
    const handleSubmit = (question) => {
      const userAnswer = answers[question.id];
      if (!userAnswer) return;
  
      const isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
      setResults(prev => ({
        ...prev,
        [question.id]: { isCorrect, correctAnswer: question.correctAnswer }
      }));
      setDisabledQuestions(prev => new Set(prev).add(question.id)); // Disable the question after submission
    };
  
    return (
      <div className="quiz">
        <h2 className="quiz-title">Quiz Questions</h2>
        {questions.map((question) => (
          <div key={question.id} className="quiz-item">
            <div className="question-title" onClick={() => handleExpand(question.id)}>
              {question.questionText}
            </div>
  
            {expandedQuestion === question.id && (
              <div className="question-body">
                {question.options && question.options.length > 0 ? (
                  <div className="kahoot-options">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`kahoot-option ${answers[question.id] === option ? 'selected' : ''}`}
                        onClick={() => handleChange(question.id, option)}
                        style={{ backgroundColor: answers[question.id] === option ? '#4caf50' : '' }}
                      >
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="input">
                    <input
                      type="text"
                      placeholder="Type your answer"
                      value={answers[question.id] || ''}
                      disabled={disabledQuestions.has(question.id)} // Disable after submission
                      onChange={(e) => handleChange(question.id, e.target.value)}
                    />
                  </div>
                )}
                <button
                  onClick={() => handleSubmit(question)}
                  disabled={disabledQuestions.has(question.id)} // Disable after submission
                  className="submit-btn"
                >
                  Submit
                </button>
  
                {results[question.id] !== undefined && (
                  <div className={`result-feedback ${results[question.id].isCorrect ? 'correct' : 'incorrect'}`}>
                    <p>
                      {results[question.id].isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
                    </p>
                    <p><strong>Correct Answer:</strong> {results[question.id].correctAnswer}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  export default Quiz;