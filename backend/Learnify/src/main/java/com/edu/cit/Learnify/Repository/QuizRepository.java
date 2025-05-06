package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByTeacherId(Integer teacherId);
    Optional<Quiz> findById(String id);
    List<Quiz> findByClassId(String classId);

}
