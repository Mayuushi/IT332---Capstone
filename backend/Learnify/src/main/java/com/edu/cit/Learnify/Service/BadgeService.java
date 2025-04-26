package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.DTO.BadgeDTO;
import com.edu.cit.Learnify.Entity.Badge;
import com.edu.cit.Learnify.Entity.Student;
import com.edu.cit.Learnify.Entity.StudentBadge;
import com.edu.cit.Learnify.Repository.BadgeRepository;
import com.edu.cit.Learnify.Repository.StudentBadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private StudentBadgeRepository studentBadgeRepository;

    /**
     * Check and award badges to a student based on their total points and activities
     */
    @Transactional
    public List<Badge> checkAndAwardBadges(Student student) {
        List<Badge> newlyAwardedBadges = new ArrayList<>();

        // Get all badges that can be earned with student's current points
        List<Badge> availableBadges = badgeRepository.findBadgesEarnableWithPoints(student.getTotalPoints());

        for (Badge badge : availableBadges) {
            // Check if student already has this badge
            StudentBadge existingBadge = studentBadgeRepository.findByStudentIdAndBadgeId(
                    student.getId(), badge.getId());

            if (existingBadge == null) {
                // Student doesn't have this badge yet, so award it
                StudentBadge newStudentBadge = new StudentBadge(student.getId(), badge.getId());
                studentBadgeRepository.save(newStudentBadge);
                newlyAwardedBadges.add(badge);
            }
        }

        return newlyAwardedBadges;
    }

    /**
     * Get all badges for a specific student
     */
    public List<BadgeDTO> getStudentBadges(String studentId) {
        List<StudentBadge> studentBadges = studentBadgeRepository.findByStudentId(studentId);

        return studentBadges.stream()
                .map(studentBadge -> {
                    Optional<Badge> badgeOptional = badgeRepository.findById(studentBadge.getBadgeId());
                    if (badgeOptional.isPresent()) {
                        Badge badge = badgeOptional.get();
                        boolean isNew = !studentBadge.isDisplayed();

                        // If badge is new, mark it as displayed
                        if (isNew) {
                            studentBadge.setDisplayed(true);
                            studentBadgeRepository.save(studentBadge);
                        }

                        return new BadgeDTO(
                                badge.getId(),
                                badge.getName(),
                                badge.getDescription(),
                                badge.getImageUrl(),
                                studentBadge.getEarnedAt(),
                                isNew
                        );
                    }
                    return null;
                })
                .filter(badgeDTO -> badgeDTO != null)
                .collect(Collectors.toList());
    }

    /**
     * Get all new (unviewed) badges for a student
     */
    public List<BadgeDTO> getNewBadges(String studentId) {
        List<StudentBadge> newStudentBadges = studentBadgeRepository.findByStudentIdAndDisplayed(studentId, false);

        return newStudentBadges.stream()
                .map(studentBadge -> {
                    Optional<Badge> badgeOptional = badgeRepository.findById(studentBadge.getBadgeId());
                    if (badgeOptional.isPresent()) {
                        Badge badge = badgeOptional.get();

                        // Mark badge as displayed
                        studentBadge.setDisplayed(true);
                        studentBadgeRepository.save(studentBadge);

                        return new BadgeDTO(
                                badge.getId(),
                                badge.getName(),
                                badge.getDescription(),
                                badge.getImageUrl(),
                                studentBadge.getEarnedAt(),
                                true
                        );
                    }
                    return null;
                })
                .filter(badgeDTO -> badgeDTO != null)
                .collect(Collectors.toList());
    }

    /**
     * Create a new badge
     */
    public Badge createBadge(Badge badge) {
        return badgeRepository.save(badge);
    }

    /**
     * Get all available badges
     */
    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }

    /**
     * Get badges by category
     */
    public List<Badge> getBadgesByCategory(String category) {
        return badgeRepository.findByCategory(category);
    }
}
