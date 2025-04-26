package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "studentBadges")
public class StudentBadge {
    @Id
    private String id;
    private String studentId;
    private String badgeId;
    private LocalDateTime earnedAt;
    private boolean displayed; // Whether the student has seen this badge yet

    // Constructors
    public StudentBadge() {}

    public StudentBadge(String studentId, String badgeId) {
        this.studentId = studentId;
        this.badgeId = badgeId;
        this.earnedAt = LocalDateTime.now();
        this.displayed = false;
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

    public String getBadgeId() {
        return badgeId;
    }

    public void setBadgeId(String badgeId) {
        this.badgeId = badgeId;
    }

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }

    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }

    public boolean isDisplayed() {
        return displayed;
    }

    public void setDisplayed(boolean displayed) {
        this.displayed = displayed;
    }
}