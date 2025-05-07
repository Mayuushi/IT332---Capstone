import React, { useEffect, useState } from 'react';
import '../CSS/QuizStyles.css';
import { fetchQuizzesByClassId } from '../../services/quizService';
import QuizItem from './QuizItem';

const Quiz = ({ classId }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const quizzes = await fetchQuizzesByClassId(classId);
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
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [uniqueId]: value }));
  };

  const handleSubmitAll = () => {
    const newResults = {};
    questions.forEach((question) => {
      const uniqueId = question.uniqueId;
      const userAnswer = answers[uniqueId];
      if (!userAnswer) return;

      const isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
      newResults[uniqueId] = {
        isCorrect,
        correctAnswer: question.correctAnswer,
      };
    });

    setResults(newResults);
    setSubmitted(true);
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
            disabled={submitted}
          />
          {results[question.uniqueId] && (
            <div className={`result-feedback ${results[question.uniqueId].isCorrect ? 'correct' : 'incorrect'}`}>
              <p>{results[question.uniqueId].isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</p>
              <p><strong>Correct Answer:</strong> {results[question.uniqueId].correctAnswer}</p>
            </div>
          )}
        </div>
      ))}

      {questions.length > 0 && (
        <button className="submit-btn-all" onClick={handleSubmitAll} disabled={submitted}>
          Submit All
        </button>
      )}
    </div>
  );
};

export default Quiz;
