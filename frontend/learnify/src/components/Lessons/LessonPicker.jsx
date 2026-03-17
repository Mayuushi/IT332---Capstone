import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Brain, Network, Clock, Gamepad2, Lock, CheckCircle } from 'lucide-react';
import './VisualNovelChapter1'
import './VisualNovelChapter2'
import './VisualNovelChapter3'

// ─── Sequence definition ──────────────────────────────────────────────────────
const SEQUENCE = [
  {
    type: 'chapter',
    id: 'chapter1',
    title: 'Chapter 1: The Beginning',
    description: 'Introduction to the nervous system — structure, neurons, and how signals travel.',
    icon: 'brain',
    route: '/lessons/nervous-system/play/chapter1',
    lockedBy: null,
    completedKey: 'vn_chapter1_completed',
    duration: '10 min',
  },
  {
    type: 'minigame',
    id: 'minigame1',
    title: 'Minigame 1: Neuron Dash',
    description: 'Put your neuron knowledge to the test — coming soon!',
    icon: 'game',
    route: null,
    lockedBy: 'vn_chapter1_completed',
    completedKey: 'vn_minigame1_completed',
    duration: '5 min',
  },
  {
    type: 'chapter',
    id: 'chapter2',
    title: 'Chapter 2: The Journey',
    description: 'Dive into the central nervous system — the brain, its lobes, and the cerebrum.',
    icon: 'brain',
    route: '/lessons/nervous-system/play/chapter2',
    lockedBy: 'vn_minigame1_completed',
    completedKey: 'vn_chapter2_completed',
    duration: '10 min',
  },
  {
    type: 'minigame',
    id: 'minigame2',
    title: 'Minigame 2: Trace the Line',
    description: 'Trace the nerve pathways of the spinal cord, brainstem, and peripheral nerves — test your precision and speed!',
    icon: 'game',
    route: '/lessons/nervous-system/play/tracetheline',
    lockedBy: 'vn_chapter2_completed',
    completedKey: 'vn_minigame2_completed',
    duration: '5 min',
  },
  {
    type: 'chapter',
    id: 'chapter3',
    title: 'Chapter 3: The Conclusion',
    description: 'Explore the peripheral nervous system — autonomic, fight-or-flight, and rest & digest.',
    icon: 'network',
    route: '/lessons/nervous-system/play/chapter3',
    lockedBy: 'vn_minigame2_completed',
    completedKey: 'vn_chapter3_completed',
    duration: '10 min',
  },
  {
    type: 'minigame',
    id: 'minigame3',
    title: 'Minigame 3: Reflex Rally',
    description: 'Test your mastery of the full nervous system — coming soon!',
    icon: 'game',
    route: '/platformer',
    lockedBy: 'vn_chapter3_completed',
    completedKey: 'vn_minigame3_completed',
    duration: '5 min',
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function NervousSystemLessonPicker() {
  const { currentUser } = useAuth();
  const userId          = currentUser?.id ?? null;
  const navigate        = useNavigate();

  const [selectedItem, setSelectedItem]   = useState(null);
  const [completionMap, setCompletionMap] = useState({});

  useEffect(() => {
    if (!userId) return;
    const map = {};
    SEQUENCE.forEach(item => {
      if (item.lockedBy)     map[item.lockedBy]     = localStorage.getItem(`${item.lockedBy}_${userId}`) === 'true';
      if (item.completedKey) map[item.completedKey] = localStorage.getItem(`${item.completedKey}_${userId}`) === 'true';
    });
    setCompletionMap(map);
  }, [userId]);

  const isUnlocked  = (item) => !item.lockedBy || completionMap[item.lockedBy] === true;
  const isCompleted = (item) => completionMap[item.completedKey] === true;

  const handleSelect = (item) => {
    if (!isUnlocked(item)) return;
    setSelectedItem(item);
  };

  const handleStart = () => {
    if (!selectedItem?.route) return;
    navigate(selectedItem.route);
  };

  const renderIcon = (item, size = 24) => {
    const color = !isUnlocked(item)
      ? '#9ca3af'
      : item.type === 'minigame' ? '#db2777' : '#1d4ed8';

    if (!isUnlocked(item)) return <Lock size={size} color="#9ca3af" />;
    if (item.icon === 'game')    return <Gamepad2 size={size} color={color} />;
    if (item.icon === 'network') return <Network  size={size} color={color} />;
    return <Brain size={size} color={color} />;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Nervous System</h1>
        <p style={styles.subtitle}>
          Explore the complex network that coordinates your body's actions and sensory information.
          Complete each stage in order to unlock the next.
        </p>
      </div>

      <div style={styles.lessonGrid}>
        {SEQUENCE.map((item) => {
          const unlocked      = isUnlocked(item);
          const completed     = isCompleted(item);
          const isGame        = item.type === 'minigame';
          const isSelected    = selectedItem?.id === item.id;
          const isPlaceholder = isGame && !item.route;

          // Build card style by composing base + variant + state
          let cardStyle = { ...styles.lessonCard };
          if (isGame)     cardStyle = { ...cardStyle, ...styles.minigameCard };
          if (!unlocked)  cardStyle = { ...cardStyle, ...styles.lockedCard };
          if (isSelected) cardStyle = {
            ...cardStyle,
            ...(isGame ? styles.minigameCardSelected : styles.lessonCardSelected),
          };

          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              style={cardStyle}
            >
              {/* Status badge (top-right) */}
              {!unlocked && (
                <div style={styles.lockBadge}>
                  <Lock size={12} style={{ marginRight: 3 }} /> Locked
                </div>
              )}
              {completed && unlocked && (
                <div style={styles.completedBadge}>
                  <CheckCircle size={12} style={{ marginRight: 3 }} /> Done
                </div>
              )}

              {/* Icon */}
              <div style={{
                ...styles.iconContainer,
                backgroundColor: isGame
                  ? (unlocked ? '#fff0f8' : '#f3f4f6')
                  : (unlocked ? '#eff6ff' : '#f3f4f6'),
              }}>
                {renderIcon(item)}
              </div>

              {/* Title */}
              <h3 style={{ ...styles.lessonTitle, color: unlocked ? '#333' : '#aaa' }}>
                {item.title}
              </h3>

              {/* Description */}
              <p style={{ ...styles.lessonDescription, color: unlocked ? '#666' : '#bbb' }}>
                {item.description}
                {isPlaceholder && (
                  <span style={styles.soonBadge}> Coming Soon</span>
                )}
              </p>

              {/* Footer */}
              <div style={{ ...styles.durationContainer, color: unlocked ? '#777' : '#bbb' }}>
                <Clock size={14} style={{ marginRight: 5 }} />
                <span>{item.duration}</span>
                {isGame && unlocked && (
                  <span style={styles.gameTag}>Minigame</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail / CTA panel */}
      {selectedItem && (
        <div style={{
          ...styles.detailsCard,
          borderLeftColor: selectedItem.type === 'minigame' ? '#db2777' : '#3b82f6',
        }}>
          <h2 style={styles.detailsTitle}>{selectedItem.title}</h2>
          <p style={styles.detailsDescription}>{selectedItem.description}</p>
          {selectedItem.route ? (
            <button
              onClick={handleStart}
              style={{
                ...styles.button,
                backgroundColor: selectedItem.type === 'minigame' ? '#db2777' : '#3b82f6',
              }}
            >
              {selectedItem.type === 'minigame' ? 'Play Minigame' : 'Start Lesson'}
            </button>
          ) : (
            <button disabled style={styles.buttonDisabled}>
              Coming Soon
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Styles (matching original) ───────────────────────────────────────────────
const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#666',
    fontSize: '16px',
    marginTop: '0',
  },
  lessonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },

  // Base chapter card — identical to original
  lessonCard: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  lessonCardSelected: {
    borderColor: '#3b82f6',
    borderWidth: '2px',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
    backgroundColor: '#f0f7ff',
  },

  // Minigame card — pink/dashed variant
  minigameCard: {
    backgroundColor: '#fff5fb',
    border: '1px dashed #f9a8d4',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(219,39,119,0.07)',
    position: 'relative',
  },
  minigameCardSelected: {
    borderColor: '#db2777',
    borderWidth: '2px',
    borderStyle: 'solid',
    boxShadow: '0 2px 8px rgba(219, 39, 119, 0.25)',
    backgroundColor: '#fdf2f8',
  },

  // Locked state
  lockedCard: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e8e8e8',
    cursor: 'default',
    opacity: 0.65,
  },

  // Badges
  lockBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '11px',
    color: '#9ca3af',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    padding: '2px 8px',
    fontWeight: '600',
  },
  completedBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '11px',
    color: '#15803d',
    backgroundColor: '#f0fdf4',
    border: '1px solid #86efac',
    borderRadius: '20px',
    padding: '2px 8px',
    fontWeight: '600',
  },
  soonBadge: {
    display: 'inline-block',
    fontSize: '11px',
    color: '#db2777',
    backgroundColor: '#fdf2f8',
    border: '1px solid #f9a8d4',
    borderRadius: '4px',
    padding: '0 5px',
    marginLeft: '4px',
    fontWeight: '600',
    verticalAlign: 'middle',
  },
  gameTag: {
    marginLeft: 'auto',
    fontSize: '10px',
    fontWeight: '700',
    color: '#db2777',
    backgroundColor: '#fdf2f8',
    border: '1px solid #f9a8d4',
    borderRadius: '4px',
    padding: '1px 6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  // Card internals — same as original
  iconContainer: {
    display: 'inline-flex',
    padding: '10px',
    borderRadius: '50%',
    marginBottom: '12px',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'fit-content',
  },
  lessonTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '8px',
  },
  lessonDescription: {
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '12px',
  },
  durationContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    marginTop: 'auto',
  },

  // Detail panel — same as original
  detailsCard: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #3b82f6',
  },
  detailsTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    marginTop: '0',
    marginBottom: '10px',
  },
  detailsDescription: {
    color: '#555',
    marginBottom: '16px',
  },
  button: {
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    outline: 'none',
  },
  buttonDisabled: {
    backgroundColor: '#e5e7eb',
    color: '#9ca3af',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'not-allowed',
    outline: 'none',
  },
};