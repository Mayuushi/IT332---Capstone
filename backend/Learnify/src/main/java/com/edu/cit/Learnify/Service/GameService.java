package com.edu.cit.Learnify.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.cit.Learnify.Entity.GameSession;
import com.edu.cit.Learnify.Repository.GameSessionRepository;

@Service
public class GameService {

    // ── Replace @Slf4j with explicit logger ──────────────────────────────────
    private static final Logger log = LoggerFactory.getLogger(GameService.class);

    private final GameSessionRepository repository;
    private final GeminiService geminiService;

    // ── Replace @RequiredArgsConstructor with explicit @Autowired ────────────
    @Autowired
    public GameService(GameSessionRepository repository, GeminiService geminiService) {
        this.repository   = repository;
        this.geminiService = geminiService;
    }

    private static final List<Map<String, Object>> ENEMIES = List.of(
        Map.of("type", "synapse_slime",  "name", "Synapse Slime",  "level", 1, "hp", 60,  "attack", 12),
        Map.of("type", "reflex_rex",     "name", "Reflex Rex",     "level", 2, "hp", 80,  "attack", 18),
        Map.of("type", "sense_specter",  "name", "Sense Specter",  "level", 2, "hp", 75,  "attack", 15),
        Map.of("type", "nerve_ninja",    "name", "Nerve Ninja",    "level", 3, "hp", 90,  "attack", 20),
        Map.of("type", "brain_boss",     "name", "Brain Boss",     "level", 4, "hp", 120, "attack", 25)
    );

    private static final int PLAYER_MAX_HP   = 100;
    private static final int PLAYER_BASE_ATK = 30;
    private static final int CORRECT_BONUS   = 10;
    private static final int STREAK_BONUS    = 5;

    public GameSession startGame(String playerName) {
        Map<String, Object> enemy = pickEnemy();

        GameSession session = GameSession.builder()
            .playerName(playerName)
            .playerHp(PLAYER_MAX_HP)
            .playerMaxHp(PLAYER_MAX_HP)
            .playerAttack(PLAYER_BASE_ATK)
            .enemyType((String) enemy.get("type"))
            .enemyName((String) enemy.get("name"))
            .enemyHp((int) enemy.get("hp"))
            .enemyMaxHp((int) enemy.get("hp"))
            .enemyAttack((int) enemy.get("attack"))
            .enemyLevel((int) enemy.get("level"))
            .currentTurn("player")
            .status("active")
            .score(0)
            .questionsAnswered(0)
            .correctAnswers(0)
            .streak(0)
            .battleLog(new ArrayList<>())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        session.getBattleLog().add(
            "⚔️ A wild " + session.getEnemyName() + " appears! Get ready to fight with your brain!"
        );

        return repository.save(session);
    }

    public GameSession getQuestion(String sessionId) {
        GameSession session = getActiveSession(sessionId);

        if (!"player".equals(session.getCurrentTurn())) {
            throw new IllegalStateException("It's not the player's turn!");
        }

        GeminiService.GeminiQuestion q = geminiService.generateQuestion(session.getEnemyType());

        session.setPendingQuestion(q.getQuestion());
        session.setPendingOptions(q.getOptions());
        session.setPendingCorrectAnswer(q.getCorrect());
        session.setPendingExplanation(q.getExplanation());
        session.setPendingFunFact(q.getFunFact());
        session.setUpdatedAt(LocalDateTime.now());

        return repository.save(session);
    }

