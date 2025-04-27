package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.Entity.Quiz;
import com.edu.cit.Learnify.Entity.Question;
import com.edu.cit.Learnify.Repository.QuizRepository;
import com.edu.cit.Learnify.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    // Create a new quiz with its questions
    public Quiz createQuiz(int teacherId, String title, List<Question> questions) {
        Quiz quiz = new Quiz();
        quiz.setTeacherId(teacherId);
        quiz.setTitle(title);
        quiz.setCreatedAt(LocalDateTime.now());
        Quiz savedQuiz = quizRepository.save(quiz);

        for (Question q : questions) {
            q.setQuizId(savedQuiz.getId());
            questionRepository.save(q);
        }

        return savedQuiz;
    }

    // Get quiz by its ID
    public Quiz getQuizById(String id) {
        return quizRepository.findById(id).orElse(null);  // Return the quiz by ID
    }

    // Get all questions by quizId
    public List<Question> getQuestionsByQuizId(String quizId) {
        return questionRepository.findByQuizId(quizId);  // Fetch questions based on quizId
    }

    // Get all questions from all quizzes
    public List<Question> getAllQuestionsFromAllQuizzes() {
        return questionRepository.findAll();  // Retrieve all questions across quizzes
    }
}
