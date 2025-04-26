package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.Badge;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface BadgeRepository extends MongoRepository<Badge, String> {
    List<Badge> findByCategory(String category);

    @Query("{'requiredPoints': {$lte: ?0}}")
    List<Badge> findBadgesEarnableWithPoints(int points);
}
