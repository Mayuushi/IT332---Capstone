import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import DialogBox from './DialogBox';
import CharacterDisplay from './CharacterDisplay';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ─── Chapter Configuration ────────────────────────────────────────────────────
const CHAPTER = 3;
const CHAPTER_START_NODE = 'pns';
const CHAPTER_NODE_IDS   = new Set([
  'pns', 'ans', 'fight_flight', 'rest_digest'
]);
const CHAPTER_TITLE = 'Chapter 3: The Conclusion';

const API_BASE_URL   = 'http://localhost:8080/api/vn';
const API_POINTS_URL = 'http://localhost:8080/api/points/award';
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

const LockedOverlay = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 30;

  h2 { color: #ff6b6b; font-size: 1.8rem; margin-bottom: 1rem; }
  p  { color: rgba(255,255,255,0.6); margin-bottom: 2rem; }
`;

const NavButton = styled.button`
  padding: 12px 36px;
  background: transparent;
  border: 2px solid #66c2ff;
  color: #66c2ff;
  font-size: 1rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #66c2ff;
    color: #000;
  }
`;

// Finale credits overlay shown after the last chapter ends
const CreditsOverlay = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 30;
  animation: ${fadeIn} 1s ease-in-out;

  h1 {
    color: #ffd700;
    font-size: 2.8rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  p {
    color: rgba(255,255,255,0.75);
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
    text-align: center;
    max-width: 420px;
    line-height: 1.7;
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getBackgroundPath = (background) => {
  if (!background) return 'default.jpg';
  if (background.includes('.')) return background;
  return `${background}.jpg`;
};

const isNodeInChapter = (nodeId) => CHAPTER_NODE_IDS.has(nodeId); 

// ─────────────────────────────────────────────────────────────────────────────

const VisualNovelChapter3 = () => {
  const { currentUser } = useAuth();
  const userId   = currentUser?.id ?? null;
  const navigate = useNavigate();

  const [currentNode, setCurrentNode]                       = useState(null);
  const [loading, setLoading]                               = useState(true);
  const [error, setError]                                   = useState(null);
  const [showChapterBanner, setShowChapterBanner]           = useState(true);
  const [showPointsNotification, setShowPointsNotification] = useState(false);
  const [pointsAwarded, setPointsAwarded]                   = useState(0);
  const [isEnding, setIsEnding]                             = useState(false);
  const [showCredits, setShowCredits]                       = useState(false);
  const [prerequisiteLocked, setPrerequisiteLocked]         = useState(false);
  const [isMuted, setIsMuted]                               = useState(false);
  const currentAudioRef = useRef(null);

  // ── Load mute preference ────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:8080/api/students/${userId}/vn-muted`)
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

  // ── Check prerequisites & load progress ─────────────────────────────────────
  useEffect(() => {
    if (!userId) return;

    const ch1Done = localStorage.getItem(`vn_chapter1_completed_${userId}`);
    const ch2Done = localStorage.getItem(`vn_chapter2_completed_${userId}`);
    if (ch1Done !== 'true' || ch2Done !== 'true') {
      setPrerequisiteLocked(true);
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const progressRes = await axios.get(`${API_BASE_URL}/progress?userId=${userId}`);

        if (progressRes.data) {
          const savedNodeId = progressRes.data.currentNodeId;
          if (isNodeInChapter(savedNodeId)) {
            const nodeRes = await axios.get(`${API_BASE_URL}/node/${savedNodeId}`);
            const node    = nodeRes.data;
            if (!node.choices || node.choices.length === 0) setIsEnding(true);
            setCurrentNode(node);
            setLoading(false);
            return;
          }
        }

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

      const isEndingNode      = !nextNode.choices || nextNode.choices.length === 0;
      const isChapterBoundary = !isNodeInChapter(nextNodeId);

      if (isChapterBoundary || isEndingNode) {
        setIsEnding(true);
        await awardPoints(100, 'story_completion'); // Bonus for completing the full VN
        handleStoryComplete();
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

  // ── Story fully complete (end of Chapter 3) ─────────────────────────────────
  const handleStoryComplete = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    // Mark all chapters and the full VN as completed
    localStorage.setItem(`vn_chapter${CHAPTER}_completed_${userId}`, 'true');
    localStorage.setItem(`vn_chapter${CHAPTER}_completed_at_${userId}`, Date.now().toString());
    localStorage.setItem(`vn_completed_${userId}`, 'true');
    localStorage.setItem(`vn_last_completed_${userId}`, Date.now().toString());

    // Show credits before redirecting
    setShowCredits(true);
  };

  const handleCreditsFinish = () => {
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
  if (loading && !currentNode && !prerequisiteLocked) return <div>Loading…</div>;
  if (!userId)   return <div>Please log in to play the visual novel.</div>;
  if (error)     return <div>{error}</div>;

  const backgroundPath = getBackgroundPath(currentNode?.background);

  return (
    <GameContainer backgroundPath={backgroundPath}>
      {/* Prerequisite lock */}
      {prerequisiteLocked && (
        <LockedOverlay>
          <h2>Chapter Locked</h2>
          <p>Complete Chapters 1 and 2 before playing Chapter 3.</p>
          <NavButton onClick={() => navigate('/lessons')}>Return to Lessons</NavButton>
        </LockedOverlay>
      )}

      {/* Finale credits */}
      {showCredits && (
        <CreditsOverlay>
          <h1>Story Complete!</h1>
          <p>
            You've reached the end of the visual novel.<br />
            Thank you for playing through all three chapters!
          </p>
          <NavButton onClick={handleCreditsFinish}>Return to Lessons</NavButton>
        </CreditsOverlay>
      )}

      {/* Chapter intro banner */}
      {!prerequisiteLocked && !showCredits && showChapterBanner && (
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

      {!prerequisiteLocked && !showCredits && currentNode && (
        <>
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
                  `http://localhost:8080/api/students/${userId}/vn-muted`,
                  newMuted,
                  { headers: { 'Content-Type': 'application/json' } }
                );
              } catch {
                localStorage.setItem(`vn_muted_${userId}`, String(newMuted));
              }
            }}
          />
        </>
      )}
    </GameContainer>
  );
};

export default VisualNovelChapter3;
