package com.edu.cit.Learnify.Entity;

import java.util.List;

public class Question {
    private String questionText;
    private String type; // "multiple-choice" or "short-answer"
    private String correctAnswer;
    private List<String> options; // Only used for multiple-choice

    // Constructors
    public Question() {}

    public Question(String questionText, String type, String correctAnswer, List<String> options) {
        this.questionText = questionText;
        this.type = type;
        this.correctAnswer = correctAnswer;
        this.options = options;
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
}