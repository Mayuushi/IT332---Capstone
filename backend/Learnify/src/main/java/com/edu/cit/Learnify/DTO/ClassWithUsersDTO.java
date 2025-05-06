package com.edu.cit.Learnify.DTO;

import com.edu.cit.Learnify.Entity.Quiz;
import java.util.List;

public class ClassWithUsersDTO {
    private String id;
    private String topic;
    private UserDTO teacher;
    private List<UserDTO> classmates;
    private List<Quiz> quizzes;  // Add quizzes field

    public ClassWithUsersDTO(String id, String topic, UserDTO teacher, List<UserDTO> classmates, List<Quiz> quizzes) {
        this.id = id;
        this.topic = topic;
        this.teacher = teacher;
        this.classmates = classmates;
        this.quizzes = quizzes;
    }

    // Getters and Setters
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

    public List<Quiz> getQuizzes() {
        return quizzes;
    }

    public void setQuizzes(List<Quiz> quizzes) {
        this.quizzes = quizzes;
    }
}
