import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import { pointsService } from '../../services/pointsService';
import { useAuth } from '../../context/AuthContext'; // ✅ Import auth context

const TeacherDashboard = () => {
  const { currentUser } = useAuth(); // ✅ Access current user

  const [studentsWithPoints, setStudentsWithPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('name'); // name or points
  const [sortDirection, setSortDirection] = useState('asc'); // asc or desc

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const students = await studentService.getAllStudents();

        const studentsWithPoints = await Promise.all(
          students.map(async (student) => {
            try {
              const points = await pointsService.getStudentPoints(student.id);
              return {
                ...student,
                points,
              };
            } catch {
              return {
                ...student,
                points: null,
              };
            }
          })
        );

        setStudentsWithPoints(studentsWithPoints);
      } catch (err) {
        setError('Failed to load students.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortStudents = (students) => {
    return [...students].sort((a, b) => {
      let valA, valB;
      if (sortField === 'points') {
        valA = a.points?.totalPoints ?? 0;
        valB = b.points?.totalPoints ?? 0;
      } else {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const toggleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* ✅ Greeting Header */}
      {currentUser && (
        <h1 style={{ marginBottom: '1rem' }}>
          Hello, {currentUser.name}!
        </h1>
      )}

      {/* ✅ Grid Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '1rem',
        }}
      >
        {/* Student List Box */}
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2 style={{ marginBottom: '0.5rem' }}>Students</h2>
          <div style={{ marginBottom: '0.5rem' }}>
            <button onClick={() => toggleSort('name')}>
              Sort by Name {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </button>{' '}
            <button onClick={() => toggleSort('points')}>
              Sort by Points {sortField === 'points' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </button>
          </div>

          {loading ? (
            <div style={{ marginTop: '2rem', textAlign: 'center', fontWeight: 'bold' }}>
              Loading...
            </div>
          ) : error ? (
            <div style={{ color: 'red', marginTop: '2rem' }}>{error}</div>
          ) : (
            <ul
              style={{
                listStyleType: 'none',
                padding: 0,
                margin: 0,
                overflowY: 'auto',
                maxHeight: '300px',
                borderTop: '1px solid #eee',
                borderBottom: '1px solid #eee',
              }}
            >
              {sortStudents(studentsWithPoints).map((student) => (
                <li
                  key={student.id}
                  style={{
                    borderBottom: '1px solid #eee',
                    padding: '0.75rem 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{student.name}</span>
                  <span>
                    Points: {student.points?.totalPoints ?? 0} | Level: {student.points?.level ?? 'N/A'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Placeholder Boxes */}
        {[2, 3, 4].map((num) => (
          <div
            key={num}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <h2>Box {num} Placeholder</h2>
            <p>Content coming soon...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
