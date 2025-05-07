package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.Entity.DialogNode;
import com.edu.cit.Learnify.Entity.GameProgress;
import com.edu.cit.Learnify.Service.VisualNovelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vn")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VisualNovelController {
    private final VisualNovelService visualNovelService;

    @GetMapping("/start")
    public ResponseEntity<DialogNode> getStartNode() {
        DialogNode startNode = visualNovelService.getStartNode();
        if (startNode == null) {
            return ResponseEntity.status(500).body(null); // or 404
        }
        return ResponseEntity.ok(startNode);
    }


    @GetMapping("/node/{nodeId}")
    public ResponseEntity<DialogNode> getNode(@PathVariable String nodeId) {
        return ResponseEntity.ok(visualNovelService.getNodeById(nodeId));
    }

    @PostMapping("/progress")
    public ResponseEntity<GameProgress> saveProgress(@RequestParam String userId, @RequestParam String nodeId) {
        return ResponseEntity.ok(visualNovelService.saveProgress(userId, nodeId));
    }

    @GetMapping("/progress")
    public ResponseEntity<GameProgress> getProgress(@RequestParam String userId) {
        GameProgress progress = visualNovelService.getProgress(userId);
        return progress != null
                ? ResponseEntity.ok(progress)
                : ResponseEntity.notFound().build();
    }
}
