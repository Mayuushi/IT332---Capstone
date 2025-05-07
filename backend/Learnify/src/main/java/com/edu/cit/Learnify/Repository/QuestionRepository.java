package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findAll();


}
