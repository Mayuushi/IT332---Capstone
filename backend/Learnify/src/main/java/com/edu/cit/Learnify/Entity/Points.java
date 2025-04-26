package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "points")
public class Points {
    @Id
    private String id;
    private String studentId;
    private int pointsEarned;
    private String activityType; // QUIZ_COMPLETION, LESSON_COMPLETION, DAILY_LOGIN, etc.
    private String activityId;   // Reference to the activity that generated these points
    private LocalDateTime earnedAt;
    private String description;

    // Constructors
    public Points() {}

    public Points(String studentId, int pointsEarned, String activityType,
                  String activityId, String description) {
        this.studentId = studentId;
        this.pointsEarned = pointsEarned;
        this.activityType = activityType;
        this.activityId = activityId;
        this.earnedAt = LocalDateTime.now();
        this.description = description;
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

    public int getPointsEarned() {
        return pointsEarned;
    }

    public void setPointsEarned(int pointsEarned) {
        this.pointsEarned = pointsEarned;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getActivityId() {
        return activityId;
    }

    public void setActivityId(String activityId) {
        this.activityId = activityId;
    }

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }

    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
