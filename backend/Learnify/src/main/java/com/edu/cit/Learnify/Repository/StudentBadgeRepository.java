package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.StudentBadge;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface StudentBadgeRepository extends MongoRepository<StudentBadge, String> {
    List<StudentBadge> findByStudentId(String studentId);

    StudentBadge findByStudentIdAndBadgeId(String studentId, String badgeId);

    List<StudentBadge> findByStudentIdAndDisplayed(String studentId, boolean displayed);
}
