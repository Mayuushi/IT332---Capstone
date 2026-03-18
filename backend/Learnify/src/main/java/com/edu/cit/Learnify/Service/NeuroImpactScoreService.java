package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.Entity.NeuroImpactScore;
import com.edu.cit.Learnify.Repository.NeuroImpactScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class NeuroImpactScoreService {

    @Autowired
    private NeuroImpactScoreRepository repository;

    /**
     * Submit a score for a student. Only saves if it is higher than the existing high score.
     * Returns the current (possibly updated) high score.
     */
    public NeuroImpactScore submitScore(String studentId, int score) {
        Optional<NeuroImpactScore> existing = repository.findByStudentId(studentId);

        if (existing.isPresent()) {
            NeuroImpactScore record = existing.get();
            if (score > record.getScore()) {
                record.setScore(score);
                record.setAchievedAt(LocalDateTime.now());
                return repository.save(record);
            }
            return record;
        } else {
            return repository.save(new NeuroImpactScore(studentId, score));
        }
    }

    /**
     * Get the high score for a student. Returns null if none exists.
     */
    public NeuroImpactScore getHighScore(String studentId) {
        return repository.findByStudentId(studentId).orElse(null);
    }
}
