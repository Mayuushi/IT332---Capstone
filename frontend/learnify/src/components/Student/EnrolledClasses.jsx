import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classService from "../../services/classService";
import { useAuth } from "../../context/AuthContext";
import "../CSS/EnrolledClasses.css";

const EnrolledClasses = () => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedClasses, setExpandedClasses] = useState({});

  const toggleClassmates = (classId) => {
    setExpandedClasses(prev => ({
      ...prev,
      [classId]: !prev[classId]
    }));
  };

  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const res = await classService.getClassesByStudentIdWithUsers(currentUser.id);
          setClasses(res);
        } catch (err) {
          console.error("Error fetching enrolled classes:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEnrolledClasses();
  }, [currentUser]);

  return (
    <div className="enrolled-classes">
      <h2 className="enrolled-classes__title">My Enrolled Classes</h2>
      
      {loading ? (
        <div className="enrolled-classes__loading">
          <span className="loading-indicator"></span>
          <p>Loading your classes...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="enrolled-classes__empty">
          <p>You are not enrolled in any classes yet.</p>
        </div>
      ) : (
        <div className="class-grid">
          {classes.map((clazz) => {
            const hasQuiz = Array.isArray(clazz.quizzes) && clazz.quizzes.length > 0;

            return (
              <div key={clazz.id} className="class-card">
                <div className="class-card__header">
                  <h3 className="class-card__topic">{clazz.topic}</h3>
                </div>
                <div className="class-card__content">
                  <div className="class-card__teacher">
                    <span className="label">Teacher</span>
                    <span>{clazz.teacher?.fullName || "Unknown"}</span>
                  </div>
                  
                  <div className="class-card__classmates">
                    <div className="classmates-header">
                      <span className="label">Classmates</span>
                      <button 
                        className="toggle-button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleClassmates(clazz.id);
                        }}
                      >
                        {expandedClasses[clazz.id] ? 'Hide' : 'Show All'}
                      </button>
                    </div>
                    
                    {!expandedClasses[clazz.id] ? (
                      <div className="classmates-preview">
                        {clazz.classmates && clazz.classmates.length > 0 ? 
                          `${clazz.classmates.length} classmate${clazz.classmates.length !== 1 ? 's' : ''}` : 
                          'No classmates'
                        }
                      </div>
                    ) : (
                      <div className="classmates-list">
                        {clazz.classmates?.length > 0 ? 
                          clazz.classmates.map((classmate) => (
                            <span key={classmate.id} className="classmate">
                              {classmate.fullName}
                            </span>
                          )) : 
                          <span className="no-classmates">No classmates</span>
                        }
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="class-card__actions">
                  <Link to={`/lessons/${clazz.id}`} className="action-button lessons-button">
                    Lessons
                  </Link>
                  {hasQuiz ? (
                    <Link to={`/quiz/${clazz.id}`} className="action-button quiz-button">
                      Take Quiz
                    </Link>
                  ) : (
                    <button className="action-button quiz-button quiz-button--disabled" disabled>
                      No Quiz
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrolledClasses;