import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchQuizzesByTeacher, deleteQuiz } from '../../services/quizService';
import { Link, useNavigate } from 'react-router-dom';

const QuizList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await fetchQuizzesByTeacher(currentUser.id);
        setQuizzes(data);
      } catch (err) {
        setError('Failed to load quizzes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) loadQuizzes();
  }, [currentUser]);

  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(quizId);
        setQuizzes(quizzes.filter(q => q._id !== quizId));
      } catch (err) {
        setError('Failed to delete quiz');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading quizzes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Quizzes</h2>
        <Link
          to="/teacher/quizzes/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
        >
          Create New Quiz
        </Link>
      </div>
      
      {quizzes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't created any quizzes yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map(quiz => (
            <div key={quiz._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{quiz.title}</h3>
                  <p className="text-gray-600">
                    {quiz.questions.length} questions • Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/teacher/quizzes/edit/${quiz._id}`)}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;