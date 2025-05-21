package com.edu.cit.Learnify.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.cit.Learnify.DTO.BadgeDTO;
import com.edu.cit.Learnify.DTO.NoteDTO;
import com.edu.cit.Learnify.DTO.QuizPerformanceDTO;
import com.edu.cit.Learnify.DTO.StudentProfileDTO;
import com.edu.cit.Learnify.Entity.Badge;
import com.edu.cit.Learnify.Entity.Quiz;
import com.edu.cit.Learnify.Entity.QuizSubmission;
import com.edu.cit.Learnify.Entity.Student;
import com.edu.cit.Learnify.Entity.StudentBadge;
import com.edu.cit.Learnify.Entity.StudentNote;
import com.edu.cit.Learnify.Repository.BadgeRepository;
import com.edu.cit.Learnify.Repository.QuizRepository;
import com.edu.cit.Learnify.Repository.QuizSubmissionRepository;
import com.edu.cit.Learnify.Repository.StudentBadgeRepository;
import com.edu.cit.Learnify.Repository.StudentNoteRepository;
import com.edu.cit.Learnify.Repository.StudentRepository;
import com.edu.cit.Learnify.Repository.TeacherRepository;

@Service
public class StudentProfileService {

    @Autowired private StudentRepository studentRepo;
    @Autowired private StudentBadgeRepository studentBadgeRepo;
    @Autowired private BadgeRepository badgeRepo;
    @Autowired private QuizSubmissionRepository submissionRepo;
    @Autowired private QuizRepository quizRepo;
    @Autowired private StudentNoteRepository noteRepo;
    @Autowired private TeacherRepository teacherRepo;

    public StudentProfileDTO getStudentProfile(String studentId) {
        Student student = studentRepo.findById(studentId).orElseThrow();

        // Fetch badges earned by student
        List<StudentBadge> studentBadges = studentBadgeRepo.findByStudentId(studentId);

        // Convert to BadgeDTO
        List<BadgeDTO> badgeDTOs = studentBadges.stream().map(sb ->
            badgeRepo.findById(sb.getBadgeId())
                .map(badge -> new BadgeDTO(
                    badge.getId(),
                    badge.getName(),
                    badge.getDescription(),
                    badge.getImageUrl(),
                    sb.getEarnedAt(),
                    false
                ))
                .orElse(new BadgeDTO(sb.getBadgeId(), "Unknown Badge", "", "", sb.getEarnedAt(), false))
        ).collect(Collectors.toList());

        // Quiz performance
        List<QuizSubmission> submissions = submissionRepo.findByStudentId(studentId);
        List<QuizPerformanceDTO> quizPerformances = submissions.stream().map(sub -> {
            Quiz quiz = quizRepo.findById(sub.getQuizId()).orElse(null);
            return new QuizPerformanceDTO(
                quiz != null ? quiz.getTitle() : "Unknown Quiz",
                sub.getScore(),
                sub.getTotalPossible(),
                sub.getSubmittedAt()
            );
        }).collect(Collectors.toList());

        // Notes with teacher names
        List<StudentNote> studentNotes = noteRepo.findByStudentId(studentId);
        List<NoteDTO> noteDTOs = studentNotes.stream().map(note -> {
            String teacherName = teacherRepo.findById(note.getTeacherId())
                .map(t -> t.getName())
                .orElse("Unknown Teacher");

            return new NoteDTO(
                note.getNote(),
                teacherName,
                note.getCreatedAt()
            );
        }).collect(Collectors.toList());

        // Build profile
        StudentProfileDTO profile = new StudentProfileDTO();
        profile.setStudent(student);
        profile.setBadges(badgeDTOs);
        profile.setQuizPerformances(quizPerformances);
        profile.setNotes(noteDTOs);

        return profile;
    }

    public void addNoteToStudent(String studentId, String teacherId, String noteContent) {
        if (!studentRepo.existsById(studentId)) {
            throw new RuntimeException("Student not found");
        }
        StudentNote note = new StudentNote(studentId, teacherId, noteContent);
        note.setCreatedAt(LocalDateTime.now());
        noteRepo.save(note);
    }
}
