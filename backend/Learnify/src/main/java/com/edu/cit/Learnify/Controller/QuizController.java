package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.Entity.Quiz;
import com.edu.cit.Learnify.Entity.Student;
import com.edu.cit.Learnify.Repository.StudentRepository;
import com.edu.cit.Learnify.Entity.Question;
import com.edu.cit.Learnify.Service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private StudentRepository studentRepository;

    // ✅ Create a new quiz with dynamic teacherId (String)
    @PostMapping
    public Quiz createQuiz(@RequestBody Map<String, Object> payload) {
        String teacherId = (String) payload.get("teacherId");
        String title = (String) payload.get("title");
        String classId = (String) payload.get("classId");

        // Debug: Print the entire payload to see what's being received
        System.out.println("Received payload: " + payload);

        List<Map<String, Object>> questionsRaw = (List<Map<String, Object>>) payload.get("questions");

        // Debug: Print the raw questions data
        System.out.println("Raw questions data: " + questionsRaw);

        List<Question> questions = new ArrayList<>();
        if (questionsRaw != null) {
            questions = questionsRaw.stream().map(q -> {
                String questionText = (String) q.get("questionText");
                String type = (String) q.get("type");
                String correctAnswer = (String) q.get("correctAnswer");

                // Handle options - ensure it's properly cast
                List<String> options = new ArrayList<>();
                if (q.containsKey("options")) {
                    try {
                        options = (List<String>) q.get("options");
                    } catch (ClassCastException e) {
                        // Handle different format for options if needed
                        Object optionsObj = q.get("options");
                        if (optionsObj instanceof String[]) {
                            options = Arrays.asList((String[]) optionsObj);
                        }
                    }
                }

                // Debug each question
                System.out.println("Processing question: " + questionText);
                System.out.println("Options: " + options);

                int points = (int) q.getOrDefault("points", 1); // default to 1 point if not provided
                return new Question(questionText, type, correctAnswer, options, points);
            }).toList();
        }

        return quizService.createQuiz(teacherId, title, classId, questions);
    }

    // ✅ Get a specific quiz by ID
    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable String id) {
        return quizService.getQuizById(id);
    }

    // ✅ Get all questions from all quizzes
//    @GetMapping("/questions")
//    public List<Question> getAllQuestions() {
//        return quizService.getAllQuestions();
//    }

    // ✅ Get all quizzes for a specific teacher
    @GetMapping("/teacher/{teacherId}")
    public List<Quiz> getQuizzesByTeacher(@PathVariable String teacherId) {
        return quizService.getQuizzesByTeacher(teacherId);
    }

    // ✅ Get all quizzes for a specific class
    @GetMapping("/class/{classId}")
    public List<Quiz> getQuizzesByClass(@PathVariable String classId) {
        System.out.println("Class ID: " + classId);
        return quizService.getQuizzesByClassId(classId);
    }

    // ✅ Update an existing quiz
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

                // Handle options - ensure it's not null
                List<String> options = q.containsKey("options") ?
                        (List<String>) q.get("options") : Collections.emptyList();

                int points = (int) q.getOrDefault("points", 1); // default to 1 point if not provided
        return new Question(questionText, type, correctAnswer, options, points);

            }).toList();
        }

        return quizService.updateQuiz(id, teacherId, title, questions, classId);
    }

    // ✅ Delete an existing quiz
    @DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable String id) {
        quizService.deleteQuiz(id);
    }
    @PostMapping("/{quizId}/submit")
public ResponseEntity<Map<String, Object>> submitQuiz(
        @PathVariable String quizId,
        @RequestBody Map<String, Object> payload
) {
    String studentId = (String) payload.get("studentId");
    Map<String, String> answers = (Map<String, String>) payload.get("answers"); // questionText -> studentAnswer

    Quiz quiz = quizService.getQuizById(quizId);
    int totalScore = 0;
    int totalPossible = 0;

    for (Question q : quiz.getQuestions()) {
        totalPossible += q.getPoints();
        String studentAnswer = answers.getOrDefault(q.getQuestionText(), "").trim();
        if (q.getCorrectAnswer().trim().equalsIgnoreCase(studentAnswer)) {
            totalScore += q.getPoints();
        }
    }

    // Update student points
    Optional<Student> studentOpt = studentRepository.findById(studentId);
    if (studentOpt.isPresent()) {
        Student student = studentOpt.get();
        student.setTotalPoints(student.getTotalPoints() + totalScore);
        studentRepository.save(student);
    }

    // Response
    Map<String, Object> result = new HashMap<>();
    result.put("score", totalScore);
    result.put("totalPossible", totalPossible);
    result.put("percentage", totalPossible == 0 ? 0 : (totalScore * 100 / totalPossible));

    return ResponseEntity.ok(result);
}

    
}
