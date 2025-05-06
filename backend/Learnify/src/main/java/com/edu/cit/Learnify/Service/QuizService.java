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

    // Create a quiz with questions
    @Transactional
    public Quiz createQuiz(String teacherId, String title, List<Question> questions, String classId) {
        Quiz quiz = new Quiz();
        quiz.setTeacherId(teacherId);
        quiz.setTitle(title);
        quiz.setCreatedAt(LocalDateTime.now());
        quiz.setClassId(classId);

        Quiz savedQuiz = quizRepository.save(quiz);

        for (Question q : questions) {
            q.setQuizId(savedQuiz.getId());
            questionRepository.save(q);
        }

        return savedQuiz;
    }

    public Quiz getQuizById(String id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        List<Question> questions = questionRepository.findByQuizId(id);
        quiz.setQuestions(questions);

        return quiz;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public List<Quiz> getQuizzesByTeacher(String teacherId) {
        return quizRepository.findByTeacherId(teacherId);
    }

    public List<Quiz> getQuizzesByClassId(String classId) {
        List<Quiz> quizzes = quizRepository.findByClassId(classId);

        for (Quiz quiz : quizzes) {
            List<Question> questions = questionRepository.findByQuizId(quiz.getId());
            quiz.setQuestions(questions);
        }

        return quizzes;
    }
}
