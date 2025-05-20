package com.edu.cit.Learnify.DTO;

public class ClassAverageScoreDTO {
    private String classId;
    private String classTopic;
    private double averageScore;

    public ClassAverageScoreDTO() {}

    public ClassAverageScoreDTO(String classId, String classTopic, double averageScore) {
        this.classId = classId;
        this.classTopic = classTopic;
        this.averageScore = averageScore;
    }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getClassTopic() { return classTopic; }
    public void setClassTopic(String classTopic) { this.classTopic = classTopic; }

    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
}
