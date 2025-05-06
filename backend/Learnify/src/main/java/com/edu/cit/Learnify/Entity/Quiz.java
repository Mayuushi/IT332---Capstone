package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "quizzes")
public class Quiz {

    @Id
    private String id;  // MongoDB identifier
    private Integer teacherId;  // Teacher's ID
    private String title;  // Quiz title
    private LocalDateTime createdAt;  // Creation timestamp
    private List<Question> questions;  // List of questions in this quiz

    private String classId;


    // Default constructor
    public Quiz() {}

    // Constructor with all fields
    public Quiz(Integer teacherId, String title, LocalDateTime createdAt) {
        this.teacherId = teacherId;
        this.title = title;
        this.createdAt = createdAt;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}
