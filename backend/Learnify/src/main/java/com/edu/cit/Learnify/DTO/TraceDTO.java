package com.edu.cit.Learnify.DTO;

import java.time.LocalDateTime;
import java.util.List;

import com.edu.cit.Learnify.Entity.TracePath;

public class TraceDTO {

    private String sessionId;
    private String studentId;
    private int stageNumber;
    private String topicId;
    private String difficulty;
    private List<TracePath.TracePoint> coordinates;

    private double accuracyRate;
    private int timeSpentSeconds;
    private String status;
    private boolean passed;

    private int xpEarned;
    private boolean badgeEligible;
    private String feedback;

    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public int getStageNumber() {
        return stageNumber;
    }

    public void setStageNumber(int stageNumber) {
        this.stageNumber = stageNumber;
    }

    public String getTopicId() {
        return topicId;
    }

    public void setTopicId(String topicId) {
        this.topicId = topicId;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public List<TracePath.TracePoint> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<TracePath.TracePoint> coordinates) {
        this.coordinates = coordinates;
    }

    public double getAccuracyRate() {
        return accuracyRate;
    }

    public void setAccuracyRate(double accuracyRate) {
        this.accuracyRate = accuracyRate;
    }

    public int getTimeSpentSeconds() {
        return timeSpentSeconds;
    }

    public void setTimeSpentSeconds(int timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public int getXpEarned() {
        return xpEarned;
    }

    public void setXpEarned(int xpEarned) {
        this.xpEarned = xpEarned;
    }

    public boolean isBadgeEligible() {
        return badgeEligible;
    }

    public void setBadgeEligible(boolean badgeEligible) {
        this.badgeEligible = badgeEligible;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(LocalDateTime endedAt) {
        this.endedAt = endedAt;
    }
}
