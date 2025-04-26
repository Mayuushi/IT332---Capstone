package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.DTO.PointsDTO;
import com.edu.cit.Learnify.DTO.StudentPointsDTO;
import com.edu.cit.Learnify.Entity.Points;
import com.edu.cit.Learnify.Entity.Student;
import com.edu.cit.Learnify.Repository.PointsRepository;
import com.edu.cit.Learnify.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PointsService {

    @Autowired
    private PointsRepository pointsRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private BadgeService badgeService;

    /**
     * Award points to a student for completing an activity
     */
    @Transactional
    public Points awardPoints(PointsDTO pointsDTO) {
        // Create new points record
        Points points = new Points(
                pointsDTO.getStudentId(),
                pointsDTO.getPoints(),
                pointsDTO.getActivityType(),
                pointsDTO.getActivityId(),
                pointsDTO.getDescription()
        );

        // Save points to database
        Points savedPoints = pointsRepository.save(points);

        // Update student's total points
        Optional<Student> studentOptional = studentRepository.findById(pointsDTO.getStudentId());
        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            student.addPoints(pointsDTO.getPoints());
            studentRepository.save(student);

            // Check if student has earned any new badges
            badgeService.checkAndAwardBadges(student);
        }

        return savedPoints;
    }

    /**
     * Get total points for a student
     */
    public StudentPointsDTO getStudentPoints(String studentId) {
        Optional<Student> studentOptional = studentRepository.findById(studentId);
        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            return new StudentPointsDTO(
                    student.getId(),
                    student.getName(),
                    student.getTotalPoints(),
                    student.getLevel()
            );
        }
        return null;
    }

    /**
     * Get points history for a student
     */
    public List<Points> getPointsHistory(String studentId) {
        return pointsRepository.findByStudentId(studentId);
    }

    /**
     * Get points earned by a student within a specific time period
     */
    public List<Points> getPointsInTimeRange(String studentId, LocalDateTime start, LocalDateTime end) {
        return pointsRepository.findByStudentIdAndEarnedAtBetween(studentId, start, end);
    }

    /**
     * Get leaderboard based on total points
     */
    public List<StudentPointsDTO> getLeaderboard(int limit) {
        List<Student> topStudents = studentRepository.findAllOrderByTotalPointsDesc();

        if (limit > 0 && topStudents.size() > limit) {
            topStudents = topStudents.subList(0, limit);
        }

        return topStudents.stream()
                .map(student -> new StudentPointsDTO(
                        student.getId(),
                        student.getName(),
                        student.getTotalPoints(),
                        student.getLevel()))
                .collect(Collectors.toList());
    }

    /**
     * Get points earned by activity type
     */
    public List<Points> getPointsByActivityType(String studentId, String activityType) {
        return pointsRepository.findByStudentIdAndActivityType(studentId, activityType);
    }
}