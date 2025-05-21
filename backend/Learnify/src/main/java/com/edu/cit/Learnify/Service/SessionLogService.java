package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.Entity.SessionLog;
import com.edu.cit.Learnify.Entity.Student;
import com.edu.cit.Learnify.Repository.SessionLogRepository;
import com.edu.cit.Learnify.Repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class SessionLogService {

    @Autowired
    private final SessionLogRepository sessionLogRepository;

    @Autowired
    private StudentRepository studentRepository;


    @Autowired
    public SessionLogService(SessionLogRepository sessionLogRepository) {
        this.sessionLogRepository = sessionLogRepository;
    }

    // Fetch ongoing sessions (endTime == null)
    public List<SessionLog> getOngoingSessionsByClass(String classId) {
        return sessionLogRepository.findByClassIdAndEndTimeIsNull(classId);
    }

    // Fetch completed sessions (endTime != null)
    public List<SessionLog> getCompletedSessionsByClass(String classId) {
        // Since your repo has no method for endTime != null, add custom method
        return sessionLogRepository.findByClassIdAndEndTimeIsNotNull(classId);
    }

    // Start a new session
   // Start a new session and return the saved session with generated ID
public SessionLog startSession(String studentIdentifier, String classId, String activityType) {
    // Try finding student by email (or directly by ID if needed)
    Student student = studentRepository.findByEmail(studentIdentifier);

    if (student == null) {
        // fallback: try by ID in case frontend sent ObjectId
        Optional<Student> opt = studentRepository.findById(studentIdentifier);
        if (opt.isEmpty()) {
            throw new RuntimeException("Student not found with identifier: " + studentIdentifier);
        }
        student = opt.get();
    }

    SessionLog session = new SessionLog();
    session.setStudentId(student.getId()); // ✅ Always store Mongo ObjectId here
    session.setClassId(classId);
    session.setActivityType(activityType);
    session.setStartTime(LocalDateTime.now());
    session.setEndTime(null);

    return sessionLogRepository.save(session);
}



    // End a session (optional)
    public void endSession(String sessionId) {
        SessionLog session = sessionLogRepository.findById(sessionId).orElse(null);
        if (session != null && session.getEndTime() == null) {
            session.setEndTime(LocalDateTime.now());
            sessionLogRepository.save(session);
        }
    }

    // Real-time monitoring
    public Map<String, Object> getRealTimeMonitoringData(String classId) {
    // Get ALL sessions for the class, not just active ones
    List<SessionLog> allSessions = sessionLogRepository.findByClassId(classId);

    List<SessionLog> activeSessions = new ArrayList<>();
    Map<String, Integer> activityDurations = new HashMap<>();

    for (SessionLog log : allSessions) {
        LocalDateTime endTime = log.getEndTime() != null ? log.getEndTime() : LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(log.getStartTime(), endTime);

        activityDurations.merge(log.getActivityType(), (int) minutes, Integer::sum);

        if (log.getEndTime() == null) {
            activeSessions.add(log);
        }
    }

    Map<String, Object> result = new HashMap<>();
    result.put("activeSessions", activeSessions);
    result.put("activityDurations", activityDurations);
    return result;
}
    public void endQuizSession(String studentId, String classId) {
    sessionLogRepository.deleteByStudentIdAndClassIdAndActivityTypeAndEndTimeIsNull(
        studentId, classId, "quiz"
    );
}

public List<Map<String, Object>> getCompletedSessionsWithStudentNames(String classId) {
    List<SessionLog> sessions = sessionLogRepository.findByClassIdAndEndTimeIsNotNull(classId);
    List<Map<String, Object>> enrichedSessions = new ArrayList<>();

    for (SessionLog session : sessions) {
        Optional<Student> studentOpt = studentRepository.findById(session.getStudentId());
        String studentName = studentOpt.map(Student::getName).orElse("Unknown");

        Map<String, Object> sessionData = new HashMap<>();
        sessionData.put("studentName", studentName);
        sessionData.put("activityType", session.getActivityType());
        sessionData.put("startTime", session.getStartTime());
        sessionData.put("endTime", session.getEndTime());

        enrichedSessions.add(sessionData);
    }

    return enrichedSessions;
}




}
