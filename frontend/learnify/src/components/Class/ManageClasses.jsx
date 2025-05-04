import React, { useEffect, useState } from "react";
import classService from "../../services/classService";
import studentService from "../../services/studentService";
import { useAuth } from "../../context/AuthContext";
import '../../components/CSS/ManageClasses.css'

const ManageClasses = () => {
  const { currentUser } = useAuth();
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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [classData, studentData] = await Promise.all([
          classService.getAllClassesWithStudents(),
          studentService.getAllStudents(),
        ]);
        setClasses(classData);
        setStudents(studentData);
      } catch (error) {
        console.error("Failed to fetch classes or students:", error);
      }
    };

    fetchAll();
  }, []);

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
      alert("Class created with ID: " + result.id);
      setTopic("");
      setSelectedStudents([]);
      setSearchTerm("");
      const updatedClasses = await classService.getAllClassesWithStudents();
      setClasses(updatedClasses);
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await classService.deleteClass(id);
      setClasses(classes.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete class:", err);
    }
  };

  const handleEditClick = (cls) => {
    setEditingClassId(cls.id);
    setEditingTopic(cls.topic);
    setEditingSelectedStudents(cls.students.map((s) => s.id));
    setEditSearchTerm(""); // reset search term
    setActiveTab("enrolled");
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
      const updatedClasses = await classService.getAllClassesWithStudents();
      setClasses(updatedClasses);
      setEditingClassId(null);
      setEditingTopic("");
      setEditingSelectedStudents([]);
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
        <p>Create and manage your classes and student enrollments</p>
      </div>

      <div className="manage-classes-content">
        {/* Create Class Section */}
        <div className="create-class-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
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
                  <p style={{ padding: "0.75rem", textAlign: "center", color: "#757575" }}>
                    No students found
                  </p>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Manage Existing Classes
          </div>

          {classes.length > 0 ? (
            <div className="class-list">
              {classes.map((cls) => (
                <div key={cls.id} className="class-card">
                  {editingClassId === cls.id ? (
                    <div className="edit-class-form">
                      <div className="form-group">
                        <label htmlFor={`edit-topic-${cls.id}`}>Class Topic</label>
                        <input
                          id={`edit-topic-${cls.id}`}
                          type="text"
                          className="form-control"
                          value={editingTopic}
                          onChange={(e) => setEditingTopic(e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <div className="search-input">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                          <input
                            type="text"
                            placeholder="Search by name or email"
                            value={editSearchTerm}
                            onChange={(e) => setEditSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="student-tabs">
                        <div 
                          className={`student-tab ${activeTab === 'enrolled' ? 'active' : ''}`}
                          onClick={() => setActiveTab('enrolled')}
                        >
                          Enrolled Students
                        </div>
                        <div 
                          className={`student-tab ${activeTab === 'available' ? 'active' : ''}`}
                          onClick={() => setActiveTab('available')}
                        >
                          Available Students
                        </div>
                      </div>
                      
                      <div className="student-list">
                        {activeTab === 'enrolled' ? (
                          filteredEditStudents(true).length > 0 ? (
                            filteredEditStudents(true).map((student) => (
                              <div key={student.id} className="student-item">
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={true}
                                    onChange={() => toggleEditingStudentSelection(student.id)}
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
                            <p style={{ padding: "0.75rem", textAlign: "center", color: "#757575" }}>
                              No enrolled students
                            </p>
                          )
                        ) : (
                          filteredEditStudents(false).length > 0 ? (
                            filteredEditStudents(false).map((student) => (
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
                            ))
                          ) : (
                            <p style={{ padding: "0.75rem", textAlign: "center", color: "#757575" }}>
                              No available students
                            </p>
                          )
                        )}
                      </div>
                      
                      <div className="btn-group" style={{ marginTop: "1rem" }}>
                        <button className="btn btn-primary" onClick={handleUpdate}>
                          Save Changes
                        </button>
                        <button className="btn btn-secondary" onClick={() => setEditingClassId(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="class-card-header">
                        <h3>{cls.topic}</h3>
                      </div>
                      <div className="class-card-body">
                        <p>Teacher ID: {cls.teacherId}</p>
                        <h4>Enrolled Students ({cls.students.length})</h4>
                        <div>
                          {cls.students.map((s) => (
                            <span key={s.id} className="student-badge">
                              {s.name} (Grade {s.grade})
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="class-card-footer">
                        <button className="btn btn-primary" onClick={() => handleEditClick(cls)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(cls.id)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="M18.4 7.8c.2 .1 .4 .1 .6 .1 0-2.2-1.8-4-4-4-1 0-1.9 .4-2.7 1"></path>
                <path d="M7 17l4-3 4 2.5 2-1.5"></path>
                <path d="M3 13h5l4-3 6 3.5"></path>
              </svg>
              <h3>No Classes Yet</h3>
              <p>Create your first class to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageClasses;