package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.Class;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ClassRepository extends MongoRepository<Class, String> {
    List<Class> findByStudentIdsContaining(String studentId);
    List<Class> findByTeacherId(String teacherId);

}
