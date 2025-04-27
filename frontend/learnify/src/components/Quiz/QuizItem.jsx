import React from 'react';

const QuizItem = ({ question, answer, setAnswer }) => {
  const { questionText, type, options } = question;

  const handleOptionChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleTextChange = (e) => {
    setAnswer(e.target.value);
  };

  return (
    <div className="quiz-item">
      <h3>{questionText}</h3>

      {type === 'multiple-choice' ? (
        <div className="options">
          {options?.map((option, index) => (
            <div key={index} className="option">
              <input
                type="radio"
                name={questionText}
                value={option}
                checked={answer === option}
                onChange={handleOptionChange}
              />
              <label>{option}</label>
            </div>
          ))}
        </div>
      ) : (
        <div className="input">
          <input
            type="text"
            placeholder="Your answer"
            value={answer || ""}
            onChange={handleTextChange}
          />
        </div>
      )}
    </div>
  );
};

export default QuizItem;
