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
        int teacherId = 123; // Assume from auth
        String title = (String) payload.get("title");
        String classId = (String) payload.get("classId"); // ✅ Extract classId

        List<Map<String, Object>> questionsRaw = (List<Map<String, Object>>) payload.get("questions");

        List<Question> questions = questionsRaw.stream().map(q -> {
            String questionText = (String) q.get("questionText");
            String type = (String) q.get("type");
            String correctAnswer = (String) q.get("correctAnswer");
            List<String> options = (List<String>) q.get("options");

            return new Question(null, questionText, type, correctAnswer, options);
        }).toList();

        return quizService.createQuiz(teacherId, title, questions, classId); // ✅ Use updated method
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

    @GetMapping("/class/{classId}")
    public List<Quiz> getQuizzesByClass(@PathVariable String classId) {
        System.out.println("Class ID"+classId);
        return quizService.getQuizzesByClassId(classId);
    }

}
