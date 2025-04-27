package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "teachers")
public class Teacher {

    private Integer id;
    private String name;
    private String email;

    // Default constructor
    public Teacher() {}

    // Constructor with all fields
    public Teacher(String name, String email) {
        this.name = name;
        this.email = email;
    }

    // Getter and Setter for id
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    // Getter and Setter for name
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getter and Setter for email
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

