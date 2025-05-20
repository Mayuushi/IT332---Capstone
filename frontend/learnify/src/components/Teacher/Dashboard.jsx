import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import { pointsService } from '../../services/pointsService';
import classService from '../../services/classService';
import { fetchQuizzesByTeacherId, fetchQuizSubmissions } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const { currentUser } = useAuth();

  // Students with points state
  const [studentsWithPoints, setStudentsWithPoints] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [errorStudents, setErrorStudents] = useState(null);

  // Quizzes and submissions state
  const [quizzesWithSubmissions, setQuizzesWithSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [errorSubmissions, setErrorSubmissions] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  // Classes with students state
  const [classesWithStudents, setClassesWithStudents] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [errorClasses, setErrorClasses] = useState(null);

  // Sorting states
  const [studentSortField, setStudentSortField] = useState('name');
  const [studentSortDirection, setStudentSortDirection] = useState('asc');

  const [submissionSortField, setSubmissionSortField] = useState('studentName');
  const [submissionSortDirection, setSubmissionSortDirection] = useState('asc');

  useEffect(() => {
    if (!currentUser?.id) return;

    // Fetch students with points
    const fetchStudentPoints = async () => {
      setLoadingStudents(true);
      try {
        const students = await studentService.getAllStudents();
        const withPoints = await Promise.all(
          students.map(async (student) => {
            try {
              const points = await pointsService.getStudentPoints(student.id);
              return { ...student, points };
            } catch {
              return { ...student, points: null };
            }
          })
        );
        setStudentsWithPoints(withPoints);
      } catch (err) {
        setErrorStudents('Failed to load students.');
        console.error(err);
      } finally {
        setLoadingStudents(false);
      }
    };

    // Fetch quizzes with submissions
    const fetchQuizzesAndSubmissions = async () => {
      setLoadingSubmissions(true);
      try {
        const quizzes = await fetchQuizzesByTeacherId(currentUser.id);
        const withSubmissions = await Promise.all(
          quizzes.map(async (quiz) => {
            const submissions = await fetchQuizSubmissions(quiz.id);
            return { ...quiz, submissions };
          })
        );
        setQuizzesWithSubmissions(withSubmissions);
        if (withSubmissions.length > 0) setSelectedQuizId(withSubmissions[0].id);
      } catch (err) {
        setErrorSubmissions('Failed to load quiz submissions.');
        console.error(err);
      } finally {
        setLoadingSubmissions(false);
      }
    };

    // Fetch classes with students
    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const classes = await classService.getClassesByTeacherIdWithStudents(currentUser.id);
        setClassesWithStudents(classes);
      } catch (err) {
        setErrorClasses('Failed to load classes.');
        console.error(err);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchStudentPoints();
    fetchQuizzesAndSubmissions();
    fetchClasses();
  }, [currentUser?.id]);

  // Sort students by selected field
  const sortStudents = (students) => {
    return [...students].sort((a, b) => {
      let valA = studentSortField === 'points' ? a.points?.totalPoints ?? 0 : a.name.toLowerCase();
      let valB = studentSortField === 'points' ? b.points?.totalPoints ?? 0 : b.name.toLowerCase();
      if (valA < valB) return studentSortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return studentSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Sort quiz submissions by field
  const sortSubmissions = (submissions) => {
    return [...submissions].sort((a, b) => {
      let valA = submissionSortField === 'score' ? a.score : (a.studentName || a.studentId);
      let valB = submissionSortField === 'score' ? b.score : (b.studentName || b.studentId);

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return submissionSortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return submissionSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Toggle sorting for students
  const toggleStudentSort = (field) => {
    if (field === studentSortField) {
      setStudentSortDirection(studentSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setStudentSortField(field);
      setStudentSortDirection('asc');
    }
  };

  // Toggle sorting for quiz submissions
  const toggleSubmissionSort = (field) => {
    if (field === submissionSortField) {
      setSubmissionSortDirection(submissionSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSubmissionSortField(field);
      setSubmissionSortDirection('asc');
    }
  };

  // Selected quiz for submissions display
  const selectedQuiz = quizzesWithSubmissions.find(q => q.id === selectedQuizId);

  return (
    <div style={{ padding: '1rem' }}>
      {currentUser && <h1 style={{ marginBottom: '1rem' }}>Hello, {currentUser.name}!</h1>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '1rem',
        }}
      >
        {/* Box 1 - Students with points */}
        <div style={{ ...boxStyle, height: '400px' }}>
          <h2>Students</h2>
          <div style={{ marginBottom: '0.5rem' }}>
            <button onClick={() => toggleStudentSort('name')}>
              Sort by Name {studentSortField === 'name' ? (studentSortDirection === 'asc' ? '▲' : '▼') : ''}
            </button>{' '}
            <button onClick={() => toggleStudentSort('points')}>
              Sort by Points {studentSortField === 'points' ? (studentSortDirection === 'asc' ? '▲' : '▼') : ''}
            </button>
          </div>
          {loadingStudents ? (
            <div style={{ marginTop: '2rem', textAlign: 'center', fontWeight: 'bold' }}>Loading students...</div>
          ) : errorStudents ? (
            <div style={{ color: 'red', marginTop: '2rem' }}>{errorStudents}</div>
          ) : (
            <ul style={listStyle}>
              {sortStudents(studentsWithPoints).map((student) => (
                <li key={student.id} style={listItemStyle}>
                  <span>{student.name}</span>
                  <span>
                    Points: {student.points?.totalPoints ?? 0} | Level: {student.points?.level ?? 'N/A'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Box 2 - Quiz submissions */}
        <div style={{ ...boxStyle, height: '400px' }}>
          <h2>Quiz Submissions</h2>
          {loadingSubmissions ? (
            <div>Loading submissions...</div>
          ) : errorSubmissions ? (
            <div style={{ color: 'red' }}>{errorSubmissions}</div>
          ) : quizzesWithSubmissions.length === 0 ? (
            <div>No quizzes found.</div>
          ) : (
            <>
              <label htmlFor="quizSelect" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Select Quiz:
              </label>
              <select
                id="quizSelect"
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                style={{ marginBottom: '1rem', padding: '0.3rem' }}
              >
                {quizzesWithSubmissions.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </select>

              {selectedQuiz && selectedQuiz.submissions.length === 0 ? (
                <div style={{ fontStyle: 'italic' }}>No submissions yet.</div>
              ) : selectedQuiz ? (
                <>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button onClick={() => toggleSubmissionSort('studentName')}>
                      Sort by Name {submissionSortField === 'studentName' ? (submissionSortDirection === 'asc' ? '▲' : '▼') : ''}
                    </button>{' '}
                    <button onClick={() => toggleSubmissionSort('score')}>
                      Sort by Score {submissionSortField === 'score' ? (submissionSortDirection === 'asc' ? '▲' : '▼') : ''}
                    </button>
                  </div>
                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {sortSubmissions(selectedQuiz.submissions).map((submission, idx) => (
                      <div key={idx} style={{ marginBottom: '4px' }}>
                        {submission.studentName || submission.studentId}: {submission.score}/{submission.totalPossible} ({submission.percentage}%)
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </>
          )}
        </div>

        {/* Box 3 - Classes with students */}
        <div style={{ ...boxStyle, height: '400px' }}>
          <h2>Your Classes</h2>
          {loadingClasses ? (
            <div style={{ marginTop: '2rem', textAlign: 'center', fontWeight: 'bold' }}>Loading classes...</div>
          ) : errorClasses ? (
            <div style={{ color: 'red', marginTop: '2rem' }}>{errorClasses}</div>
          ) : classesWithStudents.length === 0 ? (
            <div>No classes found.</div>
          ) : (
            <ul style={{ ...listStyle, maxHeight: '340px' }}>
              {classesWithStudents.map((classItem) => (
                <li key={classItem.id} style={listItemStyle}>
                  <div>
                    <strong>{classItem.topic || 'Unnamed Class'}</strong>
                    <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '0.25rem' }}>
                      Students: {classItem.students && classItem.students.length > 0
                        ? classItem.students.map(s => s.name).join(', ')
                        : 'No students enrolled'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Box 4 Placeholder */}
        <div style={boxStyle}>
          <h2>Box 4 Placeholder</h2>
          <p>Content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

const boxStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  overflowY: 'auto',
  maxHeight: '300px',
  borderTop: '1px solid #eee',
  borderBottom: '1px solid #eee',
};

const listItemStyle = {
  borderBottom: '1px solid #eee',
  padding: '0.75rem 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export default TeacherDashboard;
