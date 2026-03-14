package com.edu.cit.Learnify.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.cit.Learnify.Entity.GameSession;
import com.edu.cit.Learnify.Service.GameService;


@RestController
@RequestMapping("/api/game")
public class GameController {

    // ── Replace @Slf4j with explicit logger ──────────────────────────────────
    private static final Logger log = LoggerFactory.getLogger(GameController.class);

    private final GameService gameService;

    // ── Replace @RequiredArgsConstructor with explicit @Autowired ────────────
    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startGame(@RequestBody Map<String, String> body) {
        String playerName = body.getOrDefault("playerName", "Hero");
        log.info("Starting game for player: {}", playerName);
        GameSession session = gameService.startGame(playerName);
        return ResponseEntity.ok(sessionToMap(session));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getGame(@PathVariable String id) {
        GameSession session = gameService.getSession(id);
        return ResponseEntity.ok(sessionToMap(session));
    }

    @PostMapping("/{id}/question")
    public ResponseEntity<Map<String, Object>> getQuestion(@PathVariable String id) {
        log.info("Getting question for session: {}", id);
        GameSession session = gameService.getQuestion(id);

        Map<String, Object> response = new HashMap<>();
        response.put("sessionId",   session.getId());
        response.put("question",    session.getPendingQuestion());
        response.put("options",     session.getPendingOptions());
        response.put("playerHp",    session.getPlayerHp());
        response.put("playerMaxHp", session.getPlayerMaxHp());
        response.put("enemyHp",     session.getEnemyHp());
        response.put("enemyMaxHp",  session.getEnemyMaxHp());
        response.put("enemyName",   session.getEnemyName());
        response.put("score",       session.getScore());
        response.put("streak",      session.getStreak());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/answer")
    public ResponseEntity<Map<String, Object>> submitAnswer(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {

        String selected = body.getOrDefault("selectedOption", "");
        log.info("Answer submitted for session {}: {}", id, selected);

        GameService.AnswerResult result = gameService.submitAnswer(id, selected);

        Map<String, Object> response = new HashMap<>();
        response.put("correct",       result.correct);
        response.put("correctAnswer", result.correctAnswer);
        response.put("explanation",   result.explanation);
        response.put("funFact",       result.funFact);
        response.put("feedback",      result.feedback);
        response.put("damageDealt",   result.damageDealt);
        response.put("damageTaken",   result.damageTaken);
        response.put("playerHp",      result.playerHp);
        response.put("enemyHp",       result.enemyHp);
        response.put("score",         result.score);
        response.put("streak",        result.streak);
        response.put("status",        result.status);
        response.put("enemyAction",   result.enemyAction);
        response.put("battleLog",     result.battleLog);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<GameSession>> getLeaderboard() {
        return ResponseEntity.ok(gameService.getLeaderboard());
    }

    private Map<String, Object> sessionToMap(GameSession s) {
        Map<String, Object> map = new HashMap<>();
        map.put("id",                s.getId());
        map.put("playerName",        s.getPlayerName());
        map.put("playerHp",          s.getPlayerHp());
        map.put("playerMaxHp",       s.getPlayerMaxHp());
        map.put("enemyName",         s.getEnemyName());
        map.put("enemyType",         s.getEnemyType());
        map.put("enemyHp",           s.getEnemyHp());
        map.put("enemyMaxHp",        s.getEnemyMaxHp());
        map.put("enemyLevel",        s.getEnemyLevel());
        map.put("currentTurn",       s.getCurrentTurn());
        map.put("status",            s.getStatus());
        map.put("score",             s.getScore());
        map.put("questionsAnswered", s.getQuestionsAnswered());
        map.put("correctAnswers",    s.getCorrectAnswers());
        map.put("streak",            s.getStreak());
        map.put("battleLog",         s.getBattleLog());
        return map;
    }
}