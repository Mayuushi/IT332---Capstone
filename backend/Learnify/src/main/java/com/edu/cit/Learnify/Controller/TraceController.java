package com.edu.cit.Learnify.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.cit.Learnify.DTO.TraceDTO;
import com.edu.cit.Learnify.Entity.TracePath;
import com.edu.cit.Learnify.Service.TraceService;

@RestController
@RequestMapping("/api/trace")
public class TraceController {

    private final TraceService traceService;

    @Autowired
    public TraceController(TraceService traceService) {
        this.traceService = traceService;
    }

    @PostMapping("/start")
    public ResponseEntity<TraceDTO> startTrace(@RequestBody Map<String, String> body) {
        String studentId = body.getOrDefault("studentId", "");
        int stage = Integer.parseInt(body.getOrDefault("stage", "1"));
        return ResponseEntity.ok(traceService.startStageTrace(studentId, stage));
    }

    @PostMapping("/{sessionId}/coordinates")
    public ResponseEntity<TraceDTO> sendCoordinates(@PathVariable String sessionId, @RequestBody TracePath pathPayload) {
        return ResponseEntity.ok(traceService.sendCoordinates(sessionId, pathPayload));
    }

    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<TraceDTO> completeTrace(@PathVariable String sessionId) {
        return ResponseEntity.ok(traceService.completeTrace(sessionId));
    }

    @GetMapping("/history/{studentId}")
    public ResponseEntity<List<TraceDTO>> getTraceHistory(@PathVariable String studentId) {
        return ResponseEntity.ok(traceService.getTraceHistory(studentId));
    }
}
