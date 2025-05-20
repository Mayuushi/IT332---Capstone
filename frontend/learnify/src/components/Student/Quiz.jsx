import React, { useEffect, useState } from 'react';
import '../CSS/QuizStyles.css';
import { fetchQuizzesByClassAndStudent, submitQuizAnswers } from '../../services/quizService';
import QuizItem from './QuizItem';
import { useAuth } from '../../context/AuthContext';

const Quiz = ({ classId }) => {
  const { currentUser } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    const loadQuizzes = async () => {
      if (!currentUser || !currentUser.id) return;

      try {
        const data = await fetchQuizzesByClassAndStudent(classId, currentUser.id);
        setQuizzes(data);

        const existingResults = {};
        data.forEach(quiz => {
          if (quiz.submitted) {
            existingResults[quiz.id] = {
              score: quiz.score,
              totalPossible: quiz.totalPossible,
              percentage: quiz.percentage
            };
          }
        });
        setResults(existingResults);
      } catch (error) {
        console.error("Failed to load quizzes", error);
      }
    };

    if (classId) loadQuizzes();
  }, [classId, currentUser]);

  const setAnswer = (quizId, questionText, value) => {
    setAnswers(prev => ({
      ...prev,
      [quizId]: {
        ...prev[quizId],
        [questionText]: value,
      }
    }));
  };

  const handleSubmitAll = async () => {
    if (!currentUser || !currentUser.id) {
      alert('You must be logged in to submit the quiz.');
      return;
    }

    try {
      const submissionResults = {};

      for (const quiz of quizzes) {
        if (quiz.submitted) continue; // skip already submitted quizzes

        const quizAnswers = answers[quiz.id] || {};
        const res = await submitQuizAnswers(quiz.id, currentUser.id, quizAnswers);
        submissionResults[quiz.id] = res;
      }

      setResults(prev => ({ ...prev, ...submissionResults }));

      // Refresh quizzes to get updated submission flags
      const updated = await fetchQuizzesByClassAndStudent(classId, currentUser.id);
      setQuizzes(updated);
    } catch (error) {
      console.error("Failed to submit quizzes", error);
      alert("Failed to submit quizzes. Please try again.");
    }
  };

  return (
    <div className="quiz">
      <h2 className="quiz-title">Quizzes for Class</h2>

      {quizzes.length === 0 && <p>No quizzes available.</p>}

      {quizzes.map((quiz) => (
        <div key={quiz.id} className="quiz-wrapper">
          <h3>{quiz.title}</h3>

          {/* Show questions only if quiz is NOT submitted */}
          {!quiz.submitted ? (
            quiz.questions.map((question, index) => {
              const answer = answers[quiz.id]?.[question.questionText] || '';
              return (
                <QuizItem
                  key={index}
                  question={{ ...question, uniqueId: `${quiz.id}-${index}` }}
                  answer={answer}
                  setAnswer={(value) => setAnswer(quiz.id, question.questionText, value)}
                  disabled={false}
                />
              );
            })
          ) : (
            // If submitted, show score instead of inputs
            <div className="quiz-result">
              <p>
                Score: {quiz.score} / {quiz.totalPossible} ({quiz.percentage}%)
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Show submit button only if there are quizzes not submitted */}
      {quizzes.some(q => !q.submitted) && (
        <button className="submit-btn-all" onClick={handleSubmitAll}>
          Submit All Unanswered Quizzes
        </button>
      )}
    </div>
  );
};

export default Quiz;
