import React, { useEffect, useState } from "react";
import studentService from "../../services/studentService";
import classService from "../../services/classService";
import { useAuth } from "../../context/AuthContext";

const ClassCreate = () => {
  const { currentUser } = useAuth();
  const [topic, setTopic] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

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
      teacherId: currentUser.id, // must match what backend expects
      studentIds: selectedStudents,
    };

    try {
      const result = await classService.createClass(classData);
      alert("Class created with ID: " + result.id);
      // Optionally reset form
      setTopic("");
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class.");
    }
  };

  return (
    <div>
      <h2>Create Class</h2>
      <input
        type="text"
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <h3>Select Students:</h3>
      <ul>
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
      <button onClick={handleSubmit}>Create Class</button>
    </div>
  );
};

export default ClassCreate;
