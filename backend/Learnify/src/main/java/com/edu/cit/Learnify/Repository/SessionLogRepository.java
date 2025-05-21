package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.SessionLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SessionLogRepository extends MongoRepository<SessionLog, String> {
    List<SessionLog> findByClassId(String classId);
    List<SessionLog> findByClassIdAndEndTimeIsNull(String classId);
    List<SessionLog> findByClassIdAndEndTimeIsNotNull(String classId);  // <-- add this
    void deleteByStudentIdAndClassIdAndActivityTypeAndEndTimeIsNull(
        String studentId, String classId, String activityType
    );


}
