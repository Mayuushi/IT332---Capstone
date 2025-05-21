package com.edu.cit.Learnify.DTO;

import java.time.LocalDateTime;

public class QuizPerformanceDTO {
    private String quizTitle;
    private int score;
    private int totalPossible;
    private LocalDateTime submittedAt;

    public QuizPerformanceDTO() {}

    public QuizPerformanceDTO(String quizTitle, int score, int totalPossible, LocalDateTime submittedAt) {
        this.quizTitle = quizTitle;
        this.score = score;
        this.totalPossible = totalPossible;
        this.submittedAt = submittedAt;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalPossible() {
        return totalPossible;
    }

    public void setTotalPossible(int totalPossible) {
        this.totalPossible = totalPossible;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}

