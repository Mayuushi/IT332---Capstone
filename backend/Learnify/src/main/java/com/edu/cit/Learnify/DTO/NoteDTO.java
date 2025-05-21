package com.edu.cit.Learnify.DTO;

import java.time.LocalDateTime;

public class NoteDTO {
    private String note;
    private String teacherName;
    private LocalDateTime createdAt;

    public NoteDTO(String note, String teacherName, LocalDateTime createdAt) {
        this.note = note;
        this.teacherName = teacherName;
        this.createdAt = createdAt;
    }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
