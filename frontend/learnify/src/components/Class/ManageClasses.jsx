import React, { useEffect, useState, useCallback } from "react";
import classService from "../../services/classService";
import studentService from "../../services/studentService";
import { useAuth } from "../../context/AuthContext";
import '../../components/CSS/ManageClasses.css'

const ManageClasses = () => {
  const { currentUser, isTeacher } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [topic, setTopic] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editingTopic, setEditingTopic] = useState("");
  const [editingSelectedStudents, setEditingSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editSearchTerm, setEditSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("enrolled");

  const fetchAll = useCallback(async () => {
    try {
      let classData = [];
      if (isTeacher) {
        classData = await classService.getClassesByTeacherId(currentUser.id);
      } else {
        classData = await classService.getClassesByStudentIdWithUsers(currentUser.id);
      }

      const studentData = await studentService.getAllStudents();

      classData = classData.map(cls => ({
        ...cls,
        students: cls.studentIds.map(studentId =>
          studentData.find(s => s.id === studentId)
        ).filter(Boolean)
      }));

      setStudents(studentData);
      setClasses(classData);
    } catch (error) {
      console.error("Failed to fetch classes or students:", error);
    }
  }, [currentUser.id, isTeacher]); // <- dependencies used inside fetchAll

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const toggleStudentSelection = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleEditingStudentSelection = (id) => {
    setEditingSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleCreate = async (e) => {
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
      if (result && result.id) {
        alert("Class created with ID: " + result.id);
        setTopic("");
        setSelectedStudents([]);
        setSearchTerm("");
        await fetchAll(); // Refresh data
      } else {
        throw new Error("Class creation failed due to unexpected response.");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await classService.deleteClass(id);
      await fetchAll(); // Refresh after delete
    } catch (err) {
      console.error("Failed to delete class:", err);
    }
  };

  const handleEditClick = (cls) => {
    setEditingClassId(cls.id);
    setEditingTopic(cls.topic);
    setEditingSelectedStudents(cls.students.map((s) => s.id));
    setEditSearchTerm("");
    setActiveTab("edit");
  };

  const handleUpdate = async () => {
    if (!editingTopic || editingSelectedStudents.length === 0) {
      alert("Topic and students are required.");
      return;
    }

    const updatedClass = {
      id: editingClassId,
      topic: editingTopic,
      teacherId: currentUser.id,
      studentIds: editingSelectedStudents,
    };

    try {
      await classService.updateClass(editingClassId, updatedClass);
      await fetchAll(); // Refresh after update
      setEditingClassId(null);
      setEditingTopic("");
      setEditingSelectedStudents([]);
      setActiveTab("enrolled");
    } catch (error) {
      console.error("Failed to update class:", error);
    }
  };

  const filteredCreateStudents = students.filter(
    (s) =>
      (s.grade === 4 || s.grade === 5) &&
      (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredEditStudents = (included = true) =>
    students.filter((s) => {
      const isIncluded = editingSelectedStudents.includes(s.id);
      const matchesSearch =
        s.name.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(editSearchTerm.toLowerCase());
      return (s.grade === 4 || s.grade === 5) && matchesSearch && (included ? isIncluded : !isIncluded);
    });

  return (
    <div className="manage-classes-container">
      <div className="manage-classes-header">
        <h1>Class Management</h1>
        <p color="#000000">Create and manage your classes and student enrollments</p>
      </div>

      <div className="manage-classes-content">
        {/* Create Class Section */}
        <div className="create-class-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create New Class
          </div>

          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="topic">Class Topic</label>
              <input
                id="topic"
                type="text"
                className="form-control"
                placeholder="Enter class topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Select Students</label>
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="student-list">
                {filteredCreateStudents.length > 0 ? (
                  filteredCreateStudents.map((student) => (
                    <div key={student.id} className="student-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                        />
                        <div className="student-info">
                          <span className="student-name">{student.name}</span>
                          <span className="student-email">{student.email}</span>
                        </div>
                        <span className="grade-badge">Grade {student.grade}</span>
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="no-students">No students found</p>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Class
            </button>
          </form>
        </div>

        {/* Existing Classes Section */}
        <div className="existing-classes-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-4-4h-4" />
            </svg>
            My Classes
          </div>

          <div className="tabs">
            <button
              className={activeTab === "enrolled" ? "active" : ""}
              onClick={() => setActiveTab("enrolled")}
            >
              Enrolled Students
            </button>
            <button
              className={activeTab === "edit" ? "active" : ""}
              onClick={() => setActiveTab("edit")}
              disabled={!editingClassId}
            >
              Edit Class
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "enrolled" && (
              <>
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <div className="class-item" key={cls.id}>
                      <div className="class-info">
                        <h3>{cls.topic}</h3>
                        <h4>Enrolled Students ({cls.students?.length || 0})</h4>
                        <div className="students">
                          {cls.students && cls.students.length > 0 ? (
                            cls.students.map((student) => (
                              <div key={student.id} className="student">
                                <span>{student.name}</span>
                                <span className="badge">Grade {student.grade}</span>
                              </div>
                            ))
                          ) : (
                            <p>No students enrolled</p>
                          )}
                        </div>
                      </div>

                      <div className="actions">
                        <button onClick={() => handleEditClick(cls)}>Edit</button>
                        <button onClick={() => handleDelete(cls.id)}>Delete</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No classes found</p>
                )}
              </>
            )}

            {activeTab === "edit" && editingClassId && (
              <>
                <h3>Edit Class</h3>
                <div className="form-group">
                  <label>Topic</label>
                  <input
                    type="text"
                    value={editingTopic}
                    onChange={(e) => setEditingTopic(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Enrolled Students</label>
                  <div className="search-input">
                    <input
                      type="text"
                      placeholder="Search by name or email"
                      value={editSearchTerm}
                      onChange={(e) => setEditSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="student-list">
                    {filteredEditStudents(true).map((student) => (
                      <div key={student.id} className="student-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={editingSelectedStudents.includes(student.id)}
                            onChange={() => toggleEditingStudentSelection(student.id)}
                          />
                          <div className="student-info">
                            <span className="student-name">{student.name}</span>
                            <span className="student-email">{student.email}</span>
                          </div>
                          <span className="grade-badge">Grade {student.grade}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Available Students</label>
                  <div className="student-list">
                    {filteredEditStudents(false).map((student) => (
                      <div key={student.id} className="student-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => toggleEditingStudentSelection(student.id)}
                          />
                          <div className="student-info">
                            <span className="student-name">{student.name}</span>
                            <span className="student-email">{student.email}</span>
                          </div>
                          <span className="grade-badge">Grade {student.grade}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleUpdate} className="btn btn-primary">
                  Update Class
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageClasses;
