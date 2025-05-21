import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import classService from '../../services/classService';
import teacherDashboardService from '../../services/teacherDashboardService';
import { Activity, Users, BookOpen, Award, BarChart2, Clock, TrendingUp } from 'lucide-react';

export default function TeacherDashboardOverview() {
  const { currentUser, isTeacher } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const [overview, setOverview] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [errorOverview, setErrorOverview] = useState(null);

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [errorClasses, setErrorClasses] = useState(null);
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false);

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

  // Animation effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!currentUser || !currentUser.id) {
    return <div>Loading user...</div>;
  }

  // Function to get gradient color based on value
  const getGradientColor = (value, max = 100) => {
    const percentage = (value / max) * 100;
    if (percentage >= 75) return 'linear-gradient(135deg, #4ade80, #22c55e)';
    if (percentage >= 50) return 'linear-gradient(135deg, #facc15, #eab308)';
    return 'linear-gradient(135deg, #f87171, #ef4444)';
  };

  return (
    <div style={{ 
      padding: '32px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: 'bold', 
        marginBottom: '24px',
        color: '#1e293b',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '12px'
      }}>
        Teacher Dashboard Overview
      </h1>

      <div style={{ 
        display: 'flex', 
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Overview Box */}
        <div
          style={{
            border: 'none',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
            width: '400px',
            height: '460px',
            overflowY: 'auto',
            transition: 'all 0.5s ease',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            position: 'relative'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(to right, #667eea, #764ba2)',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px'
          }}></div>
          
          <h2 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <BarChart2 size={24} color="#667eea" />
            Overview Summary
          </h2>

          {/* Class Selector */}
          <div style={{ 
            marginBottom: '20px',
            background: '#f1f5f9',
            padding: '12px',
            borderRadius: '8px'
          }}>
            <label htmlFor="class-select" style={{ 
              marginRight: '12px',
              fontWeight: '500',
              color: '#475569'
            }}>
              <Users size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} />
              Select Class:
            </label>
            {loadingClasses ? (
              <span style={{ color: '#64748b', fontStyle: 'italic' }}>Loading classes...</span>
            ) : errorClasses ? (
              <span style={{ color: '#ef4444', fontWeight: '500' }}>{errorClasses}</span>
            ) : (
              <select
                id="class-select"
                value={selectedClassId || ''}
                onChange={(e) => setSelectedClassId(e.target.value)}
                style={{ 
                  padding: '8px 12px', 
                  fontSize: '16px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  width: '100%',
                  marginTop: '8px',
                  color: '#334155'
                }}
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
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '200px',
              color: '#64748b'
            }}>
              <div style={{ 
                border: '3px solid #e2e8f0',
                borderTopColor: '#667eea',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                animation: 'spin 1s linear infinite',
              }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : errorOverview ? (
            <p style={{ color: '#ef4444', padding: '16px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
              {errorOverview}
            </p>
          ) : overview ? (
            <div style={{ lineHeight: '1.8' }}>
              {/* Stat cards with animations */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                  color: 'white',
                  boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
                  animation: 'fadeIn 0.5s ease-in-out',
                  animationDelay: '0.1s',
                  animationFillMode: 'both'
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}><Users size={14} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Students</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{overview.totalStudents}</div>
                </div>
                
                <div style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)',
                  color: 'white',
                  boxShadow: '0 4px 6px rgba(139, 92, 246, 0.2)',
                  animation: 'fadeIn 0.5s ease-in-out',
                  animationDelay: '0.2s',
                  animationFillMode: 'both'
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}><BookOpen size={14} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Quizzes</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{overview.totalQuizzes}</div>
                </div>
              </div>
              
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes progressAnimation {
                  from { width: 0; }
                  to { width: var(--progress-width); }
                }
              `}</style>
              
              {/* Progress bars */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', color: '#475569' }}><Award size={14} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Quiz Performance</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{(overview.averageQuizScore * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${overview.averageQuizScore * 100}%`, 
                      background: getGradientColor(overview.averageQuizScore * 100),
                      borderRadius: '4px',
                      animation: 'progressAnimation 1s ease-out',
                      '--progress-width': `${overview.averageQuizScore * 100}%`
                    }}></div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', color: '#475569' }}><TrendingUp size={14} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Lesson Completion</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{overview.lessonCompletionRate.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${overview.lessonCompletionRate}%`, 
                      background: getGradientColor(overview.lessonCompletionRate),
                      borderRadius: '4px',
                      animation: 'progressAnimation 1s ease-out',
                      '--progress-width': `${overview.lessonCompletionRate}%`
                    }}></div>
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: '20px', 
                  padding: '12px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '8px',
                  border: '1px dashed #cbd5e1'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                    <Activity size={18} color="#667eea" />
                    <span style={{ fontWeight: '500' }}>Total Engagement Points:</span>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: '#1e293b', 
                      fontSize: '18px',
                      marginLeft: 'auto'
                    }}>{overview.totalEngagementPoints}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              borderRadius: '8px'
            }}>
              <BookOpen size={32} style={{ color: '#94a3b8', margin: '0 auto 12px' }} />
              <p>No overview data available.</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>Select a class to view statistics</p>
            </div>
          )}
        </div>

        {/* Live Activity Box */}
        <div
          style={{
            border: 'none',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
            width: '400px',
            height: '460px',
            overflowY: 'auto',
            transition: 'all 0.5s ease',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            position: 'relative',
            transitionDelay: '0.2s'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(to right, #f97316, #f59e0b)',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px'
          }}></div>
          
          <h2 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Activity size={24} color="#f97316" />
            Live Activity
          </h2>
          
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              animation: 'pulse 2s infinite'
            }}>
              <Clock size={40} color="#f97316" />
            </div>
            
            <h3 style={{ color: '#334155', marginBottom: '12px', fontSize: '18px' }}>Coming Soon</h3>
            <p style={{ maxWidth: '280px', lineHeight: '1.6' }}>
              This section will show live activity and real-time progress indicators for your class.
            </p>
            
            {/* Animated dots */}
            <div style={{ 
              display: 'flex', 
              gap: '6px', 
              marginTop: '20px' 
            }}>
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                backgroundColor: '#f97316',
                animation: 'bounce 1.4s infinite ease-in-out',
                animationDelay: '0s'
              }}></div>
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                backgroundColor: '#f97316',
                animation: 'bounce 1.4s infinite ease-in-out',
                animationDelay: '0.2s'
              }}></div>
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                backgroundColor: '#f97316',
                animation: 'bounce 1.4s infinite ease-in-out',
                animationDelay: '0.4s'
              }}></div>
            </div>
            
            <style>{`
              @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
              }
              
              @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}
