import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import DialogBox from './DialogBox';
import CharacterDisplay from './CharacterDisplay';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ─── Chapter Configuration ────────────────────────────────────────────────────
const CHAPTER = 1;
const CHAPTER_START_NODE = 'intro';
const CHAPTER_NODE_IDS   = new Set([
  'intro', 'overview', 'structure',
  'neuron_communication', 'neuron_parts', 'neuron_function'
]);
const CHAPTER_TITLE = 'Chapter 1: The Beginning';

const API_BASE_URL   = 'https://it332-capstone.onrender.com/api/vn';
const API_POINTS_URL = 'https://it332-capstone.onrender.com/api/points/award';
// ─────────────────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideDown = keyframes`
  0%   { opacity: 0; transform: translateY(-20px); }
  20%  { opacity: 1; transform: translateY(0); }
  80%  { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
`;

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-image: ${props => `url('/images/backgrounds/${props.backgroundPath}')`};
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease-in-out;
  animation: ${fadeIn} 0.8s ease-in-out;
`;

const ChapterBanner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 30;
  animation: ${fadeIn} 0.5s ease-in-out;

  h1 {
    color: #66c2ff;
    font-size: 2.5rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  p {
    color: rgba(255,255,255,0.7);
    font-size: 1rem;
    letter-spacing: 0.1em;
  }
`;

const StartButton = styled.button`
  margin-top: 2rem;
  padding: 12px 36px;
  background: transparent;
  border: 2px solid #66c2ff;
  color: #66c2ff;
  font-size: 1rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #66c2ff;
    color: #000;
  }
`;

const PointsNotification = styled.div`
  position: absolute;
  top: 50px;
  right: 50px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #66c2ff;
  padding: 15px 20px;
  border-radius: 10px;
  font-size: 1.2rem;
  animation: ${slideDown} 3s forwards;
  z-index: 20;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid #66c2ff;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  z-index: 20;

  &:hover {
    background-color: rgba(102, 194, 255, 0.4);
  }
`;

const ChapterBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #66c2ff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  border: 1px solid rgba(102, 194, 255, 0.4);
  z-index: 20;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getBackgroundPath = (background) => {
  if (!background) return 'default.jpg';
  if (background.includes('.')) return background;
  return `${background}.jpg`;
};

const isNodeInChapter = (nodeId) => CHAPTER_NODE_IDS.has(nodeId); 

// ─────────────────────────────────────────────────────────────────────────────

const VisualNovelChapter1 = () => {
  const { currentUser } = useAuth();
  const userId   = currentUser?.id ?? null;
  const navigate = useNavigate();

  const [currentNode, setCurrentNode]                 = useState(null);
  const [loading, setLoading]                         = useState(true);
  const [error, setError]                             = useState(null);
  const [showChapterBanner, setShowChapterBanner]     = useState(true);
  const [showPointsNotification, setShowPointsNotification] = useState(false);
  const [pointsAwarded, setPointsAwarded]             = useState(0);
  const [isEnding, setIsEnding]                       = useState(false);
  const [isMuted, setIsMuted]                         = useState(false);
  const currentAudioRef = useRef(null);

  // ── Load mute preference ────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    axios.get(`https://it332-capstone.onrender.com/api/students/${userId}/vn-muted`)
      .then(res => setIsMuted(res.data === true))
      .catch(() => {
        const saved = localStorage.getItem(`vn_muted_${userId}`);
        if (saved === 'true') setIsMuted(true);
      });
  }, [userId]);

  // ── Sync mute to current audio without restarting it ───────────────────────
  useEffect(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      setError('Please log in to play the visual novel.');
      setLoading(false);
    }
  }, [userId]);

  // ── Load progress / start node ──────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;

    const fetchProgress = async () => {
      try {
        const progressRes = await axios.get(`${API_BASE_URL}/progress?userId=${userId}`);

        if (progressRes.data) {
          const savedNodeId = progressRes.data.currentNodeId;

          // Only resume if the saved node belongs to this chapter
          if (isNodeInChapter(savedNodeId)) {
            const nodeRes = await axios.get(`${API_BASE_URL}/node/${savedNodeId}`);
            const node    = nodeRes.data;
            if (!node.choices || node.choices.length === 0) setIsEnding(true);
            setCurrentNode(node);
            setLoading(false);
            return;
          }
        }

        // Start this chapter from its first node
        const startRes = await axios.get(`${API_BASE_URL}/node/${CHAPTER_START_NODE}`);
        setCurrentNode(startRes.data);
      } catch {
        try {
          const startRes = await axios.get(`${API_BASE_URL}/node/${CHAPTER_START_NODE}`);
          setCurrentNode(startRes.data);
        } catch {
          setError('Failed to load chapter. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  // ── Audio ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const nodeId = currentNode?.id;
    if (!nodeId) return;

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    const audio = new Audio(`/audio/vn/${nodeId}.mp3`);
    currentAudioRef.current = audio;
    audio.muted = isMuted;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [currentNode?.id]);

  // ── Points ──────────────────────────────────────────────────────────────────
  const awardPoints = async (points = 10, reason = 'story_progress') => {
    if (!userId) return;

    setPointsAwarded(points);
    setShowPointsNotification(true);
    setTimeout(() => setShowPointsNotification(false), 3000);

    const payload = {
      studentId:    userId,
      points,
      activityType: 'VISUAL_NOVEL_PROGRESS',
      description:  `Visual novel ch${CHAPTER} ${reason}`,
      timestamp:    new Date().toISOString(),
    };

    try {
      await axios.post(API_POINTS_URL, payload);
    } catch {
      try {
        await axios.post(API_POINTS_URL, { studentId: userId, points, activityType: 'VISUAL_NOVEL_PROGRESS' });
      } catch {
        try {
          await axios.post(`${API_POINTS_URL}?studentId=${userId}&points=${points}&activityType=VISUAL_NOVEL_PROGRESS`);
        } catch { /* silent fallback */ }
      }
    }

    try {
      const prev = parseInt(localStorage.getItem(`vn_points_${userId}`) || '0', 10);
      localStorage.setItem(`vn_points_${userId}`, (prev + points).toString());
    } catch { /* silent */ }
  };

  // ── Choice handler ──────────────────────────────────────────────────────────
  const handleChoiceSelect = async (nextNodeId) => {
    if (!userId) { setError('You need to be logged in to progress.'); return; }

    try {
      setLoading(true);

      const nodeRes  = await axios.get(`${API_BASE_URL}/node/${nextNodeId}`);
      const nextNode = nodeRes.data;

      await axios.post(`${API_BASE_URL}/progress`, null, {
        params: { userId, nodeId: nextNodeId },
      });

      const isEndingNode     = !nextNode.choices || nextNode.choices.length === 0;
      const isChapterBoundary = !isNodeInChapter(nextNodeId);

      if (isChapterBoundary || isEndingNode) {
        // Chapter finished — award completion points then redirect
        setIsEnding(true);
        await awardPoints(50, 'chapter_completion');
        handleChapterComplete();
      } else {
        await awardPoints(10, 'story_progress');
        setCurrentNode(nextNode);
      }
    } catch {
      setError('Failed to progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Chapter complete ────────────────────────────────────────────────────────
  const handleChapterComplete = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    localStorage.setItem(`vn_chapter${CHAPTER}_completed_${userId}`, 'true');
    localStorage.setItem(`vn_chapter${CHAPTER}_completed_at_${userId}`, Date.now().toString());

    navigate('/lessons');
  };

  // ── Return early ────────────────────────────────────────────────────────────
  const handleReturnToLessons = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    if (isEnding) awardPoints(100, 'final_completion');
    navigate('/lessons');
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading && !currentNode) return <div>Loading…</div>;
  if (!userId)                  return <div>Please log in to play the visual novel.</div>;
  if (error)                    return <div>{error}</div>;

  const backgroundPath = getBackgroundPath(currentNode?.background);

  return (
    <GameContainer backgroundPath={backgroundPath}>
      {/* Chapter intro banner */}
      {showChapterBanner && (
        <ChapterBanner>
          <h1>{CHAPTER_TITLE}</h1>
          <p>{[...CHAPTER_NODE_IDS].join(' → ')}</p>
          <StartButton onClick={() => setShowChapterBanner(false)}>Begin</StartButton>
        </ChapterBanner>
      )}

      {showPointsNotification && (
        <PointsNotification>+{pointsAwarded} points earned!</PointsNotification>
      )}

      <BackButton onClick={handleReturnToLessons}>Return to Lessons</BackButton>
      <ChapterBadge>{CHAPTER_TITLE}</ChapterBadge>

      <CharacterDisplay
        character={currentNode?.character}
        image={currentNode?.characterImage}
      />

      <DialogBox
        text={currentNode?.text || ''}
        character={currentNode?.character}
        choices={currentNode?.choices || []}
        onChoiceSelect={handleChoiceSelect}
        isEnding={isEnding}
        onEnding={() => awardPoints(100, 'final_completion')}
        onReturnToLessons={handleReturnToLessons}
        isMuted={isMuted}
        onToggleMute={async () => {
          const newMuted = !isMuted;
          setIsMuted(newMuted);
          try {
            await axios.patch(
              `https://it332-capstone.onrender.com/api/students/${userId}/vn-muted`,
              newMuted,
              { headers: { 'Content-Type': 'application/json' } }
            );
          } catch {
            localStorage.setItem(`vn_muted_${userId}`, String(newMuted));
          }
        }}
      />
    </GameContainer>
  );
};

export default VisualNovelChapter1;
