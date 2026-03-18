package com.edu.cit.Learnify.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.cit.Learnify.DTO.PointsDTO;
import com.edu.cit.Learnify.DTO.TraceDTO;
import com.edu.cit.Learnify.Entity.TracePath;
import com.edu.cit.Learnify.Entity.TraceSession;
import com.edu.cit.Learnify.Repository.TraceSessionRepository;

@Service
public class TraceService {

    private static final int FIRST_STAGE = 1;
    private static final int FINAL_STAGE = 3;

    private static final Map<Integer, StageDefinition> STAGES = new HashMap<>();

    static {
        STAGES.put(1, new StageDefinition(1, "spinal-cord", "easy", 75.0));
        STAGES.put(2, new StageDefinition(2, "brainstem", "medium", 75.0));
        STAGES.put(3, new StageDefinition(3, "peripheral-nerves", "hard", 75.0));
    }

    private final TraceSessionRepository traceSessionRepository;
    private final PointsService pointsService;

    @Autowired
    public TraceService(TraceSessionRepository traceSessionRepository, PointsService pointsService) {
        this.traceSessionRepository = traceSessionRepository;
        this.pointsService = pointsService;
    }

    public TraceDTO startStageTrace(String studentId, int stageNumber) {
        StageDefinition stage = getStage(stageNumber);
        validateStageUnlocked(studentId, stageNumber);

        TraceSession session = new TraceSession();
        session.setStudentId(studentId);
        session.setStageNumber(stage.stageNumber());
        session.setTopicId(stage.topicId());
        session.setDifficulty(stage.difficulty());
        session.setAccuracyRate(0);
        session.setTimeSpentSeconds(0);
        session.setXpEarned(0);
        session.setBadgeEligible(false);
        session.setStatus("STARTED");
        session.setPassed(false);
        session.setCompleted(false);
        session.setStartedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        TraceSession saved = traceSessionRepository.save(session);
        TraceDTO dto = toDTO(saved);
        dto.setFeedback("Stage " + stage.stageNumber() + " started: trace the " + stage.topicId() + " path on " + stage.difficulty() + ".");
        return dto;
    }

    public TraceDTO sendCoordinates(String sessionId, TracePath pathPayload) {
        TraceSession session = findSession(sessionId);
        if (session.isCompleted()) {
            return withFeedback(toDTO(session), "This trace session is already completed.");
        }

        if (pathPayload == null || pathPayload.getCoordinates() == null || pathPayload.getCoordinates().isEmpty()) {
            throw new IllegalArgumentException("Path coordinates are required.");
        }

        session.setTracePath(pathPayload);
        session.setUpdatedAt(LocalDateTime.now());

        double accuracy = computeAccuracy(pathPayload, session.getTopicId(), session.getDifficulty());
        StageDefinition stage = getStage(session.getStageNumber());
        boolean passed = accuracy >= stage.passingAccuracy();

        session.setAccuracyRate(round2(accuracy));
        session.setPassed(passed);
        session.setStatus("COMPLETED");
        session.setCompleted(true);
        session.setEndedAt(LocalDateTime.now());
        session.setTimeSpentSeconds(calculateTimeSpentSeconds(session));

        int xpEarned = computeXp(session.getAccuracyRate(), session.isPassed(), session.getDifficulty());
        boolean badgeEligible = isEligibleForFinalBadge(session, session.getAccuracyRate());

        session.setXpEarned(xpEarned);
        session.setBadgeEligible(badgeEligible);
        session.setCompleted(true);
        session.setStatus("COMPLETED");
        session.setUpdatedAt(LocalDateTime.now());

        TraceSession saved = traceSessionRepository.save(session);

        if (saved.getStudentId() != null && !saved.getStudentId().isBlank() && xpEarned > 0) {
            PointsDTO pointsDTO = new PointsDTO();
            pointsDTO.setStudentId(saved.getStudentId());
            pointsDTO.setPoints(xpEarned);
            pointsDTO.setActivityType("TRACE_THE_LINE");
            pointsDTO.setActivityId(saved.getId());
            pointsDTO.setDescription("Trace Stage " + saved.getStageNumber() + " (" + saved.getDifficulty() + "): " + saved.getTopicId() + " (" + saved.getAccuracyRate() + "% accuracy)");
            pointsService.awardPoints(pointsDTO);
        }

        String feedback;
        if (!saved.isPassed()) {
            feedback = "Keep going! You need at least 75% to pass Stage " + saved.getStageNumber() + ".";
        } else if (saved.getStageNumber() < FINAL_STAGE) {
            feedback = "Great job! Stage " + saved.getStageNumber() + " cleared. Stage " + (saved.getStageNumber() + 1) + " is now unlocked.";
        } else if (saved.isBadgeEligible()) {
            feedback = "Final stage cleared with strong performance! You are badge-eligible.";
        } else {
            feedback = "Final stage cleared! Improve overall accuracy for badge eligibility.";
        }

        return withFeedback(toDTO(saved), feedback);
    }

    public TraceDTO completeTrace(String sessionId) {
        TraceSession session = findSession(sessionId);
        if (session.isCompleted()) {
            return withFeedback(toDTO(session), "Trace session already completed.");
        }
        return withFeedback(toDTO(session), "Submit coordinates first to evaluate this stage.");
    }

    public List<TraceDTO> getTraceHistory(String studentId) {
        return traceSessionRepository.findByStudentIdOrderByStartedAtDesc(studentId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private TraceSession findSession(String sessionId) {
        return traceSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Trace session not found: " + sessionId));
    }

    private TraceDTO toDTO(TraceSession session) {
        TraceDTO dto = new TraceDTO();
        dto.setSessionId(session.getId());
        dto.setStudentId(session.getStudentId());
        dto.setStageNumber(session.getStageNumber());
        dto.setTopicId(session.getTopicId());
        dto.setDifficulty(session.getDifficulty());
        dto.setAccuracyRate(session.getAccuracyRate());
        dto.setTimeSpentSeconds(session.getTimeSpentSeconds());
        dto.setStatus(session.getStatus());
        dto.setPassed(session.isPassed());
        dto.setXpEarned(session.getXpEarned());
        dto.setBadgeEligible(session.isBadgeEligible());
        dto.setStartedAt(session.getStartedAt());
        dto.setEndedAt(session.getEndedAt());
        if (session.getTracePath() != null) {
            dto.setCoordinates(session.getTracePath().getCoordinates());
        }
        return dto;
    }

    private TraceDTO withFeedback(TraceDTO dto, String feedback) {
        dto.setFeedback(feedback);
        return dto;
    }

    private int calculateTimeSpentSeconds(TraceSession session) {
        LocalDateTime start = session.getStartedAt();
        LocalDateTime end = (session.getEndedAt() != null) ? session.getEndedAt() : LocalDateTime.now();
        if (start == null) {
            return 0;
        }
        return (int) Math.max(0, Duration.between(start, end).toSeconds());
    }

    private int computeXp(double accuracy, boolean passed, String difficulty) {
        if (accuracy <= 0) {
            return 0;
        }
        int base = passed ? 20 : 8;
        int accuracyBonus = (int) Math.round(accuracy / 5.0);
        int difficultyBonus = switch (difficulty.toLowerCase()) {
            case "medium" -> 8;
            case "hard" -> 16;
            default -> 0;
        };
        return Math.max(0, base + accuracyBonus + difficultyBonus);
    }

    private double computeAccuracy(TracePath pathPayload, String topicId, String difficulty) {
        List<TracePath.TracePoint> actualPoints = sanitize(pathPayload.getCoordinates());
        if (actualPoints.size() < 6) {
            return 0;
        }

        int width = (pathPayload.getCanvasWidth() == null || pathPayload.getCanvasWidth() <= 0)
                ? 1
                : pathPayload.getCanvasWidth();
        int height = (pathPayload.getCanvasHeight() == null || pathPayload.getCanvasHeight() <= 0)
                ? 1
                : pathPayload.getCanvasHeight();

        List<TracePath.TracePoint> normalizedActual = actualPoints.stream()
                .map(p -> new TracePath.TracePoint(
                        clamp(p.getX() / width, 0, 1),
                        clamp(p.getY() / height, 0, 1)))
                .collect(Collectors.toList());

        List<TracePath.TracePoint> expected = buildExpectedPath(90, topicId, difficulty);

        double avgMinDistance = normalizedActual.stream()
                .mapToDouble(p -> minDistance(p, expected))
                .average()
                .orElse(1.0);

        double startDistance = minDistance(normalizedActual.get(0), expected);
        double endDistance = minDistance(normalizedActual.get(normalizedActual.size() - 1), expected);

        double distanceScore = clamp(1.0 - (avgMinDistance / 0.14), 0, 1);
        double endpointScore = clamp(1.0 - ((startDistance + endDistance) / 0.28), 0, 1);
        double combined = (distanceScore * 0.85) + (endpointScore * 0.15);

        return combined * 100.0;
    }

    private List<TracePath.TracePoint> buildExpectedPath(int samples, String topicId, String difficulty) {
        return IntStream.range(0, samples)
                .mapToObj(i -> {
                    double t = i / (double) (samples - 1);
                    double y = 0.08 + (0.84 * t);
                    double x;

                    if ("brainstem".equals(topicId)) {
                        x = 0.5 + 0.14 * Math.sin(y * 12.0) + 0.06 * Math.cos(y * 22.0);
                    } else if ("peripheral-nerves".equals(topicId)) {
                        x = 0.5 + 0.20 * Math.sin(y * 18.0) + 0.07 * Math.sin(y * 42.0) + 0.03 * Math.cos(y * 70.0);
                    } else if ("medium".equalsIgnoreCase(difficulty)) {
                        x = 0.5 + 0.16 * Math.sin(y * 14.0) + 0.04 * Math.sin(y * 34.0);
                    } else if ("hard".equalsIgnoreCase(difficulty)) {
                        x = 0.5 + 0.20 * Math.sin(y * 18.0) + 0.07 * Math.sin(y * 42.0) + 0.03 * Math.cos(y * 70.0);
                    } else {
                        x = 0.5 + 0.12 * Math.sin(y * 10.5);
                    }

                    return new TracePath.TracePoint(x, y);
                })
                .collect(Collectors.toList());
    }

    private StageDefinition getStage(int stageNumber) {
        StageDefinition stage = STAGES.get(stageNumber);
        if (stage == null) {
            throw new IllegalArgumentException("Invalid stage. Valid stages are 1 to 3.");
        }
        return stage;
    }

    private void validateStageUnlocked(String studentId, int targetStage) {
        if (targetStage <= FIRST_STAGE || studentId == null || studentId.isBlank()) {
            return;
        }

        for (int stage = FIRST_STAGE; stage < targetStage; stage++) {
            if (!isStagePassed(studentId, stage)) {
                throw new IllegalStateException("Stage " + targetStage + " is locked. Pass Stage " + stage + " first.");
            }
        }
    }

    private boolean isStagePassed(String studentId, int stageNumber) {
        StageDefinition stage = getStage(stageNumber);
        return traceSessionRepository.findByStudentIdOrderByStartedAtDesc(studentId)
            .stream()
            .anyMatch(item -> resolveStageNumber(item) == stageNumber
                && (item.isPassed() || item.getAccuracyRate() >= stage.passingAccuracy()));
    }

    private boolean isEligibleForFinalBadge(TraceSession session, double currentAccuracy) {
        if (session.getStageNumber() != FINAL_STAGE || !session.isPassed() || session.getStudentId() == null || session.getStudentId().isBlank()) {
            return false;
        }

        if (!isStagePassed(session.getStudentId(), 1) || !isStagePassed(session.getStudentId(), 2)) {
            return false;
        }

        List<TraceSession> sessions = traceSessionRepository.findByStudentIdOrderByStartedAtDesc(session.getStudentId());

        double bestStage1 = bestAccuracyForStage(sessions, 1);
        double bestStage2 = bestAccuracyForStage(sessions, 2);
        double bestStage3 = Math.max(bestAccuracyForStage(sessions, 3), currentAccuracy);

        double average = (bestStage1 + bestStage2 + bestStage3) / 3.0;
        return average >= 85.0;
    }

    private double bestAccuracyForStage(List<TraceSession> sessions, int stageNumber) {
        return sessions.stream()
                .filter(item -> resolveStageNumber(item) == stageNumber)
                .mapToDouble(TraceSession::getAccuracyRate)
                .max()
                .orElse(0.0);
    }

    private int resolveStageNumber(TraceSession session) {
        if (session.getStageNumber() > 0) {
            return session.getStageNumber();
        }

        String topicId = session.getTopicId();
        if (topicId == null) {
            return 0;
        }

        return STAGES.values().stream()
                .filter(stage -> stage.topicId().equalsIgnoreCase(topicId))
                .map(StageDefinition::stageNumber)
                .findFirst()
                .orElse(0);
    }

    private record StageDefinition(int stageNumber, String topicId, String difficulty, double passingAccuracy) {
    }

    private List<TracePath.TracePoint> sanitize(List<TracePath.TracePoint> points) {
        if (points == null) {
            return new ArrayList<>();
        }
        return points.stream()
                .filter(p -> p != null)
                .filter(p -> !Double.isNaN(p.getX()) && !Double.isNaN(p.getY()))
                .filter(p -> !Double.isInfinite(p.getX()) && !Double.isInfinite(p.getY()))
                .sorted(Comparator.comparingDouble(TracePath.TracePoint::getY))
                .collect(Collectors.toList());
    }

    private double minDistance(TracePath.TracePoint point, List<TracePath.TracePoint> expected) {
        return expected.stream()
                .mapToDouble(target -> euclidean(point, target))
                .min()
                .orElse(1.0);
    }

    private double euclidean(TracePath.TracePoint p1, TracePath.TracePoint p2) {
        double dx = p1.getX() - p2.getX();
        double dy = p1.getY() - p2.getY();
        return Math.sqrt((dx * dx) + (dy * dy));
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }
}
