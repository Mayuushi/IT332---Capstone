package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
public class Student {
    @Id
    private String id;
    private String name;
    private String email;
    private int grade;
    private int totalPoints;
    private int level;

    // Constructors
    public Student() {}

    public Student(String name, String email, int grade) {
        this.name = name;
        this.email = email;
        this.grade = grade;
        this.totalPoints = 0;
        this.level = 1;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getGrade() {
        return grade;
    }

    public void setGrade(int grade) {
        this.grade = grade;
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

    // Add points and update level if necessary
    public void addPoints(int points) {
        this.totalPoints += points;
        updateLevel();
    }

    private void updateLevel() {
        // Simple level calculation - adjust as needed for your game mechanics
        this.level = (this.totalPoints / 100) + 1;
    }
}