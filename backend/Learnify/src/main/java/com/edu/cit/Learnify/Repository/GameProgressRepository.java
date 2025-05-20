package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.GameProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GameProgressRepository extends MongoRepository<GameProgress, String> {
    Optional<GameProgress> findByUserId(String userId);
    
    @Query("{'userId': { $in: ?0 }}")
    List<GameProgress> findByUserIdIn(List<String> userIds);

}
