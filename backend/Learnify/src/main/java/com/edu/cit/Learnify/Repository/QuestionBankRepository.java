package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.QuestionBankItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuestionBankRepository extends MongoRepository<QuestionBankItem, String> {
    List<QuestionBankItem> findByTeacherId(String teacherId);
}
