package com.edu.cit.Learnify.DTO;

public class StudentPointsDTO {
    private String studentId;
    private String studentName;
    private int totalPoints;
    private int level;

    // Constructors, Getters and Setters
    public StudentPointsDTO(String studentId, String studentName, int totalPoints, int level) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.totalPoints = totalPoints;
        this.level = level;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public int getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(int totalPoints) {
        this.totalPoints = totalPoints;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }
}

