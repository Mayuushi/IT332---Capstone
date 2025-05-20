package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.QuizSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizSubmissionRepository extends MongoRepository<QuizSubmission, String> {

    Optional<QuizSubmission> findByQuizIdAndStudentId(String quizId, String studentId);

    boolean existsByQuizIdAndStudentId(String quizId, String studentId);

    List<QuizSubmission> findByQuizId(String quizId);
}
