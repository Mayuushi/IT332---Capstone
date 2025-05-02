package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.Entity.Quiz;
import com.edu.cit.Learnify.Entity.Question;
import com.edu.cit.Learnify.Service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000") // Accepting frontend origins
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    // Create a new quiz
    @PostMapping
    public Quiz createQuiz(@RequestBody Map<String, Object> payload) {
        int teacherId = 123; // Assume auth in real app
        String title = (String) payload.get("title");

        // Extract the questions from the payload
        List<Map<String, Object>> questionsRaw = (List<Map<String, Object>>) payload.get("questions");

        // Map each question and handle options correctly
        List<Question> questions = questionsRaw.stream().map(q -> {
            String questionText = (String) q.get("questionText");
            String type = (String) q.get("type");
            String correctAnswer = (String) q.get("correctAnswer");

            // Ensure options are extracted as a List<String>
            List<String> options = (List<String>) q.get("options"); // Correctly cast options to List<String>

            return new Question(null, questionText, type, correctAnswer, options); // Using the new constructor
        }).toList();

        // Create the quiz and return the result
        return quizService.createQuiz(teacherId, title, questions);
    }

    // Get a specific quiz by ID
    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable String id) {
        return quizService.getQuizById(id);
    }

    // Endpoint to retrieve all questions from all quizzes
    @GetMapping("/questions")
    public List<Question> getAllQuestions() {
        return quizService.getAllQuestions();
    }
    // Get all quizzes for a specific teacher
    @GetMapping("/teacher/{teacherId}")
    public List<Quiz> getQuizzesByTeacher(@PathVariable Integer teacherId) {
        return quizService.getQuizzesByTeacher(teacherId);
    }
}
