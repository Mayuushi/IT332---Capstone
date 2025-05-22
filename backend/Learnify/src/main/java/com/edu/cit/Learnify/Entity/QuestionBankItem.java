package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "question_bank")
public class QuestionBankItem {

    @Id
    private String id;
    private String teacherId;
    private String subject; // Optional field to categorize questions
    private Question question;

    // Constructors
    public QuestionBankItem() {}

    public QuestionBankItem(String teacherId, String subject, Question question) {
        this.teacherId = teacherId;
        this.subject = subject;
        this.question = question;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }
}
