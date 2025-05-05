package com.edu.cit.Learnify.DTO;

public class StudentDTO {
    private String name;
    private String email;
    private String password;  // Add password field
    private int grade;

    // Constructors
    public StudentDTO() {}

    public StudentDTO(String name, String email, String password, int grade) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.grade = grade;
    }

    // Getters and Setters
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getGrade() {
        return grade;
    }

    public void setGrade(int grade) {
        this.grade = grade;
    }
}