    public AnswerResult submitAnswer(String sessionId, String selectedOption) {
        GameSession session = getActiveSession(sessionId);

        if (session.getPendingQuestion() == null) {
            throw new IllegalStateException("No pending question found. Request a question first.");
        }

        boolean correct = isAnswerCorrect(selectedOption, session.getPendingCorrectAnswer());
        session.setQuestionsAnswered(session.getQuestionsAnswered() + 1);

        AnswerResult result = new AnswerResult();
        result.correct       = correct;
        result.correctAnswer = session.getPendingCorrectAnswer();
        result.explanation   = session.getPendingExplanation();
        result.funFact       = session.getPendingFunFact();

        if (correct) {
            session.setCorrectAnswers(session.getCorrectAnswers() + 1);
            session.setStreak(session.getStreak() + 1);

            int streakMultiplier = Math.min(session.getStreak(), 5);
            int damage           = PLAYER_BASE_ATK + (streakMultiplier * 5);
            int scoreGained      = CORRECT_BONUS + (session.getStreak() * STREAK_BONUS);

            int newEnemyHp = Math.max(0, session.getEnemyHp() - damage);
            session.setEnemyHp(newEnemyHp);
            session.setScore(session.getScore() + scoreGained);

            result.damageDealt = damage;
            result.damageTaken = 0;

            String streakMsg = session.getStreak() > 1 ? " 🔥 " + session.getStreak() + "x STREAK!" : "";
            session.getBattleLog().add(
                "✅ Correct! " + session.getPlayerName() + " deals " + damage + " damage!" + streakMsg
            );

            if (newEnemyHp <= 0) {
                session.setStatus("won");
                session.setScore(session.getScore() + 50);
                session.getBattleLog().add(
                    "🏆 " + session.getEnemyName() + " is defeated! " + session.getPlayerName() + " wins! Score: " + session.getScore()
                );
            } else {
                int counterDmg = session.getEnemyAttack() / 2;
                applyEnemyAttack(session, counterDmg, result);
            }

        } else {
            session.setStreak(0);
            int damage = session.getEnemyAttack() + new Random().nextInt(10);
            applyEnemyAttack(session, damage, result);
            session.getBattleLog().add(
                "❌ Wrong! " + session.getEnemyName() + " counter-attacks for " + damage + " damage!"
            );
        }

        try {
            result.feedback = geminiService.generateFeedback(
                correct,
                session.getPendingQuestion(),
                session.getPendingCorrectAnswer(),
                session.getPlayerName()
            );
        } catch (Exception e) {
            result.feedback = correct
                ? "Amazing! Your brain is super powerful! 🧠⚡"
                : "Don't worry, keep learning! You'll get the next one! 💪";
        }

        session.setPendingQuestion(null);
        session.setPendingCorrectAnswer(null);
        session.setPendingExplanation(null);
        session.setPendingFunFact(null);
        session.setPendingOptions(new ArrayList<>());

        if ("active".equals(session.getStatus())) {
            session.setCurrentTurn("player");
        }

        session.setUpdatedAt(LocalDateTime.now());
        repository.save(session);

        result.playerHp  = session.getPlayerHp();
        result.enemyHp   = session.getEnemyHp();
        result.score     = session.getScore();
        result.streak    = session.getStreak();
        result.status    = session.getStatus();
        result.battleLog = session.getBattleLog();

        return result;
    }

    public GameSession getSession(String sessionId) {
        return repository.findById(sessionId)
            .orElseThrow(() -> new NoSuchElementException("Session not found: " + sessionId));
    }

    public List<GameSession> getLeaderboard() {
        return repository.findByStatusOrderByScoreDesc("won");
    }

    private GameSession getActiveSession(String sessionId) {
        GameSession session = getSession(sessionId);
        if (!"active".equals(session.getStatus())) {
            throw new IllegalStateException("This game is already over.");
        }
        return session;
    }

    private boolean isAnswerCorrect(String selected, String correct) {
        if (selected == null || correct == null) return false;
        String selectedClean = selected.trim().toUpperCase();
        String correctClean  = correct.trim().toUpperCase();
        return correctClean.startsWith(selectedClean) || selectedClean.equals(correctClean);
    }

    private void applyEnemyAttack(GameSession session, int damage, AnswerResult result) {
        int newPlayerHp = Math.max(0, session.getPlayerHp() - damage);
        session.setPlayerHp(newPlayerHp);
        result.damageTaken = damage;
        result.enemyAction = session.getEnemyName() + " strikes for " + damage + " damage!";

        if (newPlayerHp <= 0) {
            session.setStatus("lost");
            session.getBattleLog().add(
                "💀 " + session.getPlayerName() + " has fainted... Study harder and try again!"
            );
        }
    }

    private Map<String, Object> pickEnemy() {
        return ENEMIES.get(new Random().nextInt(ENEMIES.size()));
    }

    public static class AnswerResult {
        public boolean      correct;
        public String       correctAnswer;
        public String       explanation;
        public String       funFact;
        public String       feedback;
        public int          damageDealt;
        public int          damageTaken;
        public int          playerHp;
        public int          enemyHp;
        public int          score;
        public int          streak;
        public String       status;
        public String       enemyAction;
        public List<String> battleLog;
    }
}