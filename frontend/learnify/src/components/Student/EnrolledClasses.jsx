import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classService from "../../services/classService";
import { useAuth } from "../../context/AuthContext";

const EnrolledClasses = () => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      if (currentUser) {
        try {
          setLoading(true); // Start loading
          const res = await classService.getClassesByStudentIdWithUsers(currentUser.id);
          setClasses(res);
        } catch (err) {
          console.error("Error fetching enrolled classes:", err);
        } finally {
          setLoading(false); // Done loading
        }
      }
    };

    fetchEnrolledClasses();
  }, [currentUser]);

  return (
    <div>
      <h2>My Enrolled Classes</h2>
      {loading ? (
        <p>Still loading...</p>
      ) : classes.length === 0 ? (
        <p>You are not enrolled in any classes yet.</p>
      ) : (
        <ul>
          {classes.map((clazz) => {
            const hasQuiz = Array.isArray(clazz.quizzes) && clazz.quizzes.length > 0;

            return (
              <li key={clazz.id}>
                <strong>{clazz.topic}</strong><br />
                <strong>Teacher:</strong> {clazz.teacher?.fullName || "Unknown"}<br />
                <strong>Classmates:</strong>
                <ul>
                  {clazz.classmates?.map((classmate) => (
                    <li key={classmate.id}>{classmate.fullName}</li>
                  ))}
                </ul>

                {hasQuiz ? (
                  <Link to={`/quiz/${clazz.id}`} className="quiz-link">
                    📝 Take Quiz
                  </Link>
                ) : (
                  <button disabled style={{ opacity: 0.5 }}>
                    No Quiz Available
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default EnrolledClasses;
