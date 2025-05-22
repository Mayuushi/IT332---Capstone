package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.Entity.QuestionBankItem;
import com.edu.cit.Learnify.Repository.QuestionBankRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionBankService {

    @Autowired
    private QuestionBankRepository repository;

    public List<QuestionBankItem> getQuestionsByTeacherId(String teacherId) {
        return repository.findByTeacherId(teacherId);
    }

    public QuestionBankItem addQuestionToBank(QuestionBankItem item) {
        return repository.save(item);
    }

    public void deleteQuestionById(String id) {
    repository.deleteById(id);
}

}
