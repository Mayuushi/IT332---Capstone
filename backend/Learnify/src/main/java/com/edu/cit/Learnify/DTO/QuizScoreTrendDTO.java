package com.edu.cit.Learnify.DTO;

import java.time.LocalDate;

public class QuizScoreTrendDTO {
    private LocalDate date;
    private double averageScore;

    public QuizScoreTrendDTO() {}

    public QuizScoreTrendDTO(LocalDate date, double averageScore) {
        this.date = date;
        this.averageScore = averageScore;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
}
