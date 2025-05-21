import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

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
    tertiary: '#f6ad55',
    tertiaryLight: 'rgba(246, 173, 85, 0.1)',
    tertiaryGradient: 'linear-gradient(135deg, #f6ad55 0%, #f97316 100%)',
    quaternary: '#8884d8',
    quaternaryLight: 'rgba(136, 132, 216, 0.1)',
    quaternaryGradient: 'linear-gradient(135deg, #8884d8 0%, #6366f1 100%)',
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
    hover: '0 10px 30px rgba(0, 0, 0, 0.15)',
  },
  // Animations
  animations: {
    fadeIn: 'fadeIn 0.8s ease-out',
    slideUp: 'slideUp 0.5s ease-out forwards',
    pulse: 'pulse 2s infinite',
  }
};

export default function Dashboard() {
  const { currentUser, isTeacher, isStudent } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [stats, setStats] = useState({
    completedLessons: 0,
    quizzesTaken: 0,
    averageScore: 0,
    engagementPoints: 0
  });
  
  // Simulate fetching data
  useEffect(() => {
    if (!currentUser) return;
    
    // This would be replaced with actual API calls
    setTimeout(() => {
      setRecentActivity([
        { id: 1, type: 'quiz', title: 'Introduction to Fractions', date: new Date(Date.now() - 86400000).toISOString(), score: 85 },
        { id: 2, type: 'lesson', title: 'Multiplication Tables', date: new Date(Date.now() - 172800000).toISOString() },
        { id: 3, type: 'quiz', title: 'Basic Algebra', date: new Date(Date.now() - 259200000).toISOString(), score: 92 },
      ]);
      
      setUpcomingQuizzes([
        { id: 1, title: 'Division Practice', dueDate: new Date(Date.now() + 86400000).toISOString() },
        { id: 2, title: 'Geometry Basics', dueDate: new Date(Date.now() + 172800000).toISOString() },
      ]);
      
      setStats({
        completedLessons: 12,
        quizzesTaken: 8,
        averageScore: 88,
        engagementPoints: 450
      });
    }, 1000);
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: styles.colors.background,
      }}>
        <div style={{
          padding: '2rem',
          backgroundColor: styles.colors.cardBg,
          borderRadius: '8px',
          boxShadow: styles.shadows.medium,
          textAlign: 'center',
        }}>
          Loading user data...
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div style={{
      padding: '32px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      backgroundColor: styles.colors.background,
      backgroundImage: 'radial-gradient(#e0e6f2 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      minHeight: '100vh',
    }}>
      {/* Welcome Header */}
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
          Welcome Back, {currentUser.name}!
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
          {isTeacher ? 
            "Track your classes, manage quizzes, and monitor student progress" : 
            "Continue your learning journey and track your progress"}
        </p>
      </div>

      {/* Dashboard Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Stats Overview */}
        <div style={{
          backgroundColor: styles.colors.cardBg,
          borderRadius: '16px',
          boxShadow: styles.shadows.medium,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          position: 'relative',
          animation: styles.animations.slideUp,
          opacity: 0,
          animationDelay: '0.1s',
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '6px',
            background: styles.colors.primaryGradient,
          }}></div>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: styles.colors.primary,
              position: 'relative',
              display: 'inline-block',
              paddingBottom: '0.5rem',
            }}>
              Your Progress
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '40px',
                height: '3px',
                background: styles.colors.primaryGradient,
                borderRadius: '3px',
              }}></div>
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}>
              <div style={{
                backgroundColor: styles.colors.primaryLight,
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: styles.colors.primary }}>
                  {stats.completedLessons}
                </div>
                <div style={{ color: styles.colors.text, fontSize: '0.9rem' }}>
                  Lessons Completed
                </div>
              </div>
              
              <div style={{
                backgroundColor: styles.colors.secondaryLight,
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: styles.colors.secondary }}>
                  {stats.quizzesTaken}
                </div>
                <div style={{ color: styles.colors.text, fontSize: '0.9rem' }}>
                  Quizzes Taken
                </div>
              </div>
              
              <div style={{
                backgroundColor: styles.colors.tertiaryLight,
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f97316' }}>
                  {stats.averageScore}%
                </div>
                <div style={{ color: styles.colors.text, fontSize: '0.9rem' }}>
                  Average Score
                </div>
              </div>
              
              <div style={{
                backgroundColor: styles.colors.quaternaryLight,
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: styles.colors.quaternary }}>
                  {stats.engagementPoints}
                </div>
                <div style={{ color: styles.colors.text, fontSize: '0.9rem' }}>
                  Engagement Points
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: styles.colors.cardBg,
          borderRadius: '16px',
          boxShadow: styles.shadows.medium,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          position: 'relative',
          animation: styles.animations.slideUp,
          opacity: 0,
          animationDelay: '0.2s',
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '6px',
            background: styles.colors.secondaryGradient,
          }}></div>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: styles.colors.secondary,
              position: 'relative',
              display: 'inline-block',
              paddingBottom: '0.5rem',
            }}>
              Recent Activity
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '40px',
                height: '3px',
                background: styles.colors.secondaryGradient,
                borderRadius: '3px',
              }}></div>
            </h2>
            
            {recentActivity.length === 0 ? (
              <div style={{
                padding: '1.5rem',
                textAlign: 'center',
                color: styles.colors.textLight,
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
              }}>
                No recent activity to display
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentActivity.map((activity) => (
                  <div key={activity.id} style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #eee',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    ':hover': {
                      backgroundColor: '#fff',
                      boxShadow: styles.shadows.small,
                    }
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ 
                        fontWeight: '600', 
                        color: styles.colors.text,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}>
                        <span style={{
                          display: 'inline-block',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: activity.type === 'quiz' ? styles.colors.primaryLight : styles.colors.secondaryLight,
                          color: activity.type === 'quiz' ? styles.colors.primary : styles.colors.secondary,
                          textAlign: 'center',
                          lineHeight: '24px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                        }}>
                          {activity.type === 'quiz' ? 'Q' : 'L'}
                        </span>
                        {activity.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: styles.colors.textLight }}>
                        {formatDate(activity.date)}
                      </div>
                    </div>
                    {activity.type === 'quiz' && (
                      <div style={{ 
                        fontSize: '0.9rem',
                        color: activity.score >= 80 ? styles.colors.secondary : styles.colors.tertiary,
                        fontWeight: '600',
                      }}>
                        Score: {activity.score}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Quizzes */}
        <div style={{
          backgroundColor: styles.colors.cardBg,
          borderRadius: '16px',
          boxShadow: styles.shadows.medium,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          position: 'relative',
          animation: styles.animations.slideUp,
          opacity: 0,
          animationDelay: '0.3s',
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '6px',
            background: styles.colors.tertiaryGradient,
          }}></div>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#f97316',
              position: 'relative',
              display: 'inline-block',
              paddingBottom: '0.5rem',
            }}>
              Upcoming Quizzes
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '40px',
                height: '3px',
                background: styles.colors.tertiaryGradient,
                borderRadius: '3px',
              }}></div>
            </h2>
            
            {upcomingQuizzes.length === 0 ? (
              <div style={{
                padding: '1.5rem',
                textAlign: 'center',
                color: styles.colors.textLight,
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
              }}>
                No upcoming quizzes
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcomingQuizzes.map((quiz) => (
                  <div key={quiz.id} style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #eee',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    ':hover': {
                      backgroundColor: '#fff',
                      boxShadow: styles.shadows.small,
                    }
                  }}>
                    <div style={{ fontWeight: '600', color: styles.colors.text, marginBottom: '0.5rem' }}>
                      {quiz.title}
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: styles.colors.textLight,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <span style={{ fontWeight: '600' }}>Due:</span> {formatDate(quiz.dueDate)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: styles.colors.cardBg,
          borderRadius: '16px',
          boxShadow: styles.shadows.medium,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          position: 'relative',
          animation: styles.animations.slideUp,
          opacity: 0,
          animationDelay: '0.4s',
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '6px',
            background: styles.colors.quaternaryGradient,
          }}></div>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: styles.colors.quaternary,
              position: 'relative',
              display: 'inline-block',
              paddingBottom: '0.5rem',
            }}>
              Quick Actions
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '40px',
                height: '3px',
                background: styles.colors.quaternaryGradient,
                borderRadius: '3px',
              }}></div>
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {isTeacher ? (
                <>
                  <Link to="/teacher/classes" style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: styles.colors.primaryLight,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      ':hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: styles.shadows.small,
                      }
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍👩‍👧‍👦</div>
                      <div style={{ fontWeight: '600', color: styles.colors.primary }}>Manage Classes</div>
                    </div>
                  </Link>
                  
                  <Link to="/teacher/quizzes" style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: styles.colors.secondaryLight,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      ':hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: styles.shadows.small,
                      }
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                      <div style={{ fontWeight: '600', color: styles.colors.secondary }}>Manage Quizzes</div>
                    </div>
                  </Link>
                  
                  <Link to="/teacher/progress" style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: styles.colors.tertiaryLight,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      ':hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: styles.shadows.small,
                      }
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                      <div style={{ fontWeight: '600', color: '#f97316' }}>View Progress</div>
                    </div>
                  </Link>
                  
                  <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: styles.colors.quaternaryLight,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      ':hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: styles.shadows.small,
                      }
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
                      <div style={{ fontWeight: '600', color: styles.colors.quaternary }}>Profile</div>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/student/lessons" style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: styles.colors.primaryLight,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      ':hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: styles.shadows.small,
                      }
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
                      <div style={{ fontWeight: '600', color: styles.colors.primary }}>My Lessons</div>
                    </div>
                  </Link>
                  
                  <Link to="/student/quizzes" style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: styles.colors.secondaryLight,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      ':hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: styles.shadows.small,
                      }
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                      <div style={{ fontWeight: '600', color: styles.colors.secondary }}>My Quizzes</div>
                    </div>
                  </Link>
                  
                  <Link to="/student/progress" style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: styles.colors.tertiaryLight,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      ':hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: styles.shadows.small,
                      }
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                      <div style={{ fontWeight: '600', color: '#f97316' }}>My Progress</div>
                    </div>
                  </Link>
                  
                  <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: styles.colors.quaternaryLight,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      ':hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: styles.shadows.small,
                      }
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
                      <div style={{ fontWeight: '600', color: styles.colors.quaternary }}>Profile</div>
                    </div>
                  </Link>
                </>
              )}
            </div>
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

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}} />
    </div>
  );
}