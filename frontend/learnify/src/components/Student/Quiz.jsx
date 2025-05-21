import React, { useEffect, useState, useRef } from 'react';
import '../CSS/QuizStyles.css';
import { fetchQuizzesByClassAndStudent, submitQuizAnswers } from '../../services/quizService';
import QuizItem from './QuizItem';
import { useAuth } from '../../context/AuthContext';
import sessionService from '../../services/sessionService';

const Quiz = ({ classId }) => {
  const { currentUser } = useAuth();
  const isMounted = useRef(true);

  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    isMounted.current = true;

    const loadQuizzesAndStartSession = async () => {
      try {
        setIsLoading(true);
        const data = await fetchQuizzesByClassAndStudent(classId, currentUser.id);
        
        if (!isMounted.current) return;

        setQuizzes(data);

        const existingResults = {};
        data.forEach(quiz => {
          if (quiz.submitted) {
            existingResults[quiz.id] = {
              score: quiz.score,
              totalPossible: quiz.totalPossible,
              percentage: quiz.percentage,
            };
          }
        });
        setResults(existingResults);

        // Only start session if there are unsubmitted quizzes and no active session
        if (data.some(q => !q.submitted) && !sessionStarted) {
          const session = await sessionService.startSession(
            currentUser.id, 
            classId, 
            "quiz"
          );
          
          if (!isMounted.current) return;

          console.log("Started new session:", session);
          setSessionId(session.id);
          setSessionStarted(true);
        }
      } catch (error) {
        console.error("Failed to load quizzes or start session", error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    if (classId && currentUser?.id) {
      loadQuizzesAndStartSession();
    }

    return () => {
      isMounted.current = false;
    };
  }, [classId, currentUser, sessionStarted]);

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
    if (!currentUser?.id) {
      alert('You must be logged in to submit the quiz.');
      return;
    }

    try {
      const submissionResults = {};

      // Submit all unsubmitted quizzes
      for (const quiz of quizzes) {
        if (quiz.submitted) continue;

        const quizAnswers = answers[quiz.id] || {};
        const res = await submitQuizAnswers(quiz.id, currentUser.id, quizAnswers);
        submissionResults[quiz.id] = res;
      }

      setResults(prev => ({ ...prev, ...submissionResults }));

      // Clean up sessions
      if (sessionId) {
        await sessionService.endSession(sessionId);
      }
      
      // Always delete the quiz session
      await sessionService.deleteQuizSession(currentUser.id, classId);

      // Reset session state
      setSessionId(null);
      setSessionStarted(false);

      // Reload quizzes
      const updated = await fetchQuizzesByClassAndStudent(classId, currentUser.id);
      setQuizzes(updated);
    } catch (error) {
      console.error("Failed to submit quizzes or end session", error);
      alert("Submission failed. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="quiz-loading">Loading quizzes...</div>;
  }

  return (
    <div className="quiz">
      <h2 className="quiz-title">Quizzes for Class</h2>

      {quizzes.length === 0 && !isLoading && (
        <p>No quizzes available.</p>
      )}

      {quizzes.map((quiz) => (
        <div key={quiz.id} className="quiz-wrapper">
          <h3>{quiz.title}</h3>

          {!quiz.submitted ? (
            quiz.questions.map((question, index) => {
              const answer = answers[quiz.id]?.[question.questionText] || '';
              return (
                <QuizItem
                  key={`${quiz.id}-${index}`}
                  question={{ ...question, uniqueId: `${quiz.id}-${index}` }}
                  answer={answer}
                  setAnswer={(value) => setAnswer(quiz.id, question.questionText, value)}
                  disabled={false}
                />
              );
            })
          ) : (
            <div className="quiz-result">
              <p>
                Score: {quiz.score} / {quiz.totalPossible} ({quiz.percentage}%)
              </p>
            </div>
          )}
        </div>
      ))}

      {quizzes.some(q => !q.submitted) && (
        <button 
          className="submit-btn-all" 
          onClick={handleSubmitAll}
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit All Unanswered Quizzes'}
        </button>
      )}
    </div>
  );
};

export default Quiz;