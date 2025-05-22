import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchQuestionBankByTeacherId,
  addQuestionToBank,
  deleteQuestion,
} from '../../services/quizService';
import { PlusCircle, Archive, X, Trash2, Edit } from 'lucide-react';
import Modal from 'react-modal';
import '../CSS/QuestionBank.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    borderRadius: '8px',
    padding: '0',
    border: 'none',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '1000',
  },
};

const QuestionBankManager = () => {
  const { currentUser } = useAuth();
  const [questionBank, setQuestionBank] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    subject: '',
    question: {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
      questionType: 'multiple-choice',
    },
  });
  const [filterSubject, setFilterSubject] = useState('');

  useEffect(() => {
    const loadQuestionBank = async () => {
      if (currentUser?.id) {
        setIsLoading(true);
        try {
          const data = await fetchQuestionBankByTeacherId(currentUser.id);
          setQuestionBank(data);
          setError('');
        } catch (err) {
          console.error('Error loading question bank:', err);
          setError('Failed to load question bank. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadQuestionBank();
  }, [currentUser]);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const questionToAdd = {
        teacherId: currentUser.id,
        subject: newQuestion.subject,
        question: newQuestion.question,
      };
      const addedQuestion = await addQuestionToBank(questionToAdd);
      setQuestionBank([...questionBank, addedQuestion]);
      setNewQuestion({
        subject: '',
        question: {
          questionText: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          points: 1,
          questionType: 'multiple-choice',
        },
      });
      setIsModalOpen(false);
      setError('');
    } catch (err) {
      console.error('Error adding question:', err);
      setError('Failed to add question. Please try again.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await deleteQuestion(id);
      setQuestionBank((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Failed to delete question. Please try again.');
    }
  };

  const handleOptionChange = (index, value) => {
    setNewQuestion((prev) => ({
      ...prev,
      question: {
        ...prev.question,
        options: prev.question.options.map((opt, i) =>
          i === index ? value : opt
        ),
      },
    }));
  };

  const handleCorrectAnswerChange = (index) => {
    setNewQuestion((prev) => ({
      ...prev,
      question: {
        ...prev.question,
        correctAnswer: index,
      },
    }));
  };

  const filteredQuestions = filterSubject
    ? questionBank.filter((q) =>
        q.subject.toLowerCase().includes(filterSubject.toLowerCase())
      )
    : questionBank;

  const uniqueSubjects = [...new Set(questionBank.map((q) => q.subject))];

  return (
    <div className="question-bank-container">
      <div className="question-bank-header">
        <h2>Question Bank</h2>
        <div className="question-bank-controls">
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={16} /> Add Question
          </button>

          <div className="filter-control">
            <label htmlFor="subject-filter">Filter by Subject:</label>
            <select
              id="subject-filter"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div>Loading...</div>
      ) : filteredQuestions.length === 0 ? (
        <div className="empty-state">
          <Archive size={48} />
          <p>No questions found in your bank.</p>
          <p>Add your first question to get started!</p>
        </div>
      ) : (
        <div className="question-bank-grid">
          {filteredQuestions.map((item) => (
            <QuestionBankCard
              key={item.id}
              item={item}
              onEdit={() => {}}
              onDelete={() => handleDeleteQuestion(item.id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        contentLabel="Add New Question"
      >
        <div className="modal-header">
          <h3>Add New Question</h3>
          <button onClick={() => setIsModalOpen(false)} className="close-button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAddQuestion} className="question-form">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              value={newQuestion.subject}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, subject: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="questionText">Question Text</label>
            <textarea
              id="questionText"
              value={newQuestion.question.questionText}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  question: {
                    ...newQuestion.question,
                    questionText: e.target.value,
                  },
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="questionType">Question Type</label>
            <select
              id="questionType"
              value={newQuestion.question.questionType}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  question: {
                    ...newQuestion.question,
                    questionType: e.target.value,
                    options:
                      e.target.value === 'multiple-choice'
                        ? ['', '', '', '']
                        : [''],
                  },
                })
              }
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="text">Text</option>
            </select>
          </div>

          {newQuestion.question.questionType === 'multiple-choice' ? (
            <div className="form-group">
              <label>Options</label>
              {newQuestion.question.options.map((option, index) => (
                <div key={index} className="option-input">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={newQuestion.question.correctAnswer === index}
                    onChange={() => handleCorrectAnswerChange(index)}
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="textAnswer">Correct Answer</label>
              <input
                type="text"
                id="textAnswer"
                value={newQuestion.question.options[0]}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    question: {
                      ...newQuestion.question,
                      options: [e.target.value],
                      correctAnswer: 0,
                    },
                  })
                }
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="points">Points</label>
            <input
              type="number"
              id="points"
              min="1"
              value={newQuestion.question.points}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  question: {
                    ...newQuestion.question,
                    points: parseInt(e.target.value) || 1,
                  },
                })
              }
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Question
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const QuestionBankCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="question-card">
      <div className="card-header">
        <span className="subject-badge">{item.subject}</span>
        <div className="card-actions">
          <button onClick={onEdit} className="icon-button" title="Edit">
            <Edit size={16} />
          </button>
          <button onClick={onDelete} className="icon-button" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="card-content">
        <h4>{item.question.questionText}</h4>

        {item.question.questionType === 'multiple-choice' ? (
          <ul className="options-list">
            {item.question.options.map((option, idx) => (
              <li
                key={idx}
                className={`option-row ${
                  idx === item.question.correctAnswer ? 'correct-option' : ''
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-answer">
            <strong>Answer:</strong> {item.question.options[0]}
          </div>
        )}

        <div className="card-footer">
          <span className="points">
            {item.question.points} point{item.question.points !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionBankManager;
