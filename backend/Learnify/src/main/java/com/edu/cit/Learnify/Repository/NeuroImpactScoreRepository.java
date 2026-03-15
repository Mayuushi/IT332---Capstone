package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.NeuroImpactScore;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface NeuroImpactScoreRepository extends MongoRepository<NeuroImpactScore, String> {
    Optional<NeuroImpactScore> findByStudentId(String studentId);
}
