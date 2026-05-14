import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TraceTheLineService from '../../services/TraceTheLineService';
import '../CSS/TraceTheLineGame.css';

// ── Confetti particle engine ───────────────────────────────────────────────────
const CONFETTI_COLORS = [
  '#facc15', '#06ffa5', '#22d3ee', '#f472b6', '#a78bfa', '#fb923c', '#ffffff',
];
function useConfetti(active) {
  const confettiRef = useRef(null);
  const rafRef      = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn burst of 160 particles from the centre-top of the modal
    particlesRef.current = Array.from({ length: 80 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      return {
        x:    canvas.width  / 2 + (Math.random() - 0.5) * 80,
        y:    canvas.height / 3,
        vx:   Math.cos(angle) * speed,
        vy:   Math.sin(angle) * speed - 6,
        size: 5 + Math.random() * 7,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rot:  Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.3,
        life: 1,
        decay: 0.008 + Math.random() * 0.006,
        shape: Math.random() < 0.5 ? 'rect' : 'circle',
      };
    });

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      for (const p of particlesRef.current) {
        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += 0.25;       // gravity
        p.vx  *= 0.99;       // air resistance
        p.rot += p.rotV;
        p.life -= p.decay;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (particlesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return confettiRef;
}

const STAGES = [
  {
    stage: 1,
    topicId: 'spinal-cord',
    topicName: 'Spinal Cord',
    difficulty: 'easy',
    description: 'A gentle, flowing path representing the central cord — smooth curves, steady hand.',
  },
  {
    stage: 2,
    topicId: 'brain',
    topicName: 'Brainstem',
    difficulty: 'medium',
    description: 'Trace the folded cortical surface of the brain — follow every gyrus and sulcus.',
  },
  {
    stage: 3,
    topicId: 'peripheral-nerves',
    topicName: 'Peripheral Nerves',
    difficulty: 'hard',
    description: 'Follow the intricate web of peripheral nerve paths — precision is everything.',
  },
];

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 480;

// Minimum accuracy (%) required to pass — 75% for every stage
const PASS_THRESHOLD = 75;

// ── Brain: smooth mathematical cortex trace ─────────────────────────────────
// Multi-frequency sine generates broad, rounded gyral humps that alternate
// left / right — the rendered curve looks like brain folds, not zigzag.
// Two full primary cycles → 4 visible rounded lobes; secondary terms add sulci.
const buildBrainPath = (n) =>
  Array.from({ length: n }, (_, i) => {
    const t     = i / (n - 1);
    const yNorm = 0.04 + 0.92 * t;
    const env   = 1 - 0.18 * t;                            // tapers toward brainstem
    const xNorm = 0.50
      + env * 0.22 * Math.sin(t * 4 * Math.PI + 0.6)       // 2 full cycles → 4 big smooth lobes
      + env * 0.07 * Math.sin(t * 9 * Math.PI + 1.3)       // secondary sulci
      + env * 0.02 * Math.cos(t * 17 * Math.PI + 0.7);     // fine-texture folds
    return [Math.max(0.05, Math.min(0.95, xNorm)), yNorm];
  });

// Pre-compute once at load time — used for accuracy hit-testing
const BRAIN_PATH_DENSE = buildBrainPath(360).map(
  ([x, y]) => ({ x: x * CANVAS_WIDTH, y: y * CANVAS_HEIGHT }),
);

// ── Peripheral nerves: full body nerve tree — brain → arms → thorax → legs ──
// Wide coverage (x: 0.05–0.95), complex branching pattern.
const NERVE_WAYPOINTS = [
  [0.50, 0.03],  // START — cervicospinal junction
  [0.50, 0.07],  // upper cervical

  // ─ RIGHT BRACHIAL PLEXUS (C5-T1) — far-right fan then return ─
  [0.58, 0.09], [0.67, 0.10], [0.77, 0.10],
  [0.86, 0.11], [0.94, 0.14],             // radial nerve tip (far right)
  [0.90, 0.18], [0.95, 0.22],             // ulnar nerve fingertip loop
  [0.87, 0.25], [0.78, 0.26],             // median nerve returning
  [0.68, 0.26], [0.58, 0.25],             // closing brachial right
  [0.51, 0.26],  // mid-cervicothoracic

  // ─ LEFT BRACHIAL PLEXUS — far-left fan then return ─
  [0.43, 0.27], [0.34, 0.27], [0.24, 0.26],
  [0.15, 0.24], [0.06, 0.27],             // radial nerve tip (far left)
  [0.05, 0.31], [0.07, 0.35],             // ulnar nerve loop left
  [0.11, 0.38], [0.20, 0.40],             // median nerve return left
  [0.31, 0.39], [0.41, 0.38],             // closing brachial left
  [0.50, 0.39],  // thoracic spine (T4)

  // ─ RIGHT INTERCOSTAL NERVES (T5-T9) ─
  [0.59, 0.41], [0.69, 0.43], [0.79, 0.44],
  [0.83, 0.47], [0.77, 0.50], [0.67, 0.50],
  [0.52, 0.51],  // thoracolumbar junction

  // ─ LEFT INTERCOSTAL NERVES (T6-T10) ─
  [0.42, 0.52], [0.32, 0.54], [0.22, 0.55],
  [0.17, 0.59], [0.25, 0.61], [0.36, 0.61],
  [0.49, 0.62],  // lumbar spine (L1)

  // ─ RIGHT FEMORAL NERVE (L2-L4) — lateral thigh ─
  [0.56, 0.64], [0.64, 0.66], [0.71, 0.68],

  // ─ RIGHT SCIATIC NERVE — posterior thigh S-curve → popliteal ─
  [0.76, 0.71], [0.81, 0.75],
  [0.83, 0.79], [0.80, 0.83],             // sciatic S-bend
  [0.76, 0.86], [0.72, 0.89],             // popliteal bifurcation

  // ─ COMMON PERONEAL + TIBIAL branches → foot ─
  [0.68, 0.92], [0.65, 0.95],
  [0.63, 0.97],  // END — right plantar nerve / foot
];

// ── Arc-length parameterised path sampler ────────────────────────────────────
const samplePath = (waypoints, totalSamples) => {
  const cumLen = [0];
  for (let i = 1; i < waypoints.length; i++) {
    const dx = waypoints[i][0] - waypoints[i - 1][0];
    const dy = waypoints[i][1] - waypoints[i - 1][1];
    cumLen.push(cumLen[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  const total = cumLen[cumLen.length - 1];
  return Array.from({ length: totalSamples }, (_, s) => {
    const target = (s / (totalSamples - 1)) * total;
    let seg = 0;
    while (seg < cumLen.length - 2 && cumLen[seg + 1] < target) seg++;
    const segLen = cumLen[seg + 1] - cumLen[seg];
    const t      = segLen === 0 ? 0 : (target - cumLen[seg]) / segLen;
    return {
      x: (waypoints[seg][0] + t * (waypoints[seg + 1][0] - waypoints[seg][0])) * CANVAS_WIDTH,
      y: (waypoints[seg][1] + t * (waypoints[seg + 1][1] - waypoints[seg][1])) * CANVAS_HEIGHT,
    };
  });
};

const TraceTheLineGame = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const canvasRef        = useRef(null);
  const isDrawingRef     = useRef(false);
  const sessionAbortRef  = useRef(false);   // set true on reset so stale API responses are ignored
  const pointsRef        = useRef([]);      // mutable point buffer — avoids re-renders on every mousemove
  const loadingRef       = useRef(false);   // mirrors loading state for use inside drawCanvas (no dep)
  const drawRafRef       = useRef(null);    // handle for the canvas RAF loop
  const bgCanvasRef      = useRef(null);    // pre-rendered reference path (drawn once per stage)
  const strokeCanvasRef  = useRef(null);    // user stroke, drawn incrementally (no full redraws)

  const [session,          setSession]          = useState(null);
  const [seconds,          setSeconds]          = useState(0);
  const [result,           setResult]           = useState(null);
  const [sessionHistory,   setSessionHistory]   = useState([]);
  const [status,           setStatus]           = useState('idle');
  const [selectedStage,    setSelectedStage]    = useState(1);
  const [unlockedStage,    setUnlockedStage]    = useState(1);
  const [loading,          setLoading]          = useState(false);
  const [error,            setError]            = useState('');
  const [stageAccuracies,  setStageAccuracies]  = useState({});   // { 1: 72, 2: 65, 3: 58 }
  const [showFinalScreen,  setShowFinalScreen]  = useState(false);
  const confettiCanvasRef = useConfetti(showFinalScreen);

  const studentId = currentUser?.id || '';

  const activeStageNumber = session?.stageNumber || selectedStage;
  const activeStageMeta   = useMemo(
    () => STAGES.find((item) => item.stage === activeStageNumber) || STAGES[0],
    [activeStageNumber],
  );

  // ── Reference Paths ─────────────────────────────────────────────────────────
  // displayPath: sparse raw waypoints → used for smooth Catmull-Rom rendering
  // expectedPath: dense sampled path  → used for accurate hit-testing
  const displayPath = useMemo(() => {
    if (activeStageMeta.topicId === 'brain')
      return buildBrainPath(90).map(([x, y]) => ({ x: x * CANVAS_WIDTH, y: y * CANVAS_HEIGHT }));
    if (activeStageMeta.topicId === 'peripheral-nerves')
      return NERVE_WAYPOINTS.map(([x, y]) => ({ x: x * CANVAS_WIDTH, y: y * CANVAS_HEIGHT }));
    // Spinal cord: dense enough that lineTo looks smooth, return as-is below
    return null;
  }, [activeStageMeta]);

  const expectedPath = useMemo(() => {
    if (activeStageMeta.topicId === 'brain')             return BRAIN_PATH_DENSE;
    if (activeStageMeta.topicId === 'peripheral-nerves') return samplePath(NERVE_WAYPOINTS, 350);
    // Spinal cord (easy): gentle regular sine wave — 250 dense samples
    return Array.from({ length: 250 }, (_, idx) => {
      const t     = idx / 249;
      const yNorm = 0.05 + 0.90 * t;
      const xNorm = 0.5 + 0.07 * Math.sin(yNorm * Math.PI * 5);
      return {
        x: Math.max(0.04, Math.min(0.96, xNorm)) * CANVAS_WIDTH,
        y: yNorm * CANVAS_HEIGHT,
      };
    });
  }, [activeStageMeta]);

  // ── Accuracy (client-side, hit-tested against dense expectedPath) ───────────
  // Tolerance is tight so only genuinely close traces score high.
  // We also penalise missing coverage: user must have traced near BOTH ends.
  const computeAccuracy = useCallback((userPts, refPath, difficulty) => {
    if (!userPts.length || !refPath.length) return 0;
    // Very tight tolerance — only points genuinely on the reference line count
    const tol = difficulty === 'hard' ? 5 : difficulty === 'medium' ? 6 : 8;

    // Build a fast user-point spatial index: bucket by y-row (row height = tol)
    const buckets = {};
    for (const u of userPts) {
      const row = Math.floor(u.y / tol);
      if (!buckets[row]) buckets[row] = [];
      buckets[row].push(u);
    }
    const nearbyUser = (rx, ry) => {
      const row = Math.floor(ry / tol);
      for (let dr = -1; dr <= 1; dr++) {
        const bucket = buckets[row + dr];
        if (!bucket) continue;
        for (const u of bucket) {
          if (Math.sqrt((u.x - rx) ** 2 + (u.y - ry) ** 2) <= tol) return true;
        }
      }
      return false;
    };

    let hits = 0;
    for (const ref of refPath) {
      if (nearbyUser(ref.x, ref.y)) hits++;
    }
    // Coverage guard: if user did not reach near the end of the path, cap score
    const endPt = refPath[refPath.length - 1];
    const reachedEnd = userPts.some(
      (u) => Math.sqrt((u.x - endPt.x) ** 2 + (u.y - endPt.y) ** 2) <= tol * 4,
    );
    const raw = parseFloat(((hits / refPath.length) * 100).toFixed(1));
    return reachedEnd ? raw : parseFloat(Math.min(raw, 40).toFixed(1));
  }, []);

  // Keep loadingRef in sync so drawCanvas can read it without being a dep
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // ── Background canvas — rendered ONCE per stage; holds reference path + dots + labels ──
  const renderBgCanvas = useCallback(() => {
    if (!bgCanvasRef.current) {
      bgCanvasRef.current = document.createElement('canvas');
      bgCanvasRef.current.width  = CANVAS_WIDTH;
      bgCanvasRef.current.height = CANVAS_HEIGHT;
    }
    const canvas = bgCanvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Catmull-Rom spline — only called once per stage change, not every frame
    const drawSmooth = (pts) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];
        ctx.bezierCurveTo(
          p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6,
          p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6,
          p2.x, p2.y,
        );
      }
    };

    const pathToDraw = displayPath || expectedPath;
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#22d3ee');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.lineWidth   = 10;
    ctx.strokeStyle = gradient;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.setLineDash([10, 10]);
    drawSmooth(pathToDraw);
    ctx.stroke();
    ctx.setLineDash([]);

    const start = expectedPath[0];
    const end   = expectedPath[expectedPath.length - 1];

    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.arc(start.x, start.y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(end.x, end.y, 8, 0, Math.PI * 2); ctx.fill();

    const drawSideLabel = (label, dot) => {
      ctx.font = 'bold 12px Arial';
      const tw = ctx.measureText(label).width;
      const bw = tw + 16;
      const bh = 20;
      const lx = dot.x > CANVAS_WIDTH * 0.55
        ? Math.max(4, dot.x - bw - 14)
        : Math.min(dot.x + 14, CANVAS_WIDTH - bw - 4);
      const ly = Math.max(4, Math.min(dot.y - bh / 2, CANVAS_HEIGHT - bh - 4));
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(lx, ly, bw, bh);
      ctx.fillStyle    = '#e2e8f0';
      ctx.textAlign    = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, lx + 8, ly + bh / 2);
      ctx.textAlign    = 'start';
      ctx.textBaseline = 'alphabetic';
    };
    drawSideLabel('START', start);
    drawSideLabel('END',   end);
  }, [displayPath, expectedPath]);

  useEffect(() => { renderBgCanvas(); }, [renderBgCanvas]);

  // ── Stroke canvas helpers ────────────────────────────────────────────────────
  // clearStrokeCanvas: wipe the user stroke layer (called at start of every new attempt)
  const clearStrokeCanvas = useCallback(() => {
    if (!strokeCanvasRef.current) {
      strokeCanvasRef.current = document.createElement('canvas');
      strokeCanvasRef.current.width  = CANVAS_WIDTH;
      strokeCanvasRef.current.height = CANVAS_HEIGHT;
    } else {
      strokeCanvasRef.current.getContext('2d').clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }, []);

  // appendStrokeSegment: draw ONLY the newest segment — O(1) per point instead of O(n)
  const appendStrokeSegment = useCallback((fromPt, toPt) => {
    if (!strokeCanvasRef.current) return;
    const ctx = strokeCanvasRef.current.getContext('2d');
    ctx.lineWidth   = 8;
    ctx.strokeStyle = '#facc15';
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.beginPath();
    ctx.moveTo(fromPt.x, fromPt.y);
    ctx.lineTo(toPt.x, toPt.y);
    ctx.stroke();
  }, []);

  // ── Main canvas — trivially cheap compositor: two image blits per frame ───────
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (bgCanvasRef.current)     ctx.drawImage(bgCanvasRef.current,     0, 0);
    if (strokeCanvasRef.current) ctx.drawImage(strokeCanvasRef.current, 0, 0);
    if ((status === 'idle' || status === 'ready') && !loadingRef.current) {
      ctx.fillStyle    = 'rgba(0, 212, 255, 0.80)';
      ctx.font         = `bold 16px 'Fredoka', sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Draw on the path to start tracing!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.textAlign    = 'start';
      ctx.textBaseline = 'alphabetic';
    }
  }, [status]);

  // RAF loop composites bg + stroke onto the visible canvas at 60 fps during tracing.
  useEffect(() => {
    if (status === 'tracing') {
      const loop = () => {
        drawCanvas();
        drawRafRef.current = requestAnimationFrame(loop);
      };
      drawRafRef.current = requestAnimationFrame(loop);
      return () => {
        if (drawRafRef.current) cancelAnimationFrame(drawRafRef.current);
      };
    }
    drawCanvas();
  }, [status, drawCanvas]);

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== 'tracing') return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  // ── History (unlock-tracking only — display uses session-local state) ─────────
  const loadHistory = useCallback(async () => {
    if (!studentId) return;
    try {
      const data = await TraceTheLineService.getTraceHistory(studentId);
      const arr  = Array.isArray(data) ? data : [];
      const hasS1 = arr.some((h) => Number(h.stageNumber) === 1 && h.passed);
      const hasS2 = arr.some((h) => Number(h.stageNumber) === 2 && h.passed);
      setUnlockedStage((prev) => Math.max(prev, hasS2 ? 3 : hasS1 ? 2 : 1));
    } catch {
      // ignore
    }
  }, [studentId]);

  useEffect(() => { loadHistory(); }, [studentId, loadHistory]);

  // ── Pointer helpers ───────────────────────────────────────────────────────────
  const pointerToCanvas = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left)  / rect.width)  * CANVAS_WIDTH,
      y: ((clientY - rect.top)   / rect.height) * CANVAS_HEIGHT,
    };
  };

  // ── Session ───────────────────────────────────────────────────────────────────
  // skipReset=true when called from beginDraw (drawing already started, don't wipe points)
  const startStageSession = async (stageToStart, skipReset = false) => {
    sessionAbortRef.current = false;
    if (stageToStart === 1 && !skipReset) setSessionHistory([]);
    setLoading(true);
    setError('');
    setResult(null);
    setSession(null);
    if (!skipReset) {
      pointsRef.current = [];
      clearStrokeCanvas();
      setSeconds(0);
      setStatus('ready');
    }
    setSelectedStage(stageToStart);

    try {
      const s = await TraceTheLineService.startTrace(studentId, stageToStart);
      if (sessionAbortRef.current) return;   // reset clicked while API was in flight
      setSession(s);
      await loadHistory();
    } catch {
      // Silently fall back to session-less mode — game works locally without a server session.
      if (sessionAbortRef.current) return;
    } finally {
      if (!sessionAbortRef.current) setLoading(false);
    }
  };

  // ── Drawing handlers ──────────────────────────────────────────────────────────
  const beginDraw = (clientX, clientY) => {
    if (status === 'completed') return;
    const pt = pointerToCanvas(clientX, clientY);
    if (!pt) return;
    if (status === 'idle') {
      // Auto-start: begin drawing immediately, create session in background
      isDrawingRef.current = true;
      setStatus('tracing');          // timer starts right now
      clearStrokeCanvas();
      pointsRef.current = [pt];
      startStageSession(selectedStage, true);   // skipReset=true — don't wipe the points we just set
      return;
    }
    if (status === 'ready') {
      // Session already exists (e.g. from Next Stage); first draw starts the timer
      isDrawingRef.current = true;
      setStatus('tracing');
      clearStrokeCanvas();
      pointsRef.current = [pt];
      return;
    }
    if (status !== 'tracing') return;
    isDrawingRef.current = true;
    clearStrokeCanvas();
    pointsRef.current = [pt];
  };

  const continueDraw = (clientX, clientY) => {
    // Use isDrawingRef only — never block on React state lag
    if (!isDrawingRef.current) return;
    const pt = pointerToCanvas(clientX, clientY);
    if (!pt) return;
    const pts = pointsRef.current;
    if (pts.length > 0) {
      const last = pts[pts.length - 1];
      const dx = pt.x - last.x;
      const dy = pt.y - last.y;
      // Throttle: skip points closer than 3 px to reduce stored points
      if (dx * dx + dy * dy < 9) return;
      // Hard cap to bound memory usage on long traces
      if (pts.length >= 1500) return;
      // Draw only this new segment — O(1), not O(n)
      appendStrokeSegment(last, pt);
    }
    pts.push(pt);
  };

  const endDraw = () => { isDrawingRef.current = false; };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (pointsRef.current.length < 6) {
      setError('Draw at least a short trace before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    const clientAccuracy = computeAccuracy(pointsRef.current, expectedPath, activeStageMeta.difficulty);
    const passed         = clientAccuracy >= PASS_THRESHOLD;
    const stageNum       = Number(session?.stageNumber ?? selectedStage);

    // Apply result immediately — UI is never blocked by a slow/failing backend
    const finalResult = {
      accuracyRate: clientAccuracy,
      passed,
      stageNumber:  stageNum,
      topicId:      activeStageMeta.topicId,
      difficulty:   activeStageMeta.difficulty,
    };
    setResult(finalResult);
    setStatus('completed');
    setLoading(false);

    setStageAccuracies((prev) => ({ ...prev, [stageNum]: clientAccuracy }));
    setSessionHistory((prev) => [
      ...prev,
      {
        stageNumber:      stageNum,
        topicId:          activeStageMeta.topicId,
        difficulty:       activeStageMeta.difficulty,
        accuracyRate:     clientAccuracy,
        passed,
        timeSpentSeconds: seconds,
      },
    ]);

    if (passed) {
      if (stageNum < 3) {
        setUnlockedStage((prev) => Math.max(prev, stageNum + 1));
      } else {
        localStorage.setItem(`vn_minigame1_completed_${studentId}`, 'true');
      }
    }

    // Downsample to max 300 points — backend only needs ~90 for accuracy calculation
    const allPts = pointsRef.current;
    const step   = allPts.length > 300 ? Math.ceil(allPts.length / 300) : 1;
    const submitCoords = step === 1 ? allPts : allPts.filter((_, i) => i % step === 0);

    // Sync to backend in background — failure no longer blocks the user
    try {
      await TraceTheLineService.sendCoordinates(session.sessionId, {
        coordinates:  submitCoords,
        canvasWidth:  CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
      });
      await loadHistory();
    } catch {
      setError('Server sync failed — your score may not be recorded.');
    }
  };

  // ── Navigation helpers ────────────────────────────────────────────────────────
  const handleNextStage = async () => {
    const next = Math.min(3, Number(result?.stageNumber ?? selectedStage) + 1);
    setResult(null);
    setShowFinalScreen(false);
    await startStageSession(next);
  };

  const handleTryAgain = () => {
    sessionAbortRef.current = true;   // discard any in-flight session API calls
    isDrawingRef.current = false;
    setLoading(false);                // clear loading in case API call was pending
    setResult(null);
    setSession(null);
    pointsRef.current = [];
    clearStrokeCanvas();
    setSeconds(0);
    setStatus('idle');
    setError('');
  };

  const handleReset = () => {
    setSession(null);
    pointsRef.current = [];
    clearStrokeCanvas();
    setSeconds(0);
    setResult(null);
    setStatus('idle');
    setError('');
    setShowFinalScreen(false);
  };

  const handlePlayAgain = () => {
    setSession(null);
    pointsRef.current = [];
    clearStrokeCanvas();
    setSeconds(0);
    setResult(null);
    setStatus('idle');
    setError('');
    setSelectedStage(1);
    setStageAccuracies({});
    setSessionHistory([]);
    setShowFinalScreen(false);
    loadHistory();
  };

  const formatTime = (v) => {
    const m = Math.floor(v / 60).toString().padStart(2, '0');
    const s = (v % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const overallAccuracy = (() => {
    const vals = [stageAccuracies[1], stageAccuracies[2], stageAccuracies[3]].filter((v) => v != null);
    if (vals.length < 3) return null;
    return parseFloat((vals.reduce((a, b) => a + b, 0) / 3).toFixed(1));
  })();

  return (
    <div className="trace-the-line-page">
      <div className="trace-game-card">
        <div className="trace-header">
          <h1>Trace The Line: Nervous System Stages</h1>
        </div>

        <div className="trace-difficulty-selector">
          {STAGES.map((item) => {
            const isLocked   = item.stage > unlockedStage;
            const isSelected = item.stage === selectedStage;
            return (
              <button
                key={item.stage}
                type="button"
                className={`stage-chip ${isSelected ? 'selected' : ''}`}
                disabled={loading || status === 'tracing' || isLocked}
                onClick={() => {
                  if (item.stage === selectedStage) return;
                  pointsRef.current = [];
                  clearStrokeCanvas();
                  setSelectedStage(item.stage);
                  setStatus('idle');
                  setError('');
                  setResult(null);
                  setSession(null);
                  setSeconds(0);
                }}
              >
                Stage {item.stage}: {item.topicName} ({item.difficulty}){isLocked ? ' 🔒' : ''}
              </button>
            );
          })}
        </div>

        <div className="trace-metrics">
          <span>Timer: {formatTime(seconds)}</span>
          <span>Status: {status.toUpperCase()}</span>
          <span>Stage: {activeStageMeta.stage}</span>
          <span>Part: {activeStageMeta.topicName}</span>
          <span>Difficulty: {activeStageMeta.difficulty.toUpperCase()}</span>
        </div>

        <canvas
          ref={canvasRef}
          className="trace-canvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={(e) => beginDraw(e.clientX, e.clientY)}
          onMouseMove={(e) => continueDraw(e.clientX, e.clientY)}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={(e) => {
            e.preventDefault();
            const t = e.touches[0];
            if (t) beginDraw(t.clientX, t.clientY);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            const t = e.touches[0];
            if (t) continueDraw(t.clientX, t.clientY);
          }}
          onTouchEnd={(e) => { e.preventDefault(); endDraw(); }}
        />

        <div className="trace-actions">
          <button onClick={handleReset}>
            Reset
          </button>
          <button onClick={handleSubmit} disabled={loading || status !== 'tracing'}>
            Submit Coordinates
          </button>
        </div>

        {error && <div className="trace-error">{error}</div>}
      </div>

      {/* ── Trace History ───────────────────────────────────────────────────── */}
      <div className="trace-history-card">
        <h2>Trace History</h2>
        {sessionHistory.length === 0 ? (
          <p>No submissions yet this session.</p>
        ) : (
          <ul>
            {sessionHistory.map((item, idx) => (
              <li key={idx}>
                <span>S{item.stageNumber}</span>
                <span>{item.topicId}</span>
                <span>{item.difficulty || 'easy'}</span>
                <span>{item.accuracyRate}%</span>
                <span>{item.passed ? 'Pass' : 'Fail'}</span>
                <span>{item.timeSpentSeconds}s</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Stage result modal ───────────────────────────────────────────────── */}
      {result && !showFinalScreen && (
        <div className="trace-result-modal-backdrop">
          <div className="trace-result-modal">
            <h3>{result.passed ? '🎉 Stage Cleared!' : 'Stage Not Passed'}</h3>
            <p>Accuracy: <strong>{result.accuracyRate ?? 0}%</strong></p>
            <p>Stage: {result.stageNumber || activeStageMeta.stage}</p>
            <p>Part: {result.topicId || activeStageMeta.topicId}</p>
            <p>Difficulty: {result.difficulty || activeStageMeta.difficulty}</p>

            <div className="trace-result-actions">
              {result.passed && Number(result.stageNumber || selectedStage) < 3 && (
                <button onClick={handleNextStage} disabled={loading}>
                  Next Stage
                </button>
              )}
              {result.passed && Number(result.stageNumber || selectedStage) === 3 && (
                <button onClick={() => setShowFinalScreen(true)} disabled={loading}>
                  View Final Results
                </button>
              )}
              {!result.passed && (
                <button onClick={handleTryAgain} disabled={loading}>
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Final screen (all 3 stages cleared) ─────────────────────────────── */}
      {showFinalScreen && (
        <div className="trace-result-modal-backdrop">
          <canvas ref={confettiCanvasRef} className="trace-confetti-canvas" />
          <div className="trace-result-modal trace-final-screen">
            <h3>🏆 All Stages Complete!</h3>
            <div className="trace-final-accuracy-card">
              <p className="trace-final-label">Overall Accuracy</p>
              <div className="trace-final-accuracy">{overallAccuracy != null ? `${overallAccuracy}%` : '—'}</div>
            </div>
            <p className="trace-final-breakdown">
              Stage 1:&nbsp;<strong>{stageAccuracies[1] != null ? `${stageAccuracies[1]}%` : '—'}</strong>
              &emsp;Stage 2:&nbsp;<strong>{stageAccuracies[2] != null ? `${stageAccuracies[2]}%` : '—'}</strong>
              &emsp;Stage 3:&nbsp;<strong>{stageAccuracies[3] != null ? `${stageAccuracies[3]}%` : '—'}</strong>
            </p>

            <div className="trace-result-actions">
              <button onClick={handlePlayAgain} disabled={loading}>
                Play Again
              </button>
              <button
                className="trace-btn-continue"
                onClick={() => navigate('/lessons/nervous-system/play/chapter2')}
                disabled={loading}
              >
                Continue to Chapter 2
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraceTheLineGame;