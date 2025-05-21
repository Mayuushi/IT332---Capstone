import React, { useEffect, useState } from 'react';
import classService from '../../services/classService';
import { fetchStudentProfile, addStudentNote } from '../../services/studentProfileService';
import { useAuth } from '../../context/AuthContext';

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
    <div style={{ display: 'flex', height: '80vh' }}>
      {/* Left Panel: Student List */}
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '1rem', overflowY: 'auto' }}>
        <h3>Students</h3>
        {students.map(student => (
          <div
            key={student.id}
            style={{ marginBottom: '0.5rem', cursor: 'pointer' }}
            onClick={() => setSelectedStudentId(student.id)}
          >
            <strong>{student.name}</strong><br />
            <small>{student.email}</small>
          </div>
        ))}
      </div>

      {/* Right Panel: Student Profile */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        {profile ? (
          <>
            <h2>{profile.student.name}'s Profile</h2>
            <p><strong>Email:</strong> {profile.student.email}</p>
            <p><strong>Grade:</strong> {profile.student.grade}</p>
            <p><strong>Level:</strong> {profile.student.level}</p>
            <p><strong>Total Points:</strong> {profile.student.totalPoints}</p>

            <h3>Badges</h3>
            {profile.badges.length === 0 ? (
              <div>No badges earned</div>
            ) : (
              profile.badges.map(badge => (
                <div key={`${badge.id}-${new Date(badge.earnedAt).getTime()}`}>
                  {badge.name} — {new Date(badge.earnedAt).toLocaleString()}
                </div>
              ))
            )}

            <h3>Quiz Performances</h3>
            {profile.quizPerformances.length === 0 ? (
              <div>No quiz data</div>
            ) : (
              profile.quizPerformances.map((quiz, index) => (
                <div key={index}>
                  {quiz.quizTitle} — {quiz.score}/{quiz.totalPossible} — {new Date(quiz.submittedAt).toLocaleString()}
                </div>
              ))
            )}

            <h3>Notes</h3>
            {profile.notes.length === 0 ? (
              <div>No notes</div>
            ) : (
              profile.notes.map((note, i) => (
                <div key={note.id ? note.id : `note-${i}`} style={{ marginBottom: '0.5rem' }}>
                  <strong>{note.teacherName}</strong>: {note.note} <br />
                  <small>{new Date(note.createdAt).toLocaleString()}</small>
                </div>
              ))
            )}

            {/* Add new note */}
            <div style={{ marginTop: '1rem' }}>
              <textarea
                rows="3"
                placeholder="Add a new note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
              {noteError && <div style={{ color: 'red' }}>{noteError}</div>}
              <button onClick={handleAddNote} disabled={loadingNote} style={{ marginTop: '0.5rem' }}>
                {loadingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </>
        ) : (
          <p>Select a student to view their profile.</p>
        )}
      </div>
    </div>
  );
};

export default PerformanceOverview;
