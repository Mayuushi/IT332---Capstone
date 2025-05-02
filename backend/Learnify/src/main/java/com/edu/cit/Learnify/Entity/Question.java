package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "questions")
public class Question {

    @Id
    private String id; // MongoDB ID

    private String quizId;
    private String questionText;
    private String type;
    private String correctAnswer;
    private List<String> options; // List of options for multiple choice questions

    // Default constructor
    public Question() {}

    // Constructor with all fields
    public Question(String quizId, String questionText, String type, String correctAnswer, List<String> options) {
        this.quizId = quizId;
        this.questionText = questionText;
        this.type = type;
        this.correctAnswer = correctAnswer;
        this.options = options;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuizId() {
        return quizId;
    }

    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }
}
