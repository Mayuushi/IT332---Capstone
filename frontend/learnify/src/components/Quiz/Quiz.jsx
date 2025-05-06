import React, { useEffect, useState } from 'react';
import './QuizStyles.css';
import { fetchQuizzesByClassId } from '../../services/quizService';
import QuizItem from './QuizItem';

const Quiz = ({ classId }) => { // <-- get it from props
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [disabledQuestions, setDisabledQuestions] = useState(new Set());

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const quizzes = await fetchQuizzesByClassId(classId);
        console.log("Fetched quizzes:", quizzes);
        const allQuestions = quizzes.flatMap(quiz => quiz.questions || []);
        setQuestions(allQuestions);
      } catch (error) {
        console.error("Failed to load questions", error);
      }
    };

    if (classId) loadQuestions();
  }, [classId]);

  const setAnswer = (questionId, value) => {
    if (disabledQuestions.has(questionId)) return;
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
    setDisabledQuestions(prev => new Set(prev).add(question.id));
  };

  return (
    <div className="quiz">
      <h2 className="quiz-title">Quiz Questions</h2>
      {questions.map((question) => (
        <div key={question.id} className="quiz-wrapper">
          <QuizItem
            question={question}
            answer={answers[question.id]}
            setAnswer={(value) => setAnswer(question.id, value)}
          />
          <button
            onClick={() => handleSubmit(question)}
            disabled={disabledQuestions.has(question.id)}
            className="submit-btn"
          >
            Submit
          </button>

          {results[question.id] && (
            <div className={`result-feedback ${results[question.id].isCorrect ? 'correct' : 'incorrect'}`}>
              <p>{results[question.id].isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</p>
              <p><strong>Correct Answer:</strong> {results[question.id].correctAnswer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Quiz;
