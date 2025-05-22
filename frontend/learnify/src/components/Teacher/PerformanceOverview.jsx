import React, { useEffect, useState } from 'react';
import classService from '../../services/classService';
import { fetchStudentProfile, addStudentNote } from '../../services/studentProfileService';
import { useAuth } from '../../context/AuthContext';
import '../CSS/PerformanceOverview.css';

const PerformanceOverview = () => {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [loadingNote, setLoadingNote] = useState(false);
  const [noteError, setNoteError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const classData = await classService.getClassesByTeacherIdWithStudents(currentUser.id);
        const allStudents = classData.flatMap(cls => cls.students);

        const seen = new Set();
        const uniqueStudents = allStudents.filter(student => {
          if (seen.has(student.id)) return false;
          seen.add(student.id);
          return true;
        });

        setStudents(uniqueStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, [currentUser.id]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!selectedStudentId) return;
      try {
        const data = await fetchStudentProfile(selectedStudentId);
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    fetchProfile();
  }, [selectedStudentId]);

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      setNoteError('Note cannot be empty');
      return;
    }
    setNoteError('');
    setLoadingNote(true);
    try {
      await addStudentNote(selectedStudentId, newNote, currentUser.id);
      setNewNote('');
      // Refresh profile to get updated notes
      const updatedProfile = await fetchStudentProfile(selectedStudentId);
      setProfile(updatedProfile);
    } catch (err) {
      setNoteError('Failed to add note');
    }
    setLoadingNote(false);
  };

  return (
    <div className="performance-overview-container">
      {/* Left Panel: Student List */}
      <div className="student-list-panel">
        <div className="student-list-header">
          <h3>Students</h3>
        </div>
        <div className="student-list-content">
          {students.map(student => (
            <div
              key={student.id}
              className={`student-item ${selectedStudentId === student.id ? 'selected' : ''}`}
              onClick={() => setSelectedStudentId(student.id)}
            >
              <span className="student-name">{student.name}</span>
              <span className="student-email">{student.email}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Student Profile */}
      <div className="student-profile-panel">
        {profile ? (
          <>
            <div className="profile-header">
              <h2 className="profile-title">{profile.student.name}'s Profile</h2>
              <div className="profile-basic-info">
                <div className="info-item">
                  <div className="info-label">Email</div>
                  <div className="info-value">{profile.student.email}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Grade</div>
                  <div className="info-value">{profile.student.grade}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Level</div>
                  <div className="info-value">{profile.student.level}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Total Points</div>
                  <div className="info-value">{profile.student.totalPoints}</div>
                </div>
              </div>
            </div>

            <div className="profile-content">
              <div className="profile-section">
                <h3 className="section-title badges">Badges</h3>
                {profile.badges.length === 0 ? (
                  <div className="empty-state section-empty">No badges earned</div>
                ) : (
                  <div className="badges-grid">
                    {profile.badges.map(badge => (
                      <div key={`${badge.id}-${new Date(badge.earnedAt).getTime()}`} className="badge-item">
                        <div className="badge-icon">🏆</div>
                        <div className="badge-info">
                          <div className="badge-name">{badge.name}</div>
                          <div className="badge-date">{new Date(badge.earnedAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="profile-section">
                <h3 className="section-title quizzes">Quiz Performances</h3>
                {profile.quizPerformances.length === 0 ? (
                  <div className="empty-state section-empty">No quiz data</div>
                ) : (
                  <div className="quiz-list">
                    {profile.quizPerformances.map((quiz, index) => (
                      <div key={index} className="quiz-item">
                        <div className="quiz-header">
                          <div className="quiz-title">{quiz.quizTitle}</div>
                          <div className="quiz-score">{quiz.score}/{quiz.totalPossible}</div>
                        </div>
                        <div className="quiz-date">{new Date(quiz.submittedAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="profile-section">
                <h3 className="section-title notes">Notes</h3>
                {profile.notes.length === 0 ? (
                  <div className="empty-state section-empty">No notes</div>
                ) : (
                  <div className="notes-list">
                    {profile.notes.map((note, i) => (
                      <div key={note.id ? note.id : `note-${i}`} className="note-item">
                        <div className="note-header">
                          <div className="note-teacher">{note.teacherName}</div>
                          <div className="note-date">{new Date(note.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="note-content">{note.note}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new note */}
                <div className="add-note-section">
                  <div className="add-note-title">Add New Note</div>
                  <textarea
                    rows="3"
                    placeholder="Add a new note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="note-textarea"
                  />
                  {noteError && <div className="note-error">{noteError}</div>}
                  <button 
                    onClick={handleAddNote} 
                    disabled={loadingNote}
                    className="add-note-button"
                  >
                    {loadingNote ? 'Adding...' : 'Add Note'}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state profile-empty">
            <p>Select a student to view their profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceOverview;