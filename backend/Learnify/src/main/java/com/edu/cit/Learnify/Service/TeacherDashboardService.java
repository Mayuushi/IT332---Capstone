package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.Entity.*;
import com.edu.cit.Learnify.Entity.Class;
import com.edu.cit.Learnify.Repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TeacherDashboardService {

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private GameProgressRepository gameProgressRepository;

    @Autowired
    private PointsRepository pointsRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    @Autowired
    private SessionLogRepository sessionLogRepository;

    @Autowired
    private StudentRepository studentRepository;


    public Map<String, Object> getOverviewData(String classId) {
        Map<String, Object> overview = new HashMap<>();

        Optional<Class> optionalClass = classRepository.findById(classId);
        if (optionalClass.isEmpty()) {
            overview.put("error", "Class not found");
            return overview;
        }

        Class classroom = optionalClass.get();
        List<String> studentIds = classroom.getStudentIds();

        // Lesson Completion
        int totalStudents = studentIds.size();
        long studentsCompletedLessons = studentIds.stream()
                .map(gameProgressRepository::findByUserId)
                .filter(opt -> opt.isPresent() && opt.get().getCompletedNodes() > 0)
                .count();
        double lessonCompletionRate = totalStudents > 0
                ? (studentsCompletedLessons * 100.0 / totalStudents)
                : 0.0;

        // Quizzes and Submissions
        List<Quiz> quizzes = quizRepository.findByClassId(classId);
        List<String> quizIds = quizzes.stream().map(Quiz::getId).toList();
        List<QuizSubmission> submissions = quizSubmissionRepository.findByQuizIdIn(quizIds);

        double avgQuizScore = submissions.stream()
                .mapToDouble(QuizSubmission::getScore)
                .average()
                .orElse(0.0);

        // Engagement Points
        int totalEngagementPoints = 0;
        for (String studentId : studentIds) {
            List<Points> points = pointsRepository.findByStudentId(studentId);
            totalEngagementPoints += points.stream().mapToInt(Points::getPointsEarned).sum();
        }
        double avgEngagementPoints = totalStudents > 0
                ? totalEngagementPoints * 1.0 / totalStudents
                : 0.0;

        // Build Overview Response
        overview.put("totalStudents", totalStudents);
        overview.put("lessonCompletionRate", lessonCompletionRate);
        overview.put("totalQuizzes", quizzes.size());
        overview.put("totalSubmissions", submissions.size());
        overview.put("averageQuizScore", avgQuizScore);
        overview.put("totalEngagementPoints", totalEngagementPoints);
        overview.put("averageEngagementPoints", avgEngagementPoints);

        return overview;
    }

    // ✅ Real-time Monitoring Logic
    public Map<String, Object> getRealTimeMonitoringData(String classId) {
        Map<String, Object> realtime = new HashMap<>();

        Optional<Class> optionalClass = classRepository.findById(classId);
        if (optionalClass.isEmpty()) {
            realtime.put("error", "Class not found");
            return realtime;
        }

        List<SessionLog> sessionLogs = sessionLogRepository.findByClassId(classId);
        List<Map<String, Object>> activeSessions = new ArrayList<>();
        Map<String, Long> totalActivityTime = new HashMap<>();

        for (SessionLog session : sessionLogs) {
            String activity = session.getActivityType();
            LocalDateTime start = session.getStartTime();
            LocalDateTime end = session.getEndTime() != null ? session.getEndTime() : LocalDateTime.now();

            long durationMinutes = Duration.between(start, end).toMinutes();
            totalActivityTime.put(activity, totalActivityTime.getOrDefault(activity, 0L) + durationMinutes);

            if (session.getEndTime() == null) {
                Map<String, Object> sessionInfo = new HashMap<>();
                sessionInfo.put("id", session.getId());
                sessionInfo.put("studentId", session.getStudentId());
                sessionInfo.put("classId", session.getClassId());
                sessionInfo.put("activityType", activity);
                sessionInfo.put("startTime", start);
                sessionInfo.put("endTime", session.getEndTime());  // null here for active sessions

                Optional<Student> studentOpt = studentRepository.findById(session.getStudentId());
                String studentName = studentOpt.map(Student::getName).orElse(session.getStudentId());
                sessionInfo.put("studentName", studentName);

                activeSessions.add(sessionInfo);
            }
        }

        realtime.put("activeSessions", activeSessions);
        realtime.put("activityDurations", totalActivityTime);
        return realtime;
    }
}
