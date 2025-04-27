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

    // Endpoint to create a new quiz
    @PostMapping
    public Quiz createQuiz(@RequestBody Map<String, Object> payload) {
        int teacherId = 123; // Assume auth in real app
        String title = (String) payload.get("title");

        // Retrieve and map the questions
        List<Map<String, String>> questionsRaw = (List<Map<String, String>>) payload.get("questions");
        List<Question> questions = questionsRaw.stream()
                .map(q -> new Question(
                        null,  // Will be set later after quiz creation
                        q.get("questionText"),
                        q.get("type"),
                        q.get("correctAnswer")))
                .toList();

        Quiz createdQuiz = quizService.createQuiz(teacherId, title, questions);

        // After quiz creation, set the actual quizId for each question
        for (Question question : questions) {
            question.setQuizId(createdQuiz.getId());
        }

        return createdQuiz;
    }

    // Endpoint to get a quiz by its ID
    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable String id) {
        return quizService.getQuizById(id);  // Retrieve quiz by ID from the service layer
    }

    // Endpoint to get all questions for a specific quiz
    @GetMapping("/{quizId}/questions")
    public List<Question> getQuestionsByQuizId(@PathVariable String quizId) {
        return quizService.getQuestionsByQuizId(quizId);  // Retrieve questions by quizId
    }

    // Endpoint to get all questions from all quizzes
    @GetMapping("/questions")
    public List<Question> getAllQuestionsFromAllQuizzes() {
        return quizService.getAllQuestionsFromAllQuizzes();  // Retrieve all questions across quizzes
    }
}
