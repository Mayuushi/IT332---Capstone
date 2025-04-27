package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "quizzes")
public class Quiz {

    @Id
    private String id;  // Using String for the ID to match MongoDB's default behavior
    private Integer teacherId;
    private String title;
    private LocalDateTime createdAt;

    // Default constructor
    public Quiz() {}

    // Constructor with all fields
    public Quiz(Integer teacherId, String title, LocalDateTime createdAt) {
        this.teacherId = teacherId;
        this.title = title;
        this.createdAt = createdAt;
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
}
