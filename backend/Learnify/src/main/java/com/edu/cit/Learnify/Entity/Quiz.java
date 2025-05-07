package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "quizzes")
public class Quiz {
    @Id
    private String id;
    private String teacherId;
    private String title;
    private LocalDateTime createdAt = LocalDateTime.now();
    private String classId;
    private List<Question> questions;

    // Constructors
    public Quiz() {}

    public Quiz(String teacherId, String title, String classId, List<Question> questions) {
        this.teacherId = teacherId;
        this.title = title;
        this.classId = classId;
        this.questions = questions;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }
    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
}