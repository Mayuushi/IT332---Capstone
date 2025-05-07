package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.GameProgress;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface GameProgressRepository extends MongoRepository<GameProgress, String> {
    Optional<GameProgress> findByUserId(String userId);
}
