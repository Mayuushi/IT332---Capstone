package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.DTO.BadgeDTO;
import com.edu.cit.Learnify.Entity.Badge;
import com.edu.cit.Learnify.Service.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // Accept all origins
@RestController
@RequestMapping("/api/badges")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    /**
     * Get all badges for a student
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<BadgeDTO>> getStudentBadges(@PathVariable String studentId) {
        List<BadgeDTO> badges = badgeService.getStudentBadges(studentId);
        return new ResponseEntity<>(badges, HttpStatus.OK);
    }

    /**
     * Get new (unviewed) badges for a student
     */
    @GetMapping("/student/{studentId}/new")
    public ResponseEntity<List<BadgeDTO>> getNewBadges(@PathVariable String studentId) {
        List<BadgeDTO> newBadges = badgeService.getNewBadges(studentId);
        return new ResponseEntity<>(newBadges, HttpStatus.OK);
    }

    /**
     * Create a new badge
     */
    @PostMapping
    public ResponseEntity<Badge> createBadge(@RequestBody Badge badge) {
        Badge newBadge = badgeService.createBadge(badge);
        return new ResponseEntity<>(newBadge, HttpStatus.CREATED);
    }

    /**
     * Get all badges
     */
    @GetMapping
    public ResponseEntity<List<Badge>> getAllBadges() {
        List<Badge> badges = badgeService.getAllBadges();
        return new ResponseEntity<>(badges, HttpStatus.OK);
    }

    /**
     * Get badges by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Badge>> getBadgesByCategory(@PathVariable String category) {
        List<Badge> badges = badgeService.getBadgesByCategory(category);
        return new ResponseEntity<>(badges, HttpStatus.OK);
    }

    /**
     * Get all badges with earned status for a student
     */
    @GetMapping("/student/{studentId}/all")
    public ResponseEntity<List<BadgeDTO>> getAllBadgesWithStatus(@PathVariable String studentId) {
        List<BadgeDTO> badges = badgeService.getAllBadgesWithEarnedStatus(studentId);
        return new ResponseEntity<>(badges, HttpStatus.OK);
    }

}
