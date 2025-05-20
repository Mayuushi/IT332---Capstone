package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.Entity.Class;
import com.edu.cit.Learnify.Entity.GameProgress;
import com.edu.cit.Learnify.Entity.Points;
import com.edu.cit.Learnify.Entity.Quiz;
import com.edu.cit.Learnify.Entity.QuizSubmission;
import com.edu.cit.Learnify.Repository.ClassRepository;
import com.edu.cit.Learnify.Repository.GameProgressRepository;
import com.edu.cit.Learnify.Repository.PointsRepository;
import com.edu.cit.Learnify.Repository.QuizRepository;
import com.edu.cit.Learnify.Repository.QuizSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TeacherDashboardService {

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private GameProgressRepository gameProgressRepository;

    @Autowired
    private PointsRepository pointsRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    public Map<String, Object> getOverviewData(String classId) {
        Map<String, Object> overview = new HashMap<>();

        Optional<Class> optionalClass = classRepository.findById(classId);
        if (optionalClass.isEmpty()) {
            overview.put("error", "Class not found");
            return overview;
        }

        Class classroom = optionalClass.get();
        List<String> studentIds = classroom.getStudentIds();

        // Lesson Completion
        int totalStudents = studentIds.size();
        long studentsCompletedLessons = studentIds.stream()
                .map(gameProgressRepository::findByUserId)
                .filter(opt -> opt.isPresent() && opt.get().getCompletedNodes() > 0)
                .count();
        double lessonCompletionRate = totalStudents > 0
                ? (studentsCompletedLessons * 100.0 / totalStudents)
                : 0.0;

        // Quizzes and Submissions
        List<Quiz> quizzes = quizRepository.findByClassId(classId);
        List<String> quizIds = quizzes.stream().map(Quiz::getId).toList();
        List<QuizSubmission> submissions = quizSubmissionRepository.findByQuizIdIn(quizIds);

        double avgQuizScore = submissions.stream()
                .mapToDouble(QuizSubmission::getScore)
                .average()
                .orElse(0.0);

        // Engagement Points
        int totalEngagementPoints = 0;
        for (String studentId : studentIds) {
            List<Points> points = pointsRepository.findByStudentId(studentId);
            totalEngagementPoints += points.stream().mapToInt(Points::getPointsEarned).sum();
        }
        double avgEngagementPoints = totalStudents > 0
                ? totalEngagementPoints * 1.0 / totalStudents
                : 0.0;

        // Build Response
        overview.put("totalStudents", totalStudents);
        overview.put("lessonCompletionRate", lessonCompletionRate);
        overview.put("totalQuizzes", quizzes.size());
        overview.put("totalSubmissions", submissions.size());
        overview.put("averageQuizScore", avgQuizScore);
        overview.put("totalEngagementPoints", totalEngagementPoints);
        overview.put("averageEngagementPoints", avgEngagementPoints);

        return overview;
    }
}
