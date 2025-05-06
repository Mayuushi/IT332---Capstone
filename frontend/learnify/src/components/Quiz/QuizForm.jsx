import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createQuiz } from '../../services/quizService';
import classService from '../../services/classService';

const QuizForm = () => {
  const { currentUser, isTeacher } = useAuth();
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [questions, setQuestions] = useState([
    { questionText: '', type: 'multiple-choice', correctAnswer: '', options: ['', '', '', ''] }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isTeacher && currentUser) {
      classService.getClassesByTeacherId(currentUser.id)
        .then((response) => {
          console.log('Classes:', response); // ✅ Debug: ensure title exists
          setClasses(response);
        })
        .catch((error) => {
          console.error("Error fetching classes", error);
        });
    }
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
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isTeacher || !currentUser) {
      alert('Teacher not authenticated!');
      return;
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
      alert('Quiz created successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Error creating quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Quiz</h2>

      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Class:</label>
      <select
  value={classId}
  onChange={(e) => setClassId(e.target.value)}
  required
  style={{
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    color: '#000',
    backgroundColor: '#fff',
    marginBottom: '1rem'
  }}
>
  <option value="" disabled hidden>Select a Class</option>
  {classes.map((cls) => (
    <option key={cls.id} value={cls.id} style={{ color: '#000' }}>
      {cls.topic || 'Untitled Class'}
    </option>
  ))}
</select>


      <h3>Questions:</h3>
      {questions.map((q, index) => (
        <div key={index} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
          <label>Question Text:</label>
          <input
            type="text"
            value={q.questionText}
            onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
            required
          />

          <label>Type:</label>
          <select
            value={q.type}
            onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="text">Text</option>
          </select>

          <label>Correct Answer:</label>
          <input
            type="text"
            value={q.correctAnswer}
            onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
            required
          />

          {q.type === 'multiple-choice' && (
            <>
              <label>Options:</label>
              {q.options.map((option, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                  required
                  placeholder={`Option ${oIndex + 1}`}
                />
              ))}
            </>
          )}

          <button type="button" onClick={() => removeQuestion(index)}>Remove Question</button>
        </div>
      ))}

      <button type="button" onClick={addQuestion}>Add Question</button>
      <br /><br />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Quiz'}
      </button>
    </form>
  );
};

export default QuizForm;
