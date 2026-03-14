package com.edu.cit.Learnify.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "game_sessions")
public class GameSession {

    @Id
    private String id;

    private String playerName;
    private int playerHp;
    private int playerMaxHp;
    private int playerAttack;

    private String enemyName;
    private String enemyType;
    private int enemyHp;
    private int enemyMaxHp;
    private int enemyAttack;
    private int enemyLevel;

    private String currentTurn;
    private String status;

    private int score;
    private int questionsAnswered;
    private int correctAnswers;
    private int streak;

    private String pendingQuestion;
    private String pendingCorrectAnswer;
    private String pendingExplanation;
    private String pendingFunFact;
    private List<String> pendingOptions = new ArrayList<>();
    private List<String> battleLog = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ── No-arg constructor ───────────────────────────────────────────────────
    public GameSession() {}

    // ── Getters ──────────────────────────────────────────────────────────────
    public String getId()                    { return id; }
    public String getPlayerName()            { return playerName; }
    public int    getPlayerHp()              { return playerHp; }
    public int    getPlayerMaxHp()           { return playerMaxHp; }
    public int    getPlayerAttack()          { return playerAttack; }
    public String getEnemyName()             { return enemyName; }
    public String getEnemyType()             { return enemyType; }
    public int    getEnemyHp()               { return enemyHp; }
    public int    getEnemyMaxHp()            { return enemyMaxHp; }
    public int    getEnemyAttack()           { return enemyAttack; }
    public int    getEnemyLevel()            { return enemyLevel; }
    public String getCurrentTurn()           { return currentTurn; }
    public String getStatus()                { return status; }
    public int    getScore()                 { return score; }
    public int    getQuestionsAnswered()     { return questionsAnswered; }
    public int    getCorrectAnswers()        { return correctAnswers; }
    public int    getStreak()                { return streak; }
    public String getPendingQuestion()       { return pendingQuestion; }
    public String getPendingCorrectAnswer()  { return pendingCorrectAnswer; }
    public String getPendingExplanation()    { return pendingExplanation; }
    public String getPendingFunFact()        { return pendingFunFact; }
    public List<String> getPendingOptions()  { return pendingOptions; }
    public List<String> getBattleLog()       { return battleLog; }
    public LocalDateTime getCreatedAt()      { return createdAt; }
    public LocalDateTime getUpdatedAt()      { return updatedAt; }

    // ── Setters ──────────────────────────────────────────────────────────────
    public void setId(String id)                              { this.id = id; }
    public void setPlayerName(String playerName)              { this.playerName = playerName; }
    public void setPlayerHp(int playerHp)                     { this.playerHp = playerHp; }
    public void setPlayerMaxHp(int playerMaxHp)               { this.playerMaxHp = playerMaxHp; }
    public void setPlayerAttack(int playerAttack)             { this.playerAttack = playerAttack; }
    public void setEnemyName(String enemyName)                { this.enemyName = enemyName; }
    public void setEnemyType(String enemyType)                { this.enemyType = enemyType; }
    public void setEnemyHp(int enemyHp)                       { this.enemyHp = enemyHp; }
    public void setEnemyMaxHp(int enemyMaxHp)                 { this.enemyMaxHp = enemyMaxHp; }
    public void setEnemyAttack(int enemyAttack)               { this.enemyAttack = enemyAttack; }
    public void setEnemyLevel(int enemyLevel)                 { this.enemyLevel = enemyLevel; }
    public void setCurrentTurn(String currentTurn)            { this.currentTurn = currentTurn; }
    public void setStatus(String status)                      { this.status = status; }
    public void setScore(int score)                           { this.score = score; }
    public void setQuestionsAnswered(int questionsAnswered)   { this.questionsAnswered = questionsAnswered; }
    public void setCorrectAnswers(int correctAnswers)         { this.correctAnswers = correctAnswers; }
    public void setStreak(int streak)                         { this.streak = streak; }
    public void setPendingQuestion(String pendingQuestion)    { this.pendingQuestion = pendingQuestion; }
    public void setPendingCorrectAnswer(String v)             { this.pendingCorrectAnswer = v; }
    public void setPendingExplanation(String v)               { this.pendingExplanation = v; }
    public void setPendingFunFact(String v)                   { this.pendingFunFact = v; }
    public void setPendingOptions(List<String> pendingOptions){ this.pendingOptions = pendingOptions; }
    public void setBattleLog(List<String> battleLog)          { this.battleLog = battleLog; }
    public void setCreatedAt(LocalDateTime createdAt)         { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)         { this.updatedAt = updatedAt; }

    // ── Builder ──────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final GameSession s = new GameSession();

        public Builder playerName(String v)        { s.playerName = v;        return this; }
        public Builder playerHp(int v)             { s.playerHp = v;          return this; }
        public Builder playerMaxHp(int v)          { s.playerMaxHp = v;       return this; }
        public Builder playerAttack(int v)         { s.playerAttack = v;      return this; }
        public Builder enemyName(String v)         { s.enemyName = v;         return this; }
        public Builder enemyType(String v)         { s.enemyType = v;         return this; }
        public Builder enemyHp(int v)              { s.enemyHp = v;           return this; }
        public Builder enemyMaxHp(int v)           { s.enemyMaxHp = v;        return this; }
        public Builder enemyAttack(int v)          { s.enemyAttack = v;       return this; }
        public Builder enemyLevel(int v)           { s.enemyLevel = v;        return this; }
        public Builder currentTurn(String v)       { s.currentTurn = v;       return this; }
        public Builder status(String v)            { s.status = v;            return this; }
        public Builder score(int v)                { s.score = v;             return this; }
        public Builder questionsAnswered(int v)    { s.questionsAnswered = v; return this; }
        public Builder correctAnswers(int v)       { s.correctAnswers = v;    return this; }
        public Builder streak(int v)               { s.streak = v;            return this; }
        public Builder battleLog(List<String> v)   { s.battleLog = v;         return this; }
        public Builder createdAt(LocalDateTime v)  { s.createdAt = v;         return this; }
        public Builder updatedAt(LocalDateTime v)  { s.updatedAt = v;         return this; }
        public GameSession build()                 { return s; }
    }
}