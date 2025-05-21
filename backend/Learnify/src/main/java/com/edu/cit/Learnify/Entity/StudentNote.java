package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "student_notes")
public class StudentNote {
    @Id
    private String id;
    private String studentId;
    private String teacherId;
    private String note;
    private LocalDateTime createdAt = LocalDateTime.now();

    public StudentNote() {}

    public StudentNote(String studentId, String teacherId, String note) {
        this.studentId = studentId;
        this.teacherId = teacherId;
        this.note = note;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
