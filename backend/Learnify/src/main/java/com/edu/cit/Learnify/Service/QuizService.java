package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.Entity.Quiz;
import com.edu.cit.Learnify.Entity.Question;
import com.edu.cit.Learnify.Repository.QuizRepository;
import com.edu.cit.Learnify.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public QuizService(QuizRepository quizRepository, QuestionRepository questionRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
    }

    // Create a new quiz with questions
    public Quiz createQuiz(String teacherId, String title, String classId, List<Question> questions) {
        // Validate questions
        questions.forEach(q -> {
            if (q.getType().equals("multiple-choice") && (q.getOptions() == null || q.getOptions().size() < 2)) {
                throw new IllegalArgumentException("Multiple-choice questions must have at least 2 options");
            }
            if (q.getCorrectAnswer() == null || q.getCorrectAnswer().trim().isEmpty()) {
                throw new IllegalArgumentException("All questions must have a correct answer");
            }
        });

        // Save questions first
        List<Question> savedQuestions = questionRepository.saveAll(questions);

        // Create the quiz and associate it with the saved questions
        Quiz quiz = new Quiz(teacherId, title, classId, savedQuestions);
        return quizRepository.save(quiz);
    }

    // Get all quizzes for a specific teacher
    public List<Quiz> getQuizzesByTeacher(String teacherId) {
        return quizRepository.findByTeacherId(teacherId);
    }

    // Get all quizzes for a specific class
    public List<Quiz> getQuizzesByClassId(String classId) {
        return quizRepository.findByClassId(classId);
    }

    // Get a specific quiz by ID
    public Quiz getQuizById(String id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    // Delete a quiz by ID
    public void deleteQuiz(String id) {
        quizRepository.deleteById(id);
    }

    // Update an existing quiz (with questions)
    public Quiz updateQuiz(String id, String teacherId, String title, List<Question> questions, String classId) {
        // Validate questions before updating
        questions.forEach(q -> {
            if (q.getType().equals("multiple-choice") && (q.getOptions() == null || q.getOptions().size() < 2)) {
                throw new IllegalArgumentException("Multiple-choice questions must have at least 2 options");
            }
            if (q.getCorrectAnswer() == null || q.getCorrectAnswer().trim().isEmpty()) {
                throw new IllegalArgumentException("All questions must have a correct answer");
            }
        });

        // Save the updated questions
        List<Question> savedQuestions = questionRepository.saveAll(questions);

        // Get the existing quiz by ID
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Update quiz details
        quiz.setTeacherId(teacherId);
        quiz.setTitle(title);
        quiz.setClassId(classId);
        quiz.setQuestions(savedQuestions);

        // Save the updated quiz
        return quizRepository.save(quiz);
    }
}
