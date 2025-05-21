import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import classService from '../../services/classService';
import {
  fetchClassPerformance,
  fetchQuizAverages,
  fetchEngagementHeatmap,
  fetchTemporalProgress,
} from '../../services/progressReportService';
import ClassPerformanceChart from './ClassPerformanceChart';
import QuizAverageChart from './QuizAverageChart';
import EngagementHeatmap from './EngagementHeatmap';
import TemporalProgressChart from './TemporalProgressChart';

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

export default function ProgressReport() {
  const { currentUser, isTeacher } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const [classPerformance, setClassPerformance] = useState([]);
  const [quizAverages, setQuizAverages] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [temporalData, setTemporalData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.id) return;

    async function fetchClasses() {
      setLoading(true);
      setError(null);
      try {
        let data = [];
        if (isTeacher) {
          data = await classService.getClassesByTeacherId(currentUser.id);
        } else {
          data = await classService.getClassesByStudentIdWithUsers(currentUser.id);
        }
        setClasses(data);
        if (data.length > 0) {
          setSelectedClassId(data[0].id);
        } else {
          setSelectedClassId(null);
        }
      } catch (err) {
        setError('Failed to load classes.');
        setSelectedClassId(null);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, [currentUser, isTeacher]);

  useEffect(() => {
    if (!selectedClassId) return;

    async function fetchAllProgressData() {
      setLoading(true);
      setError(null);
      try {
        const [
          classPerfRes,
          quizAvgRes,
          heatmapRes,
          temporalRes,
        ] = await Promise.all([
          fetchClassPerformance(selectedClassId),
          fetchQuizAverages(selectedClassId),
          fetchEngagementHeatmap(selectedClassId),
          fetchTemporalProgress(selectedClassId),
        ]);
        setClassPerformance(classPerfRes.data || []);
        setQuizAverages(quizAvgRes.data || []);
        setHeatmapData(heatmapRes.data || []);
        setTemporalData(temporalRes.data || []);
      } catch (err) {
        setError('Failed to load progress report data.');
      } finally {
        setLoading(false);
      }
    }

    fetchAllProgressData();
  }, [selectedClassId]);

  if (!currentUser || !currentUser.id) {
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

  if (loading) {
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
          animation: styles.animations.pulse,
        }}>
          Loading progress report...
        </div>
      </div>
    );
  }

  if (error) {
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
          backgroundColor: styles.colors.dangerLight,
          borderRadius: '8px',
          boxShadow: styles.shadows.medium,
          textAlign: 'center',
          color: styles.colors.danger,
          borderLeft: `4px solid ${styles.colors.danger}`,
        }}>
          {error}
        </div>
      </div>
    );
  }

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
          Visual Progress Report
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
          Visualize student performance and engagement metrics across your classes
        </p>
      </div>

      <div style={{
        marginBottom: '2rem',
        animation: styles.animations.slideUp,
        animationDelay: '0.1s',
        opacity: 0,
      }}>
        <label htmlFor="class-select" style={{ 
          marginRight: '1rem',
          fontWeight: '600',
          color: styles.colors.text,
          fontSize: '1.05rem',
        }}>
          Select Class:
        </label>
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
            minWidth: '250px',
          }}
        >
          <option value="" disabled>-- Select a class --</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.topic}</option>
          ))}
        </select>
      </div>

      {selectedClassId ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Class Performance Chart */}
          <div style={{
            backgroundColor: styles.colors.cardBg,
            borderRadius: '16px',
            boxShadow: styles.shadows.medium,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            position: 'relative',
            animation: styles.animations.slideUp,
            animationDelay: '0.2s',
            opacity: 0,
            ':hover': {
              boxShadow: styles.shadows.hover,
              transform: 'translateY(-5px)',
            }
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '6px',
              background: styles.colors.primaryGradient,
            }}></div>
            <ClassPerformanceChart data={classPerformance} />
          </div>

          {/* Quiz Average Chart */}
          <div style={{
            backgroundColor: styles.colors.cardBg,
            borderRadius: '16px',
            boxShadow: styles.shadows.medium,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            position: 'relative',
            animation: styles.animations.slideUp,
            animationDelay: '0.3s',
            opacity: 0,
            ':hover': {
              boxShadow: styles.shadows.hover,
              transform: 'translateY(-5px)',
            }
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '6px',
              background: styles.colors.secondaryGradient,
            }}></div>
            <QuizAverageChart data={quizAverages} />
          </div>

          {/* Engagement Heatmap */}
          <div style={{
            backgroundColor: styles.colors.cardBg,
            borderRadius: '16px',
            boxShadow: styles.shadows.medium,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            position: 'relative',
            animation: styles.animations.slideUp,
            animationDelay: '0.4s',
            opacity: 0,
            ':hover': {
              boxShadow: styles.shadows.hover,
              transform: 'translateY(-5px)',
            }
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '6px',
              background: styles.colors.tertiaryGradient,
            }}></div>
            <EngagementHeatmap data={heatmapData} />
          </div>

          {/* Future Analytics Box */}
          <div style={{
            backgroundColor: styles.colors.cardBg,
            borderRadius: '16px',
            boxShadow: styles.shadows.medium,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            position: 'relative',
            animation: styles.animations.slideUp,
            animationDelay: '0.5s',
            opacity: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '2rem',
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '6px',
              background: styles.colors.quaternaryGradient,
            }}></div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '0.5rem',
              color: styles.colors.text,
            }}>
              Future Analytics
            </h3>
            <p style={{ 
              color: styles.colors.textLight,
              textAlign: 'center',
              maxWidth: '80%',
            }}>
              Additional insights and analytics will be available in future updates.
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '3rem',
          backgroundColor: styles.colors.cardBg,
          borderRadius: '16px',
          boxShadow: styles.shadows.medium,
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          animation: styles.animations.fadeIn,
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <p style={{ 
            color: styles.colors.textLight,
            fontSize: '1.1rem',
          }}>
            No classes available to show progress report.
          </p>
        </div>
      )}

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
