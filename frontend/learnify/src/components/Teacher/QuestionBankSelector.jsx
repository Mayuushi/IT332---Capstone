import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchQuestionBankByTeacherId } from '../../services/quizService';
import { Archive, X, Check } from 'lucide-react';

const QuestionBankSelector = ({ onSelectQuestions }) => {
  const { currentUser } = useAuth();
  const [questionBank, setQuestionBank] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [filterSubject, setFilterSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadQuestionBank = async () => {
      if (currentUser?.id && isOpen) {
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
  }, [currentUser, isOpen]);

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleAddSelected = () => {
    const questionsToAdd = questionBank.filter(q => selectedQuestions.includes(q.id));
    onSelectQuestions(questionsToAdd);
    setSelectedQuestions([]);
    setIsOpen(false);
  };

  const filteredQuestions = filterSubject
    ? questionBank.filter(q => q.subject.toLowerCase().includes(filterSubject.toLowerCase()))
    : questionBank;

  const uniqueSubjects = [...new Set(questionBank.map(q => q.subject))];

  return (
    <div className="question-bank-selector">
      <button 
        className="btn-secondary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Archive size={16} /> {isOpen ? 'Hide Question Bank' : 'Add from Question Bank'}
      </button>

      {isOpen && (
        <div className="selector-modal">
          <div className="selector-header">
            <h4>Select Questions from Bank</h4>
            <button onClick={() => setIsOpen(false)} className="close-button">
              <X size={20} />
            </button>
          </div>

          <div className="selector-controls">
            <div className="filter-control">
              <label htmlFor="selector-subject-filter">Filter by Subject:</label>
              <select
                id="selector-subject-filter"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {isLoading ? (
            <div>"Loading"</div>
          ) : filteredQuestions.length === 0 ? (
            <div className="empty-state">
              <p>No questions found in your bank.</p>
            </div>
          ) : (
            <div className="question-selector-list">
              {filteredQuestions.map((item) => (
                <div 
                  key={item.id} 
                  className={`question-selector-item ${selectedQuestions.includes(item.id) ? 'selected' : ''}`}
                  onClick={() => toggleQuestionSelection(item.id)}
                >
                  <div className="selector-item-content">
                    <span className="subject">{item.subject}</span>
                    <p>{item.question.questionText}</p>
                    <div className="options-preview">
                      {item.question.options.slice(0, 2).map((opt, idx) => (
                        <span key={idx}>{opt}</span>
                      ))}
                      {item.question.options.length > 2 && <span>+{item.question.options.length - 2} more</span>}
                    </div>
                  </div>
                  {selectedQuestions.includes(item.id) && (
                    <div className="selection-indicator">
                      <Check size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="selector-actions">
            <span>{selectedQuestions.length} questions selected</span>
            <button 
              className="btn-primary"
              onClick={handleAddSelected}
              disabled={selectedQuestions.length === 0}
            >
              Add Selected Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankSelector;