package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.Entity.DialogNode;
import com.edu.cit.Learnify.Entity.GameProgress;
import com.edu.cit.Learnify.Repository.DialogNodeRepository;
import com.edu.cit.Learnify.Repository.GameProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VisualNovelService {
    private final DialogNodeRepository dialogNodeRepository;
    private final GameProgressRepository gameProgressRepository;

    public DialogNode getStartNode() {
        // This could be enhanced to always return a specific start node
        return dialogNodeRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No dialog nodes found"));
    }

    public DialogNode getNodeById(String nodeId) {
        return dialogNodeRepository.findById(nodeId)
                .orElseThrow(() -> new RuntimeException("Node not found with id: " + nodeId));
    }

    public GameProgress saveProgress(String userId, String nodeId) {
        Optional<GameProgress> existingProgress = gameProgressRepository.findByUserId(userId);

        GameProgress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            progress.setCurrentNodeId(nodeId);
            progress.setCompletedNodes(progress.getCompletedNodes() + 1);
        } else {
            progress = new GameProgress();
            progress.setUserId(userId);
            progress.setCurrentNodeId(nodeId);
            progress.setCompletedNodes(1);
        }

        return gameProgressRepository.save(progress);
    }

    public GameProgress getProgress(String userId) {
        return gameProgressRepository.findByUserId(userId)
                .orElse(null);
    }
}