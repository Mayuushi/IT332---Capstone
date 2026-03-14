package com.edu.cit.Learnify.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.edu.cit.Learnify.Entity.GameSession;

@Repository
public interface GameSessionRepository extends MongoRepository<GameSession, String> {
    List<GameSession> findByPlayerNameOrderByCreatedAtDesc(String playerName);
    List<GameSession> findByStatusOrderByScoreDesc(String status);
}
