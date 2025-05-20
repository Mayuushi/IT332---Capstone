package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "quiz_submissions")
public class QuizSubmission {

    @Id
    private String id;
    private String quizId;
    private String studentId;
    private Map<String, String> answers; // questionText -> studentAnswer
    private int score;
    private int totalPossible;
    private LocalDateTime submittedAt = LocalDateTime.now();

    public QuizSubmission() {}

    public QuizSubmission(String quizId, String studentId, Map<String, String> answers, int score, int totalPossible) {
        this.quizId = quizId;
        this.studentId = studentId;
        this.answers = answers;
        this.score = score;
        this.totalPossible = totalPossible;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getQuizId() { return quizId; }
    public void setQuizId(String quizId) { this.quizId = quizId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public Map<String, String> getAnswers() { return answers; }
    public void setAnswers(Map<String, String> answers) { this.answers = answers; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getTotalPossible() { return totalPossible; }
    public void setTotalPossible(int totalPossible) { this.totalPossible = totalPossible; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
