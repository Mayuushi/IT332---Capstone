package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "teachers")
public class Teacher {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private boolean isTeacher = true; // Default to true for all teacher entities

    public Teacher() {}

    public Teacher(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.isTeacher = true;
    }

    // Getters and Setters
    public String getId() { return id; }

    public void setId(String id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public boolean isTeacher() { return isTeacher; }

    public void setTeacher(boolean teacher) { isTeacher = teacher; }
}
