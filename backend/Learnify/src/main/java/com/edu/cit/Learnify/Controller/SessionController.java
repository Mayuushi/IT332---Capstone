package com.edu.cit.Learnify.Controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.cit.Learnify.Entity.SessionLog;
import com.edu.cit.Learnify.Entity.Student;
import com.edu.cit.Learnify.Repository.SessionLogRepository;
import com.edu.cit.Learnify.Service.SessionLogService;


import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000") // or your frontend URL
@RestController
@RequestMapping("/api/session")
@RequiredArgsConstructor
public class SessionController {

    @Autowired
    private final SessionLogService sessionLogService;

    @Autowired
    private final SessionLogRepository sessionLogRepository;


    @PostMapping("/start")
    public ResponseEntity<SessionLog> startSession(@RequestBody Map<String, String> body) {
        SessionLog session = sessionLogService.startSession(
            body.get("studentId"),
            body.get("classId"),
            body.get("activityType")
        );

        return ResponseEntity.ok(session);  // return saved session with ID
    }

    @PostMapping("/end/{sessionId}")
public ResponseEntity<Void> endSession(@PathVariable String sessionId) {
    System.out.println("Ending session for id: " + sessionId);
    sessionLogService.endSession(sessionId);
    return ResponseEntity.ok().build();
}
@GetMapping("/session/{sessionId}")
public ResponseEntity<?> getSessionById(@PathVariable String sessionId) {
    Optional<SessionLog> sessionOpt = sessionLogRepository.findById(sessionId);
    if (sessionOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Session not found");
    }
    return ResponseEntity.ok(sessionOpt.get());
}

    @DeleteMapping("/end-quiz/{studentId}/{classId}")
public ResponseEntity<Void> endQuizSession(
    @PathVariable String studentId,
    @PathVariable String classId
) {
    sessionLogService.endQuizSession(studentId, classId);
    return ResponseEntity.ok().build();
}

@GetMapping("/sessions/completed/{classId}")
public ResponseEntity<List<Map<String, Object>>> getCompletedSessionsWithNames(@PathVariable String classId) {
    List<Map<String, Object>> sessions = sessionLogService.getCompletedSessionsWithStudentNames(classId);
    return ResponseEntity.ok(sessions);
}





}


