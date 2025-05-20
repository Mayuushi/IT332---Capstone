package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.Entity.Question;
import com.edu.cit.Learnify.Entity.Quiz;
import com.edu.cit.Learnify.Entity.QuizSubmission;
import com.edu.cit.Learnify.Repository.QuizSubmissionRepository;
import com.edu.cit.Learnify.Service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    // Create a new quiz with dynamic teacherId (String)
    @PostMapping
    public Quiz createQuiz(@RequestBody Map<String, Object> payload) {
        String teacherId = (String) payload.get("teacherId");
        String title = (String) payload.get("title");
        String classId = (String) payload.get("classId");

        List<Map<String, Object>> questionsRaw = (List<Map<String, Object>>) payload.get("questions");

        List<Question> questions = new ArrayList<>();
        if (questionsRaw != null) {
            questions = questionsRaw.stream().map(q -> {
                String questionText = (String) q.get("questionText");
                String type = (String) q.get("type");
                String correctAnswer = (String) q.get("correctAnswer");

                List<String> options = new ArrayList<>();
                if (q.containsKey("options")) {
                    try {
                        options = (List<String>) q.get("options");
                    } catch (ClassCastException e) {
                        Object optionsObj = q.get("options");
                        if (optionsObj instanceof String[]) {
                            options = Arrays.asList((String[]) optionsObj);
                        }
                    }
                }

                int points = (int) q.getOrDefault("points", 1); // default 1 point
                return new Question(questionText, type, correctAnswer, options, points);
            }).toList();
        }

        return quizService.createQuiz(teacherId, title, classId, questions);
    }

    // Get a specific quiz by ID
    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable String id) {
        return quizService.getQuizById(id);
    }

    // Get all quizzes for a specific teacher
    @GetMapping("/teacher/{teacherId}")
    public List<Quiz> getQuizzesByTeacher(@PathVariable String teacherId) {
        return quizService.getQuizzesByTeacher(teacherId);
    }

    // Get all quizzes for a specific class
    @GetMapping("/class/{classId}")
    public List<Quiz> getQuizzesByClass(@PathVariable String classId) {
        return quizService.getQuizzesByClassId(classId);
    }

    // Update an existing quiz
    @PutMapping("/{id}")
    public Quiz updateQuiz(@PathVariable String id, @RequestBody Map<String, Object> payload) {
        String teacherId = (String) payload.get("teacherId");
        String title = (String) payload.get("title");
        String classId = (String) payload.get("classId");

        List<Map<String, Object>> questionsRaw = (List<Map<String, Object>>) payload.get("questions");

        List<Question> questions = new ArrayList<>();
        if (questionsRaw != null) {
            questions = questionsRaw.stream().map(q -> {
                String questionText = (String) q.get("questionText");
                String type = (String) q.get("type");
                String correctAnswer = (String) q.get("correctAnswer");

                List<String> options = q.containsKey("options") ?
                        (List<String>) q.get("options") : Collections.emptyList();

                int points = (int) q.getOrDefault("points", 1);
                return new Question(questionText, type, correctAnswer, options, points);
            }).toList();
        }

        return quizService.updateQuiz(id, teacherId, title, questions, classId);
    }

    // Delete an existing quiz
    @DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable String id) {
        quizService.deleteQuiz(id);
    }

    // Submit quiz and calculate score, prevent multiple submissions
    @PostMapping("/{quizId}/submit")
    public ResponseEntity<?> submitQuiz(
            @PathVariable String quizId,
            @RequestBody Map<String, Object> payload
    ) {
        String studentId = (String) payload.get("studentId");
        Map<String, String> answers = (Map<String, String>) payload.get("answers");

        // Check if student already submitted this quiz
        boolean alreadySubmitted = quizSubmissionRepository.existsByQuizIdAndStudentId(quizId, studentId);
        if (alreadySubmitted) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "You have already submitted this quiz.");
            return ResponseEntity.badRequest().body(response);
        }

        Quiz quiz = quizService.getQuizById(quizId);
        if (quiz == null) {
            return ResponseEntity.notFound().build();
        }

        List<Question> questions = quiz.getQuestions();
        int totalScore = 0;
        int totalPossible = 0;

        for (Question q : questions) {
            totalPossible += q.getPoints();
            String studentAnswer = answers.getOrDefault(q.getQuestionText(), "").trim();
            if (q.getCorrectAnswer().trim().equalsIgnoreCase(studentAnswer)) {
                totalScore += q.getPoints();
            }
        }

        // Save the submission
        QuizSubmission submission = new QuizSubmission();
        submission.setQuizId(quizId);
        submission.setStudentId(studentId);
        submission.setAnswers(answers);
        submission.setScore(totalScore);
        submission.setTotalPossible(totalPossible);
        submission.setSubmittedAt(LocalDateTime.now());

        quizSubmissionRepository.save(submission);

        // Return results
        Map<String, Object> result = new HashMap<>();
        result.put("score", totalScore);
        result.put("totalPossible", totalPossible);
        result.put("percentage", totalPossible == 0 ? 0 : (totalScore * 100 / totalPossible));

        return ResponseEntity.ok(result);
    }

    @GetMapping("/class/{classId}/student/{studentId}")
public List<Map<String, Object>> getQuizzesForClassWithStatus(
        @PathVariable String classId,
        @PathVariable String studentId
) {
    List<Quiz> quizzes = quizService.getQuizzesByClassId(classId);
    List<Map<String, Object>> response = new ArrayList<>();

    for (Quiz quiz : quizzes) {
        Map<String, Object> quizMap = new HashMap<>();
        quizMap.put("id", quiz.getId());
        quizMap.put("title", quiz.getTitle());
        quizMap.put("questions", quiz.getQuestions());

        Optional<QuizSubmission> submission = quizSubmissionRepository
                .findByQuizIdAndStudentId(quiz.getId(), studentId);

        if (submission.isPresent()) {
            QuizSubmission s = submission.get();
            quizMap.put("submitted", true);
            quizMap.put("score", s.getScore());
            quizMap.put("totalPossible", s.getTotalPossible());
            quizMap.put("percentage", s.getTotalPossible() == 0 ? 0 : (s.getScore() * 100 / s.getTotalPossible()));
        } else {
            quizMap.put("submitted", false);
        }

        response.add(quizMap);
    }

    return response;
}


}
