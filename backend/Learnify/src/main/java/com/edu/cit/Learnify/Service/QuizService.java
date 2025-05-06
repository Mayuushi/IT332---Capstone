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
    public Quiz createQuiz(int teacherId, String title, List<Question> questions, String classId) {
        Quiz quiz = new Quiz();
        quiz.setTeacherId(teacherId);
        quiz.setTitle(title);
        quiz.setCreatedAt(LocalDateTime.now());
        quiz.setClassId(classId); // Set classId

        // Save the quiz first to generate its ID
        Quiz savedQuiz = quizRepository.save(quiz);

        // Now save the questions, associating them with the quiz
        for (Question q : questions) {
            q.setQuizId(savedQuiz.getId());  // Ensure the quizId is set for each question
            questionRepository.save(q);  // Save each question
        }

        return savedQuiz;  // Return the quiz with its id and no questions yet
    }



    // Retrieve a quiz by ID and its questions, including options if available
    public Quiz getQuizById(String id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Fetch associated questions using the quizId
        List<Question> questions = questionRepository.findByQuizId(id);
        quiz.setQuestions(questions);  // Set the questions on the quiz object

        return quiz;
    }


    // Method to get all questions from all quizzes
    public List<Question> getAllQuestions() {
        return questionRepository.findAll(); // Retrieve all questions
    }

    // Retrieve all quizzes by teacher ID
    public List<Quiz> getQuizzesByTeacher(Integer teacherId) {
        return quizRepository.findByTeacherId(teacherId);
    }

    public List<Quiz> getQuizzesByClassId(String classId) {
        List<Quiz> quizzes = quizRepository.findByClassId(classId);

        // Attach questions to each quiz manually
        for (Quiz quiz : quizzes) {
            List<Question> questions = questionRepository.findByQuizId(quiz.getId());
            quiz.setQuestions(questions);
        }

        return quizzes;
    }


}
