package com.edu.cit.Learnify.DTO;

import com.edu.cit.Learnify.Entity.Class;
import com.edu.cit.Learnify.Entity.Student;

import java.util.List;

public class ClassWithStudentsDTO {
    private String id;
    private String topic;
    private String teacherId;
    private List<Student> students;

    public ClassWithStudentsDTO() {}

    public ClassWithStudentsDTO(Class clazz, List<Student> students) {
        this.id = clazz.getId();
        this.topic = clazz.getTopic();
        this.teacherId = clazz.getTeacherId();
        this.students = students;
    }

    // Getters and setters
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

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }
}
