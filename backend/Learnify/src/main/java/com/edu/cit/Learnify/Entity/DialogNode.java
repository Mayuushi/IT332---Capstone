package com.edu.cit.Learnify.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "dialog_nodes")
public class DialogNode {
    @Id
    private String id;
    private String text;
    private String character;
    private String background;
    private String characterImage;
    private List<DialogChoice> choices;
    private boolean isEndNode;

    @Data
    public static class DialogChoice {
        private String text;
        private String nextNodeId;
    }
}
