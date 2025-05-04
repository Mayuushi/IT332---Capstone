import React, { useEffect, useState } from "react";
import studentService from "../../services/studentService";
import classService from "../../services/classService";
import { useAuth } from "../../context/AuthContext";

const ManageClasses = () => {
  const { currentUser } = useAuth();

  const [topic, setTopic] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await studentService.getAllStudents();
        setStudents(res);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
    fetchStudents();
  }, []);

  // Fetch classes with students
  const fetchClasses = async () => {
    try {
      const data = await classService.getAllClassesWithStudents();
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes with students:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const toggleStudentSelection = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic || selectedStudents.length === 0) {
      alert("Please enter a topic and select at least one student.");
      return;
    }

    const classData = {
      topic,
      teacherId: currentUser.id,
      studentIds: selectedStudents,
    };

    try {
      const result = await classService.createClass(classData);
      alert("Class created with ID: " + result.id);
      setTopic("");
      setSelectedStudents([]);
      await fetchClasses(); // Refresh class list after creation
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* CREATE CLASS CONTAINER */}
      <div style={{ marginBottom: "3rem", border: "1px solid #aaa", padding: "1rem", borderRadius: "8px" }}>
        <h2>Create Class</h2>
        <input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{ padding: "0.5rem", marginBottom: "1rem", width: "100%" }}
        />
        <h3>Select Students:</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {students.map((s) => (
            <li key={s.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s.id)}
                  onChange={() => toggleStudentSelection(s.id)}
                />
                {s.name} (Grade {s.grade})
              </label>
            </li>
          ))}
        </ul>
        <button onClick={handleSubmit} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
          Create Class
        </button>
      </div>

      {/* CLASS LIST CONTAINER */}
      <div>
        <h2>Classes With Students</h2>
        {classes.length === 0 ? (
          <p>No classes found.</p>
        ) : (
          classes.map((c) => (
            <div
              key={c.id}
              style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}
            >
              <h3>Topic: {c.topic}</h3>
              <p>Teacher ID: {c.teacherId}</p>
              <h4>Students:</h4>
              {c.students.length === 0 ? (
                <p>No students enrolled.</p>
              ) : (
                <ul>
                  {c.students.map((s) => (
                    <li key={s.id}>
                      {s.name} (Grade {s.grade}) - {s.email}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageClasses;
