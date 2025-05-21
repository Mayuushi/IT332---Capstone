import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import classService from '../../services/classService';
import teacherDashboardService from '../../services/teacherDashboardService';

// Define CSS variables for consistent styling
const styles = {
  // Color palette
  colors: {
    primary: '#4F46E5',
    primaryLight: 'rgba(79, 70, 229, 0.1)',
    primaryGradient: 'linear-gradient(135deg, #4F46E5 0%, #7367F0 100%)',
    secondary: '#34a853',
    secondaryLight: 'rgba(52, 168, 83, 0.1)',
    secondaryGradient: 'linear-gradient(135deg, #34a853 0%, #4eca6a 100%)',
    danger: '#ea4335',
    dangerLight: 'rgba(234, 67, 53, 0.1)',
    text: '#333333',
    textLight: '#757575',
    background: '#f7f9fc',
    cardBg: '#ffffff',
    border: '#e0e0e0',
  },
  // Shadows
  shadows: {
    small: '0 2px 5px rgba(0, 0, 0, 0.05)',
    medium: '0 4px 15px rgba(0, 0, 0, 0.08)',
    large: '0 8px 25px rgba(0, 0, 0, 0.12)',
  },
  // Animations
  animations: {
    fadeIn: 'fadeIn 0.8s ease-out',
    slideUp: 'slideUp 0.5s ease-out forwards',
  }
};

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
    <div style={{
      padding: '32px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      backgroundColor: styles.colors.background,
      backgroundImage: 'radial-gradient(#e0e6f2 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      minHeight: '100vh',
    }}>
      <div style={{
        marginBottom: '2.5rem',
        position: 'relative',
        paddingBottom: '1.25rem',
        animation: styles.animations.fadeIn,
        borderBottom: 'none',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          color: styles.colors.text,
          position: 'relative',
          display: 'inline-block',
        }}>
          Teacher Dashboard Overview
        </h1>
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
          height: '3px',
          background: styles.colors.primaryGradient,
          borderRadius: '3px',
          opacity: '0.7',
        }}></div>
        <p style={{
          color: '#000000',
          fontSize: '1.1rem',
          maxWidth: '80%',
          lineHeight: '1.6',
        }}>
          Create and manage your classes and monitor student progress
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Box 1: Overview Summary */}
        <div style={{
          ...boxStyle,
          animation: styles.animations.slideUp,
          boxShadow: styles.shadows.medium,
          transition: 'all 0.3s ease',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '6px',
            background: styles.colors.primaryGradient,
          }}></div>
          <h2 style={{
            ...boxTitleStyle,
            display: 'flex',
            alignItems: 'center',
            color: styles.colors.primary,
            position: 'relative',
            paddingBottom: '10px',
          }}>
            Overview Summary
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '50px',
              height: '3px',
              background: styles.colors.primaryGradient,
              borderRadius: '3px',
            }}></div>
          </h2>
          <div style={{ height: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="class-select" style={{ 
                marginRight: '8px',
                fontWeight: '600',
                color: styles.colors.text,
                fontSize: '1.05rem',
              }}>Select Class:</label>
              {loadingClasses ? (
                <span>Loading classes...</span>
              ) : errorClasses ? (
                <span style={{ color: styles.colors.danger }}>{errorClasses}</span>
              ) : (
                <select
                  id="class-select"
                  value={selectedClassId || ''}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  style={{ 
                    padding: '0.9rem 1.2rem',
                    border: `1.5px solid ${styles.colors.border}`,
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fbfbfd',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                    width: '100%',
                  }}
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
                <p style={{ color: styles.colors.danger }}>{errorOverview}</p>
              ) : overview ? (
                <div style={{ lineHeight: '1.6' }}>
                  {/* Overview data items with enhanced styling */}
                  <div style={{
                    padding: '12px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    backgroundColor: styles.colors.primaryLight,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <strong>Total Quizzes:</strong> 
                    <span style={{ fontWeight: 'bold' }}>{overview.totalQuizzes}</span>
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    backgroundColor: styles.colors.primaryLight,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <strong>Total Students:</strong> 
                    <span style={{ fontWeight: 'bold' }}>{overview.totalStudents}</span>
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    backgroundColor: styles.colors.primaryLight,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <strong>Total Submissions:</strong> 
                    <span style={{ fontWeight: 'bold' }}>{overview.totalSubmissions}</span>
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    backgroundColor: styles.colors.secondaryLight,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <strong>Total Engagement Points:</strong> 
                    <span style={{ fontWeight: 'bold' }}>{overview.totalEngagementPoints}</span>
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    backgroundColor: styles.colors.secondaryLight,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <strong>Average Engagement Points:</strong> 
                    <span style={{ fontWeight: 'bold' }}>{overview.averageEngagementPoints.toFixed(2)}</span>
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    backgroundColor: styles.colors.secondaryLight,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <strong>Lesson Completion Rate:</strong> 
                    <span style={{ fontWeight: 'bold' }}>{overview.lessonCompletionRate.toFixed(2)}%</span>
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    backgroundColor: styles.colors.secondaryLight,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <strong>Average Quiz Score:</strong> 
                    <span style={{ fontWeight: 'bold' }}>{(overview.averageQuizScore * 100).toFixed(2)}%</span>
                  </div>
                </div>
              ) : (
                <p>No overview data available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Box 2: Live Activity */}
        <div style={{
          ...boxStyle,
          animation: styles.animations.slideUp,
          boxShadow: styles.shadows.medium,
          transition: 'all 0.3s ease',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden',
          animationDelay: '0.1s',
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '6px',
            background: styles.colors.secondaryGradient,
          }}></div>
          <h2 style={{
            ...boxTitleStyle,
            display: 'flex',
            alignItems: 'center',
            color: styles.colors.secondary,
            position: 'relative',
            paddingBottom: '10px',
          }}>
            Live Activity & Session Tracking
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '50px',
              height: '3px',
              background: styles.colors.secondaryGradient,
              borderRadius: '3px',
            }}></div>
          </h2>
          <div style={{ height: 'calc(100% - 40px)', overflowY: 'auto' }}>
            {loadingRealTime ? (
              <p>Loading live activity...</p>
            ) : errorRealTime ? (
              <p style={{ color: styles.colors.danger }}>{errorRealTime}</p>
            ) : realTimeData ? (
              <>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: styles.colors.text,
                }}>Active Sessions:</h3>
                {realTimeData.activeSessions.length === 0 ? (
                  <p style={{
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: styles.colors.textLight,
                  }}>No active sessions currently.</p>
                ) : (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {realTimeData.activeSessions.map((session, idx) => (
                      <li key={idx} style={{
                        padding: '12px',
                        marginBottom: '10px',
                        borderRadius: '8px',
                        backgroundColor: styles.colors.primaryLight,
                        transition: 'transform 0.3s ease',
                        boxShadow: styles.shadows.small,
                        ':hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: styles.shadows.medium,
                        }
                      }}>
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
        <div style={{
          ...boxStyle,
          animation: styles.animations.slideUp,
          boxShadow: styles.shadows.medium,
          transition: 'all 0.3s ease',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden',
          animationDelay: '0.2s',
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '6px',
            background: styles.colors.primaryGradient,
          }}></div>
          <h2 style={{
            ...boxTitleStyle,
            display: 'flex',
            alignItems: 'center',
            color: styles.colors.primary,
            position: 'relative',
            paddingBottom: '10px',
          }}>
            Completed Sessions
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '50px',
              height: '3px',
              background: styles.colors.primaryGradient,
              borderRadius: '3px',
            }}></div>
          </h2>
          <div style={{ height: 'calc(100% - 40px)', overflowY: 'auto' }}>
            {loadingCompletedSessions ? (
              <p>Loading...</p>
            ) : errorCompletedSessions ? (
              <p style={{ color: styles.colors.danger }}>{errorCompletedSessions}</p>
            ) : completedSessions.length === 0 ? (
              <p style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textAlign: 'center',
                color: styles.colors.textLight,
              }}>No completed sessions.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'separate',
                  borderSpacing: '0 8px',
                }}>
                  <thead>
                    <tr style={{ 
                      position: 'sticky', 
                      top: 0, 
                      backgroundColor: 'white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px 8px',
                        color: styles.colors.text,
                        fontWeight: '600',
                        fontSize: '0.9rem',
                      }}>Student</th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px 8px',
                        color: styles.colors.text,
                        fontWeight: '600',
                        fontSize: '0.9rem',
                      }}>Activity</th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px 8px',
                        color: styles.colors.text,
                        fontWeight: '600',
                        fontSize: '0.9rem',
                      }}>Start Time</th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px 8px',
                        color: styles.colors.text,
                        fontWeight: '600',
                        fontSize: '0.9rem',
                      }}>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedSessions.map((session, idx) => (
                      <tr key={idx} style={{ 
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        boxShadow: styles.shadows.small,
                        transition: 'all 0.3s ease',
                      }}>
                        <td style={{ padding: '12px 8px', borderRadius: '8px 0 0 8px' }}>{session.studentName}</td>
                        <td style={{ padding: '12px 8px' }}>{session.activityType}</td>
                        <td style={{ padding: '12px 8px' }}>{new Date(session.startTime).toLocaleString()}</td>
                        <td style={{ padding: '12px 8px', borderRadius: '0 8px 8px 0' }}>{new Date(session.endTime).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Box 4: Empty Box - Could be used for future content */}
        <div style={{
          ...boxStyle,
          animation: styles.animations.slideUp,
          boxShadow: styles.shadows.medium,
          transition: 'all 0.3s ease',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden',
          animationDelay: '0.3s',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
        }}>
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: styles.colors.textLight,
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
            <h3 style={{ marginBottom: '8px', color: styles.colors.text }}>Future Analytics</h3>
            <p>This space will be used for additional analytics and insights.</p>
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
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