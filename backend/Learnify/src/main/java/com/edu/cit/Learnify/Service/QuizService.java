package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.Entity.Quiz;
import com.edu.cit.Learnify.Entity.Question;
import com.edu.cit.Learnify.Repository.QuizRepository;
import com.edu.cit.Learnify.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    // Create a quiz along with its questions
    @Transactional
    public Quiz createQuiz(int teacherId, String title, List<Question> questions) {
        Quiz quiz = new Quiz();
        quiz.setTeacherId(teacherId);
        quiz.setTitle(title);
        quiz.setCreatedAt(LocalDateTime.now());
        Quiz savedQuiz = quizRepository.save(quiz);

        // Assign quizId to questions and save them
        for (Question q : questions) {
            q.setQuizId(savedQuiz.getId());
            questionRepository.save(q);
        }

        return savedQuiz;
    }

    // Retrieve a quiz by ID and its questions, including options if available
    public Quiz getQuizById(String id) {
        // Find the quiz by ID
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Retrieve questions associated with the quiz
        List<Question> questions = questionRepository.findByQuizId(id);
        quiz.setQuestions(questions); // Set the questions to the quiz object

        return quiz; // Return quiz with questions
    }

    // Method to get all questions from all quizzes
    public List<Question> getAllQuestions() {
        return questionRepository.findAll(); // Retrieve all questions
    }

    // Retrieve all quizzes by teacher ID
    public List<Quiz> getQuizzesByTeacher(Integer teacherId) {
        return quizRepository.findByTeacherId(teacherId);
    }
}
