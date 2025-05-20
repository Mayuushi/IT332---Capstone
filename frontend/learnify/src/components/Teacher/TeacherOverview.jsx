import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import classService from '../../services/classService';
import teacherDashboardService from '../../services/teacherDashboardService';

export default function TeacherDashboardOverview() {
  const { currentUser, isTeacher } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const [overview, setOverview] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [errorOverview, setErrorOverview] = useState(null);

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [errorClasses, setErrorClasses] = useState(null);

  // Load classes once when user is available
  useEffect(() => {
    if (!currentUser || !currentUser.id || !isTeacher) return;

    async function fetchClasses() {
      setLoadingClasses(true);
      setErrorClasses(null);
      try {
        const data = await classService.getClassesByTeacherId(currentUser.id);
        setClasses(data);
        if (data.length > 0) {
          setSelectedClassId(data[0].id);
        } else {
          setSelectedClassId(null);
        }
      } catch (err) {
        setErrorClasses('Failed to load classes.');
      } finally {
        setLoadingClasses(false);
      }
    }

    fetchClasses();
  }, [currentUser, isTeacher]);

  // Load overview when class selection changes
  useEffect(() => {
    if (!selectedClassId) {
      setOverview(null);
      return;
    }

    async function fetchOverview() {
      setLoadingOverview(true);
      setErrorOverview(null);
      try {
        const data = await teacherDashboardService.getOverviewByClassId(selectedClassId);
        setOverview(data);
      } catch (err) {
        setErrorOverview('Failed to load overview.');
      } finally {
        setLoadingOverview(false);
      }
    }

    fetchOverview();
  }, [selectedClassId]);

  if (!currentUser || !currentUser.id) {
    return <div>Loading user...</div>;
  }

  return (
    <div style={{ padding: '32px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
        Teacher Dashboard Overview
      </h1>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Overview Box */}
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            width: '400px',
            height: '360px',
            overflowY: 'auto',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            Overview Summary
          </h2>

          {/* Class Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="class-select" style={{ marginRight: '8px' }}>Select Class:</label>
            {loadingClasses ? (
              <span>Loading classes...</span>
            ) : errorClasses ? (
              <span style={{ color: 'red' }}>{errorClasses}</span>
            ) : (
              <select
                id="class-select"
                value={selectedClassId || ''}
                onChange={(e) => setSelectedClassId(e.target.value)}
                style={{ padding: '6px', fontSize: '16px' }}
              >
                <option value="" disabled>
                  -- Select a class --
                </option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.topic}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Overview Content */}
          {loadingOverview ? (
            <p>Loading overview...</p>
          ) : errorOverview ? (
            <p style={{ color: 'red' }}>{errorOverview}</p>
          ) : overview ? (
            <div style={{ lineHeight: '1.6' }}>
              <p><strong>Total Quizzes:</strong> {overview.totalQuizzes}</p>
              <p><strong>Total Students:</strong> {overview.totalStudents}</p>
              <p><strong>Total Submissions:</strong> {overview.totalSubmissions}</p>
              <p><strong>Total Engagement Points:</strong> {overview.totalEngagementPoints}</p>
              <p><strong>Average Engagement Points:</strong> {overview.averageEngagementPoints.toFixed(2)}</p>
              <p><strong>Lesson Completion Rate:</strong> {overview.lessonCompletionRate.toFixed(2)}%</p>
              <p><strong>Average Quiz Score:</strong> {(overview.averageQuizScore * 100).toFixed(2)}%</p>
            </div>
          ) : (
            <p>No overview data available.</p>
          )}
        </div>

        {/* Live Activity Box */}
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            width: '400px',
            height: '360px',
            overflowY: 'auto',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            Live Activity (Coming Soon)
          </h2>
          <p>This section will show live activity and real-time progress indicators for your class.</p>
        </div>
      </div>
    </div>
  );
}
