import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';
import LoadingSpinner from '../UI/LoadingSpinner';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    // Teachers don't have a student profile — skip the fetch.
    if (!currentUser?.id || currentUser?.isTeacher) {
      setLoading(false);
      return;
    }
    profileService
      .getMyProfile(currentUser.id)
      .then(setProfile)
      .catch((err) => {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;

  // Teacher fallback — show basic info without student-specific data
  if (currentUser?.isTeacher) {
    return (
      <div className="pp-page">
        <div className="pp-hero-card">
          <div className="pp-avatar">{(currentUser.name || 'T').charAt(0).toUpperCase()}</div>
          <div className="pp-hero-info">
            <h1 className="pp-name">{currentUser.name}</h1>
            <p className="pp-email">{currentUser.email}</p>
            <div className="pp-tags">
              <span className="pp-tag pp-tag-level">Teacher</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error)    return <div className="pp-error">{error}</div>;
  if (!profile) return null;

  const { student, badges = [], quizPerformances = [] } = profile;
  const earnedBadges  = badges.filter((b) => b.earnedAt !== null);
  const totalQuizzes  = quizPerformances.length;
  const avgScore      = totalQuizzes
    ? Math.round(
        quizPerformances.reduce(
          (sum, q) => sum + (q.totalPossible > 0 ? (q.score / q.totalPossible) * 100 : 0),
          0,
        ) / totalQuizzes,
      )
    : 0;

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div className="pp-page">
      {/* ── Hero card ──────────────────────────────────────────────────────── */}
      <div className="pp-hero-card">
        <div className="pp-avatar">{(student.name || 'U').charAt(0).toUpperCase()}</div>
        <div className="pp-hero-info">
          <h1 className="pp-name">{student.name}</h1>
          <p className="pp-email">{student.email}</p>
          <div className="pp-tags">
            <span className="pp-tag pp-tag-grade">Grade {student.grade}</span>
            <span className="pp-tag pp-tag-level">Level {student.level}</span>
          </div>
        </div>
        <div className="pp-hero-stats">
          <div className="pp-stat">
            <span className="pp-stat-val">{student.totalPoints ?? 0}</span>
            <span className="pp-stat-lbl">Total Points</span>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-val">{earnedBadges.length}</span>
            <span className="pp-stat-lbl">Badges Earned</span>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-val">{totalQuizzes}</span>
            <span className="pp-stat-lbl">Quizzes Taken</span>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-val">{avgScore}%</span>
            <span className="pp-stat-lbl">Avg. Score</span>
          </div>
        </div>
      </div>

      <div className="pp-body">
        {/* ── Badges ───────────────────────────────────────────────────────── */}
        <section className="pp-section">
          <h2 className="pp-section-title">Badges Earned</h2>
          {earnedBadges.length === 0 ? (
            <p className="pp-empty">No badges earned yet. Keep learning!</p>
          ) : (
            <div className="pp-badge-grid">
              {earnedBadges.map((b) => (
                <div key={b.id} className="pp-badge-card">
                  {b.imageUrl ? (
                    <img src={b.imageUrl} alt={b.name} className="pp-badge-img" />
                  ) : (
                    <div className="pp-badge-placeholder">🏅</div>
                  )}
                  <div className="pp-badge-info">
                    <span className="pp-badge-name">{b.name}</span>
                    <span className="pp-badge-date">Earned {formatDate(b.earnedAt)}</span>
                    {b.description && (
                      <span className="pp-badge-desc">{b.description}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Quiz performance ─────────────────────────────────────────────── */}
        <section className="pp-section">
          <h2 className="pp-section-title">Quiz Performance</h2>
          {quizPerformances.length === 0 ? (
            <p className="pp-empty">No quiz submissions yet.</p>
          ) : (
            <div className="pp-quiz-table-wrap">
              <table className="pp-quiz-table">
                <thead>
                  <tr>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {quizPerformances.map((q, idx) => {
                    const pct = q.totalPossible > 0
                      ? Math.round((q.score / q.totalPossible) * 100)
                      : 0;
                    return (
                      <tr key={idx}>
                        <td>{q.quizTitle}</td>
                        <td>{q.score} / {q.totalPossible}</td>
                        <td>
                          <div className="pp-score-bar-wrap">
                            <div
                              className="pp-score-bar"
                              style={{ width: `${pct}%` }}
                            />
                            <span className="pp-score-pct">{pct}%</span>
                          </div>
                        </td>
                        <td>{formatDate(q.submittedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
