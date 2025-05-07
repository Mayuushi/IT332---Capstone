//teacher
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createQuiz } from '../../services/quizService';
import classService from '../../services/classService';
import '../CSS/QuizForm.css';

const QuizForm = () => {
  const { currentUser, isTeacher } = useAuth();
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [questions, setQuestions] = useState([
    { questionText: '', type: 'multiple-choice', correctAnswer: '', options: ['', '', '', ''] }
  ]);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      if (isTeacher && currentUser) {
        try {
          const response = await classService.getClassesByTeacherId(currentUser.id);
          setClasses(response);
        } catch (error) {
          setError('Failed to load classes. Please try again later.');
          console.error("Error fetching classes", error);
        }
      }
    };

    fetchClasses();
  }, [isTeacher, currentUser]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', type: 'multiple-choice', correctAnswer: '', options: ['', '', '', ''] }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updated = questions.filter((_, i) => i !== index);
      setQuestions(updated);
    } else {
      setError('Quiz must have at least one question');
    }
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length > 2) {
      updated[qIndex].options.splice(oIndex, 1);
      setQuestions(updated);
    } else {
      setError('Multiple choice questions must have at least 2 options');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isTeacher || !currentUser) {
      setError('Teacher not authenticated!');
      return;
    }

    // Validate form
    if (!title.trim()) {
      setError('Please enter a quiz title');
      return;
    }

    if (!classId) {
      setError('Please select a class');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      if (!q.correctAnswer.trim()) {
        setError(`Correct answer for question ${i + 1} is required`);
        return;
      }
      if (q.type === 'multiple-choice') {
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].trim()) {
            setError(`Option ${j + 1} for question ${i + 1} is required`);
            return;
          }
        }
        // Check if correct answer is one of the options
        if (!q.options.includes(q.correctAnswer)) {
          setError(`Correct answer for question ${i + 1} must be one of the options`);
          return;
        }
      }
    }

    const payload = {
      teacherId: currentUser.id,
      title,
      classId,
      questions
    };

    setLoading(true);

    try {
      const res = await createQuiz(payload);
      setFormSubmitted(true);
      resetForm();
    } catch (err) {
      console.error(err);
      setError('Error creating quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setClassId('');
    setQuestions([
      { questionText: '', type: 'multiple-choice', correctAnswer: '', options: ['', '', '', ''] }
    ]);
  };

  const handleContinue = () => {
    setFormSubmitted(false);
  };

  return (
    <div className="quiz-form-container">
      {formSubmitted ? (
        <div className="success-message">
          <h2>Quiz Created Successfully!</h2>
          <p>Your quiz has been created and is now available for your students.</p>
          <div className="button-group">
            <button onClick={handleContinue} className="primary-button">Create Another Quiz</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="quiz-form">
          <h2>Create New Quiz</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Quiz Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter quiz title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="class">Class:</label>
            <select
              id="class"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              disabled={classes.length === 0}
              required
            >
              {classes.length === 0 ? (
                <option value="">No class available</option>
              ) : (
                <>
                  <option value="" disabled hidden>Select a Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.topic || 'Untitled Class'}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>


          <h3>Questions:</h3>
          {questions.map((q, index) => (
            <div key={index} className="question-card">
              <div className="question-header">
                <h4>Question {index + 1}</h4>
                <button 
                  type="button" 
                  onClick={() => removeQuestion(index)}
                  className="remove-button"
                  aria-label="Remove question"
                >
                  ✕
                </button>
              </div>
              
              <div className="form-group">
                <label htmlFor={`question-${index}`}>Question Text:</label>
                <input
                  id={`question-${index}`}
                  type="text"
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                  required
                  placeholder="Enter your question"
                />
              </div>

              <div className="form-group">
                <label htmlFor={`question-type-${index}`}>Question Type:</label>
                <select
                  id={`question-type-${index}`}
                  value={q.type}
                  onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="text">Text Answer</option>
                </select>
              </div>

              {q.type === 'multiple-choice' && (
                <div className="options-container">
                  <label className="options-label">Options:</label>
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="option-item">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                        required
                        placeholder={`Option ${oIndex + 1}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeOption(index, oIndex)}
                        className="option-remove-button"
                        aria-label="Remove option"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addOption(index)}
                    className="add-option-button"
                  >
                    + Add Option
                  </button>
                </div>
              )}

              <div className="form-group">
                <label htmlFor={`correct-answer-${index}`}>
                  {q.type === 'multiple-choice' ? 'Correct Option:' : 'Correct Answer:'}
                </label>
                <input
                  id={`correct-answer-${index}`}
                  type="text"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                  required
                  placeholder={q.type === 'multiple-choice' ? 'Enter exact text of correct option' : 'Enter correct answer'}
                />
              </div>
            </div>
          ))}

          <button 
            type="button" 
            onClick={addQuestion}
            className="add-question-button"
          >
            + Add Question
          </button>
          
          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuizForm;