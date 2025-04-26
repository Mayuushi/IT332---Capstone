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
import com.edu.cit.Learnify.Repository.StudentRepository;
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

    @Autowired
    private StudentRepository studentRepository;

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
    /**
     * Get all available badges for a student with earned status
     */
    public List<BadgeDTO> getAllBadgesWithEarnedStatus(String studentId) {
        List<Badge> allBadges = badgeRepository.findAll();
        List<StudentBadge> earnedBadges = studentBadgeRepository.findByStudentId(studentId);

        // Create a set of earned badge IDs for faster lookup
        java.util.Set<String> earnedBadgeIds = earnedBadges.stream()
                .map(StudentBadge::getBadgeId)
                .collect(Collectors.toSet());

        return allBadges.stream()
                .map(badge -> {
                    boolean isEarned = earnedBadgeIds.contains(badge.getId());

                    // Find earned date if badge is earned
                    java.time.LocalDateTime earnedAt = null;
                    if (isEarned) {
                        earnedAt = earnedBadges.stream()
                                .filter(sb -> sb.getBadgeId().equals(badge.getId()))
                                .findFirst()
                                .map(StudentBadge::getEarnedAt)
                                .orElse(null);
                    }

                    return new BadgeDTO(
                            badge.getId(),
                            badge.getName(),
                            badge.getDescription(),
                            badge.getImageUrl(),
                            earnedAt,
                            false  // Since we're showing all badges, none are "new"
                    );
                })
                .collect(Collectors.toList());
    }

    /**
     * Directly award a specific badge to a student
     */
    @Transactional
    public BadgeDTO awardBadgeToStudent(String studentId, String badgeId) {
        // Check if student exists
        Optional<Student> studentOptional = studentRepository.findById(studentId);
        if (!studentOptional.isPresent()) {
            return null;
        }

        // Check if badge exists
        Optional<Badge> badgeOptional = badgeRepository.findById(badgeId);
        if (!badgeOptional.isPresent()) {
            return null;
        }

        Badge badge = badgeOptional.get();

        // Check if student already has this badge
        StudentBadge existingBadge = studentBadgeRepository.findByStudentIdAndBadgeId(studentId, badgeId);
        if (existingBadge != null) {
            // Student already has this badge
            return new BadgeDTO(
                    badge.getId(),
                    badge.getName(),
                    badge.getDescription(),
                    badge.getImageUrl(),
                    existingBadge.getEarnedAt(),
                    false
            );
        }

        // Award the badge to the student
        StudentBadge newStudentBadge = new StudentBadge(studentId, badgeId);
        studentBadgeRepository.save(newStudentBadge);

        return new BadgeDTO(
                badge.getId(),
                badge.getName(),
                badge.getDescription(),
                badge.getImageUrl(),
                newStudentBadge.getEarnedAt(),
                true
        );
    }
}
