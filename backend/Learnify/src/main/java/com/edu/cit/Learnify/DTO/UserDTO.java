package com.edu.cit.Learnify.DTO;

public class UserDTO {
    private String id;
    private String fullName;

    public UserDTO() {}

    public UserDTO(String id, String fullName) {
        this.id = id;
        this.fullName = fullName;
    }

    public String getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
