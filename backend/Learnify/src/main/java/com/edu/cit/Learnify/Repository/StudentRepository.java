package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface StudentRepository extends MongoRepository<Student, String> {
    Student findByEmail(String email);

    List<Student> findByGrade(int grade);

    @Query(value = "{}", sort = "{'totalPoints': -1}")
    List<Student> findAllOrderByTotalPointsDesc();
}
