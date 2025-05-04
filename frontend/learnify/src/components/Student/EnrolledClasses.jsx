import React, { useEffect, useState } from "react";
import classService from "../../services/classService";
import { useAuth } from "../../context/AuthContext";

const EnrolledClasses = () => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    console.log("✅ EnrolledClasses mounted");
  }, []);
  

  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      if (currentUser) {
        try {
          const res = await classService.getClassesByStudentId(currentUser.id);
          setClasses(res);
        } catch (err) {
          console.error("Error fetching enrolled classes:", err);
        }
      }
    };

    fetchEnrolledClasses();
  }, [currentUser]);

  return (
    <div>
      <h2>My Enrolled Classes</h2>
      {classes.length === 0 ? (
        <p>You are not enrolled in any classes yet.</p>
      ) : (
        <ul>
          {classes.map((clazz) => (
            <li key={clazz.id}>
              <strong>{clazz.topic}</strong> (Teacher ID: {clazz.teacherId})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EnrolledClasses;
