package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "session_logs")
public class SessionLog {

    @Id
    private String id;

    private String studentId;
    private String classId;
    private String activityType; // e.g., "lesson", "quiz"
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // No-arg constructor
    public SessionLog() {}

    // All-args constructor
    public SessionLog(String id, String studentId, String classId, String activityType,
                      LocalDateTime startTime, LocalDateTime endTime) {
        this.id = id;
        this.studentId = studentId;
        this.classId = classId;
        this.activityType = activityType;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}
