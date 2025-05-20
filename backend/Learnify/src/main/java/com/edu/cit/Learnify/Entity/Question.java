package com.edu.cit.Learnify.Entity;

import java.util.List;

public class Question {
    private String questionText;
    private String type; // "multiple-choice" or "short-answer"
    private String correctAnswer;
    private List<String> options; // Only used for multiple-choice
    private int points; // ✅ New field

    // Constructors
    public Question() {}

    // ✅ Updated constructor to include points
    public Question(String questionText, String type, String correctAnswer, List<String> options, int points) {
        this.questionText = questionText;
        this.type = type;
        this.correctAnswer = correctAnswer;
        this.options = options;
        this.points = points;
    }

    // Getters and Setters
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }
}
