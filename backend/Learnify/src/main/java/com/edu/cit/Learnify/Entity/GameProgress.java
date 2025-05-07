package com.edu.cit.Learnify.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "game_progress")
public class GameProgress {
    @Id
    private String id;
    private String userId;
    private String currentNodeId;
    private int completedNodes;
}
