package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.Teacher;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TeacherRepository extends MongoRepository<Teacher, String> {
}
