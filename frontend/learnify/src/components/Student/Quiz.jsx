// student
import React, { useEffect, useState } from 'react';
import '../CSS/QuizStyles.css';
import { fetchQuizzesByClassId } from '../../services/quizService';
import QuizItem from './QuizItem';

const Quiz = ({ classId }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [disabledQuestions, setDisabledQuestions] = useState(new Set());

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const quizzes = await fetchQuizzesByClassId(classId);
        console.log("Fetched quizzes:", quizzes);

        // Ensure each question has a unique ID
        const allQuestions = quizzes.flatMap((quiz, quizIndex) =>
          (quiz.questions || []).map((q, qIndex) => ({
            ...q,
            uniqueId: `${quizIndex}-${qIndex}-${q.id || qIndex}`,
          }))
        );

        setQuestions(allQuestions);
      } catch (error) {
        console.error("Failed to load questions", error);
      }
    };

    if (classId) loadQuestions();
  }, [classId]);

  const setAnswer = (uniqueId, value) => {
    if (disabledQuestions.has(uniqueId)) return;
    setAnswers(prev => ({ ...prev, [uniqueId]: value }));
  };

  const handleSubmit = (question) => {
    const uniqueId = question.uniqueId;
    const userAnswer = answers[uniqueId];
    if (!userAnswer) return;

    const isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    setResults(prev => ({
      ...prev,
      [uniqueId]: { isCorrect, correctAnswer: question.correctAnswer }
    }));
    setDisabledQuestions(prev => new Set(prev).add(uniqueId));
  };

  return (
    <div className="quiz">
      <h2 className="quiz-title">Quiz Questions</h2>
      {questions.map((question) => (
        <div key={question.uniqueId} className="quiz-wrapper">
          <QuizItem
            question={question}
            answer={answers[question.uniqueId]}
            setAnswer={(value) => setAnswer(question.uniqueId, value)}
          />
          <button
            onClick={() => handleSubmit(question)}
            disabled={disabledQuestions.has(question.uniqueId)}
            className="submit-btn"
          >
            Submit
          </button>

          {results[question.uniqueId] && (
            <div className={`result-feedback ${results[question.uniqueId].isCorrect ? 'correct' : 'incorrect'}`}>
              <p>{results[question.uniqueId].isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</p>
              <p><strong>Correct Answer:</strong> {results[question.uniqueId].correctAnswer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Quiz;
