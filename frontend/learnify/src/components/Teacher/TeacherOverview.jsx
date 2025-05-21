import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import classService from '../../services/classService';
import teacherDashboardService from '../../services/teacherDashboardService';

export default function TeacherDashboardOverview() {
  const { currentUser, isTeacher } = useAuth();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const [overview, setOverview] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [completedSessions, setCompletedSessions] = useState([]);

  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingRealTime, setLoadingRealTime] = useState(false);
  const [loadingCompletedSessions, setLoadingCompletedSessions] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  const [errorOverview, setErrorOverview] = useState(null);
  const [errorRealTime, setErrorRealTime] = useState(null);
  const [errorCompletedSessions, setErrorCompletedSessions] = useState(null);
  const [errorClasses, setErrorClasses] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.id || !isTeacher) return;

    async function fetchClasses() {
      setLoadingClasses(true);
      try {
        const data = await classService.getClassesByTeacherId(currentUser.id);
        setClasses(data);
        setSelectedClassId(data.length > 0 ? data[0].id : null);
      } catch (err) {
        setErrorClasses('Failed to load classes.');
      } finally {
        setLoadingClasses(false);
      }
    }

    fetchClasses();
  }, [currentUser, isTeacher]);

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
      } catch {
        setErrorOverview('Failed to load overview.');
      } finally {
        setLoadingOverview(false);
      }
    }

    fetchOverview();
  }, [selectedClassId]);

  useEffect(() => {
    if (!selectedClassId) {
      setRealTimeData(null);
      return;
    }

    const fetchRealTime = async () => {
      setLoadingRealTime(true);
      setErrorRealTime(null);
      try {
        const data = await teacherDashboardService.getRealTimeMonitoringByClassId(selectedClassId);
        setRealTimeData(data);
      } catch {
        setErrorRealTime('Failed to load real-time monitoring data.');
      } finally {
        setLoadingRealTime(false);
      }
    };

    fetchRealTime();
    const intervalId = setInterval(fetchRealTime, 15000);

    return () => clearInterval(intervalId);
  }, [selectedClassId]);

  useEffect(() => {
    if (!selectedClassId) {
      setCompletedSessions([]);
      return;
    }

    const fetchCompletedSessions = async () => {
      setLoadingCompletedSessions(true);
      setErrorCompletedSessions(null);
      try {
        const data = await teacherDashboardService.getCompletedSessionsWithNames(selectedClassId);
        setCompletedSessions(data);
      } catch {
        setErrorCompletedSessions('Failed to load completed sessions.');
      } finally {
        setLoadingCompletedSessions(false);
      }
    };

    fetchCompletedSessions();
  }, [selectedClassId]);

  if (!currentUser || !currentUser.id) return <div>Loading user...</div>;

  return (
    <div style={{ padding: '32px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
        Teacher Dashboard Overview
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          maxWidth: '880px',
          margin: '0 auto',
        }}
      >
        {/* Box 1: Overview Summary */}
        <div style={boxStyle}>
          <h2 style={boxTitleStyle}>Overview Summary</h2>
          <div style={{ height: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column' }}>
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
                  <option value="" disabled>-- Select a class --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.topic}</option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
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
          </div>
        </div>

        {/* Box 2: Live Activity */}
        <div style={boxStyle}>
          <h2 style={boxTitleStyle}>Live Activity & Session Tracking</h2>
          <div style={{ height: 'calc(100% - 40px)', overflowY: 'auto' }}>
            {loadingRealTime ? (
              <p>Loading live activity...</p>
            ) : errorRealTime ? (
              <p style={{ color: 'red' }}>{errorRealTime}</p>
            ) : realTimeData ? (
              <>
                <h3>Active Sessions:</h3>
                {realTimeData.activeSessions.length === 0 ? (
                  <p>No active sessions currently.</p>
                ) : (
                  <ul>
                    {realTimeData.activeSessions.map((session, idx) => (
                      <li key={idx}>
                        Student: <strong>{session.studentName}</strong> | Activity: <strong>{session.activityType}</strong> | Started at: {new Date(session.startTime).toLocaleTimeString()}
                      </li>
                    ))}
                  </ul>
                )}
                
              </>
            ) : (
              <p>No live data available.</p>
            )}
          </div>
        </div>

        {/* Box 3: Completed Sessions */}
        <div style={boxStyle}>
          <h2 style={boxTitleStyle}>Completed Sessions</h2>
          <div style={{ height: 'calc(100% - 40px)', overflowY: 'auto' }}>
            {loadingCompletedSessions ? (
              <p>Loading...</p>
            ) : errorCompletedSessions ? (
              <p style={{ color: 'red' }}>{errorCompletedSessions}</p>
            ) : completedSessions.length === 0 ? (
              <p>No completed sessions.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd', position: 'sticky', top: 0, backgroundColor: 'white' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Student</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Activity</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Start Time</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {completedSessions.map((session, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px' }}>{session.studentName}</td>
                      <td style={{ padding: '8px' }}>{session.activityType}</td>
                      <td style={{ padding: '8px' }}>{new Date(session.startTime).toLocaleString()}</td>
                      <td style={{ padding: '8px' }}>{new Date(session.endTime).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Box 4: Empty Box */}
        <div style={boxStyle}>
          {/* Intentionally left empty */}
        </div>
      </div>
    </div>
  );
}

// Shared styles
const boxStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  backgroundColor: 'white',
  height: '360px',
  display: 'flex',
  flexDirection: 'column'
};

const boxTitleStyle = {
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '16px',
};
