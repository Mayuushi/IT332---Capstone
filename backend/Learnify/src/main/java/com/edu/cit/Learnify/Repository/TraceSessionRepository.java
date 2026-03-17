package com.edu.cit.Learnify.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.edu.cit.Learnify.Entity.TraceSession;

public interface TraceSessionRepository extends MongoRepository<TraceSession, String> {
    List<TraceSession> findByStudentIdOrderByStartedAtDesc(String studentId);
}
