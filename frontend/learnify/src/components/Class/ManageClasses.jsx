import React, { useEffect, useState, useCallback } from "react";
import classService from "../../services/classService";
import studentService from "../../services/studentService";
import { useAuth } from "../../context/AuthContext";
import '../../components/CSS/ManageClasses.css';
// Import Lucide React icons
import { Plus, Users, Search, CheckCircle, AlertCircle, Edit, Trash2, ChevronRight } from 'lucide-react';

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
  // New state for animations and UI enhancements
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [animateItems, setAnimateItems] = useState(false);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
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
      
      // Trigger animations after data is loaded
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setAnimateItems(true), 300);
      }, 500);
    } catch (error) {
      console.error("Failed to fetch classes or students:", error);
      setIsLoading(false);
      setShowError(true);
      setErrorMessage("Failed to load data. Please try again.");
      setTimeout(() => setShowError(false), 5000);
    }
  }, [currentUser.id, isTeacher]);

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
      setShowError(true);
      setErrorMessage("Please enter a topic and select at least one student.");
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    const classData = {
      topic,
      teacherId: currentUser.id,
      studentIds: selectedStudents,
    };

    setIsLoading(true);
    try {
      const result = await classService.createClass(classData);
      if (result && result.id) {
        setIsLoading(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        setTopic("");
        setSelectedStudents([]);
        setSearchTerm("");
        await fetchAll(); // Refresh data
      } else {
        throw new Error("Class creation failed due to unexpected response.");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      setIsLoading(false);
      setShowError(true);
      setErrorMessage("Failed to create class.");
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      setIsLoading(true);
      try {
        await classService.deleteClass(id);
        setIsLoading(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        await fetchAll(); // Refresh after delete
      } catch (err) {
        console.error("Failed to delete class:", err);
        setIsLoading(false);
        setShowError(true);
        setErrorMessage("Failed to delete class.");
        setTimeout(() => setShowError(false), 5000);
      }
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
      setShowError(true);
      setErrorMessage("Topic and students are required.");
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    const updatedClass = {
      id: editingClassId,
      topic: editingTopic,
      teacherId: currentUser.id,
      studentIds: editingSelectedStudents,
    };

    setIsLoading(true);
    try {
      await classService.updateClass(editingClassId, updatedClass);
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      await fetchAll(); // Refresh after update
      setEditingClassId(null);
      setEditingTopic("");
      setEditingSelectedStudents([]);
      setActiveTab("enrolled");
    } catch (error) {
      console.error("Failed to update class:", error);
      setIsLoading(false);
      setShowError(true);
      setErrorMessage("Failed to update class.");
      setTimeout(() => setShowError(false), 5000);
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

  // Function to generate random gradient colors for class items
  const getRandomGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #6366F1, #8B5CF6)',
      
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="manage-classes-container">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="notification success">
          <CheckCircle size={20} />
          <span>Operation completed successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="notification error">
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="manage-classes-header">
        <h1>Class Management</h1>
        <p>Create and manage your classes and student enrollments</p>
      </div>

      <div className="manage-classes-content">
        {/* Create Class Section */}
        <div className={`create-class-section ${animateItems ? 'animate-in' : ''}`}>
          <div className="section-header">
            <Plus size={24} />
            <span>Create New Class</span>
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
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="student-list">
                {filteredCreateStudents.length > 0 ? (
                  filteredCreateStudents.map((student, index) => (
                    <div 
                      key={student.id} 
                      className={`student-item ${selectedStudents.includes(student.id) ? 'selected' : ''}`}
                      style={{animationDelay: `${index * 0.05}s`}}
                    >
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
              <Plus size={18} />
              Create Class
            </button>
          </form>
        </div>

        {/* Existing Classes Section */}
        <div className={`existing-classes-section ${animateItems ? 'animate-in' : ''}`}>
          <div className="section-header">
            <Users size={24} />
            <span>My Classes</span>
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
                  classes.map((cls, index) => (
                    <div 
                      className={`class-item ${animateItems ? 'animate-in' : ''}`} 
                      key={cls.id}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        backgroundImage: getRandomGradient(index)
                      }}
                    >
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
                        <button className="edit-btn" onClick={() => handleEditClick(cls)}>
                          <Edit size={16} />
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(cls.id)}>
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Users size={48} />
                    <p>No classes found</p>
                    <p className="hint">Create your first class to get started</p>
                    <ChevronRight size={24} className="arrow-hint" />
                  </div>
                )}
              </>
            )}

            {activeTab === "edit" && editingClassId && (
              <div className="edit-form">
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
                    <Search size={18} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search by name or email"
                      value={editSearchTerm}
                      onChange={(e) => setEditSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="student-list">
                    {filteredEditStudents(true).map((student, index) => (
                      <div 
                        key={student.id} 
                        className={`student-item selected`}
                        style={{animationDelay: `${index * 0.05}s`}}
                      >
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
                    {filteredEditStudents(false).map((student, index) => (
                      <div 
                        key={student.id} 
                        className="student-item"
                        style={{animationDelay: `${index * 0.05}s`}}
                      >
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
                  <CheckCircle size={18} />
                  Update Class
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageClasses;
