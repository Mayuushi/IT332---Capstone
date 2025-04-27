package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByTeacherId(Integer teacherId);  // Query to find quizzes by teacher ID
}
