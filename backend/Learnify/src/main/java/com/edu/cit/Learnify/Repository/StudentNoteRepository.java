package com.edu.cit.Learnify.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.edu.cit.Learnify.Entity.StudentNote;

public interface StudentNoteRepository extends MongoRepository<StudentNote, String> {
    List<StudentNote> findByStudentId(String studentId);
    List<StudentNote> findByStudentIdOrderByCreatedAtDesc(String studentId);

}

