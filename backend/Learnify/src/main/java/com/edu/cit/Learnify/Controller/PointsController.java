package com.edu.cit.Learnify.Controller;


import com.edu.cit.Learnify.DTO.PointsDTO;
import com.edu.cit.Learnify.DTO.StudentPointsDTO;
import com.edu.cit.Learnify.Entity.Points;
import com.edu.cit.Learnify.Service.PointsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // Accept all origins
@RestController
@RequestMapping("/api/points")
public class PointsController {

    @Autowired
    private PointsService pointsService;

    /**
     * Award points to a student
     */
    @PostMapping("/award")
    public ResponseEntity<Points> awardPoints(@RequestBody PointsDTO pointsDTO) {
        Points points = pointsService.awardPoints(pointsDTO);
        return new ResponseEntity<>(points, HttpStatus.CREATED);
    }

    /**
     * Get student points info
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<StudentPointsDTO> getStudentPoints(@PathVariable String studentId) {
        StudentPointsDTO studentPoints = pointsService.getStudentPoints(studentId);
        if (studentPoints != null) {
            return new ResponseEntity<>(studentPoints, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Get points history for a student
     */
    @GetMapping("/history/{studentId}")
    public ResponseEntity<List<Points>> getPointsHistory(@PathVariable String studentId) {
        List<Points> history = pointsService.getPointsHistory(studentId);
        return new ResponseEntity<>(history, HttpStatus.OK);
    }

    /**
     * Get points earned within a time range
     */
    @GetMapping("/timerange/{studentId}")
    public ResponseEntity<List<Points>> getPointsInTimeRange(
            @PathVariable String studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        List<Points> points = pointsService.getPointsInTimeRange(studentId, start, end);
        return new ResponseEntity<>(points, HttpStatus.OK);
    }

    /**
     * Get points leaderboard
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<StudentPointsDTO>> getLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        List<StudentPointsDTO> leaderboard = pointsService.getLeaderboard(limit);
        return new ResponseEntity<>(leaderboard, HttpStatus.OK);
    }

    /**
     * Get points by activity type
     */
    @GetMapping("/activity/{studentId}")
    public ResponseEntity<List<Points>> getPointsByActivityType(
            @PathVariable String studentId,
            @RequestParam String activityType) {

        List<Points> points = pointsService.getPointsByActivityType(studentId, activityType);
        return new ResponseEntity<>(points, HttpStatus.OK);
    }
}