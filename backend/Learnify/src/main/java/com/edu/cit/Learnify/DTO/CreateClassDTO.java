package com.edu.cit.Learnify.DTO;

import java.util.List;

public class CreateClassDTO {
    private String topic;
    private String teacherId;
    private List<String> studentIds;

    // Getters and Setters
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }

    public List<String> getStudentIds() { return studentIds; }
    public void setStudentIds(List<String> studentIds) { this.studentIds = studentIds; }
}
