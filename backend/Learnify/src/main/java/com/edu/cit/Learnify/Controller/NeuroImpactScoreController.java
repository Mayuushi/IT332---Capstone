package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.Entity.NeuroImpactScore;
import com.edu.cit.Learnify.Service.NeuroImpactScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/neuro-impact")
public class NeuroImpactScoreController {

    @Autowired
    private NeuroImpactScoreService service;

    /**
     * GET /api/neuro-impact/highscore/{studentId}
     * Returns the high score record for the given student, or 204 if none exists.
     */
    @GetMapping("/highscore/{studentId}")
    public ResponseEntity<NeuroImpactScore> getHighScore(@PathVariable String studentId) {
        NeuroImpactScore score = service.getHighScore(studentId);
        if (score == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(score);
    }

    /**
     * POST /api/neuro-impact/highscore
     * Body: { "studentId": "...", "score": 12345 }
     * Only persists the score if it is higher than the current high score.
     * Returns the current high score record.
     */
    @PostMapping("/highscore")
    public ResponseEntity<NeuroImpactScore> submitScore(@RequestBody Map<String, Object> body) {
        String studentId = (String) body.get("studentId");
        int score = (int) body.get("score");

        if (studentId == null || studentId.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        NeuroImpactScore result = service.submitScore(studentId, score);
        return ResponseEntity.ok(result);
    }
}
