package com.edu.cit.Learnify.DTO;

import java.util.List;

public class ClassWithUsersDTO {
    private String id;
    private String topic;
    private UserDTO teacher;
    private List<UserDTO> classmates;

    public ClassWithUsersDTO() {}

    public ClassWithUsersDTO(String id, String topic, UserDTO teacher, List<UserDTO> classmates) {
        this.id = id;
        this.topic = topic;
        this.teacher = teacher;
        this.classmates = classmates;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public UserDTO getTeacher() {
        return teacher;
    }

    public void setTeacher(UserDTO teacher) {
        this.teacher = teacher;
    }

    public List<UserDTO> getClassmates() {
        return classmates;
    }

    public void setClassmates(List<UserDTO> classmates) {
        this.classmates = classmates;
    }
}
