package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "neuro_impact_scores")
public class NeuroImpactScore {

    @Id
    private String id;
    private String studentId;
    private int score;
    private LocalDateTime achievedAt;

    public NeuroImpactScore() {}

    public NeuroImpactScore(String studentId, int score) {
        this.studentId = studentId;
        this.score = score;
        this.achievedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public LocalDateTime getAchievedAt() { return achievedAt; }
    public void setAchievedAt(LocalDateTime achievedAt) { this.achievedAt = achievedAt; }
}
