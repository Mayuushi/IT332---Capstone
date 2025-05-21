package com.edu.cit.Learnify.DTO;

import java.util.List;
import com.edu.cit.Learnify.Entity.Student;

public class StudentProfileDTO {
    private Student student;
    private List<BadgeDTO> badges;
    private List<QuizPerformanceDTO> quizPerformances;
    private List<NoteDTO> notes; // ✅ Updated from StudentNote to NoteDTO

    public StudentProfileDTO() {}

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public List<BadgeDTO> getBadges() {
        return badges;
    }

    public void setBadges(List<BadgeDTO> badges) {
        this.badges = badges;
    }

    public List<QuizPerformanceDTO> getQuizPerformances() {
        return quizPerformances;
    }

    public void setQuizPerformances(List<QuizPerformanceDTO> quizPerformances) {
        this.quizPerformances = quizPerformances;
    }

    public List<NoteDTO> getNotes() { // ✅ Getter for updated NoteDTO list
        return notes;
    }

    public void setNotes(List<NoteDTO> notes) { // ✅ Setter for updated NoteDTO list
        this.notes = notes;
    }
}
