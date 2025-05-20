package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.Points;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface PointsRepository extends MongoRepository<Points, String> {
    List<Points> findByStudentId(String studentId);

    @Query("{'studentId': ?0, 'earnedAt': {$gte: ?1, $lte: ?2}}")
    List<Points> findByStudentIdAndEarnedAtBetween(String studentId, LocalDateTime start, LocalDateTime end);

    @Query("{'studentId': ?0, 'activityType': ?1}")
    List<Points> findByStudentIdAndActivityType(String studentId, String activityType);

    @Query("{'studentId': { $in: ?0 }}")
    List<Points> findByStudentIdIn(List<String> studentIds);

}
