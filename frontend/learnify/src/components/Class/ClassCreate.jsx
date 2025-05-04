import React, { useEffect, useState } from "react";
import axios from "axios";
import classService from "../../services/classService";
const ClassCreate = () => {
  const [topic, setTopic] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    axios.get("/api/students").then((res) => {
      setStudents(res.data);
    });

    // Replace with actual login session or selection
    setTeacherId("your-teacher-id");
  }, []);

  const toggleStudentSelection = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { topic, teacherId, studentIds: selectedStudents };
    const result = await classService.createClass(data);
    alert("Class created with ID: " + result.id);
  };

  return (
    <div>
      <h2>Create Class</h2>
      <input type="text" placeholder="Topic" onChange={(e) => setTopic(e.target.value)} />
      <h3>Select Students:</h3>
      <ul>
        {students.map((s) => (
          <li key={s.id}>
            <label>
              <input
                type="checkbox"
                value={s.id}
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
