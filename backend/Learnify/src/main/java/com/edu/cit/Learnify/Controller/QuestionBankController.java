package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.Entity.QuestionBankItem;
import com.edu.cit.Learnify.Service.QuestionBankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question-bank")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionBankController {

    @Autowired
    private QuestionBankService questionBankService;

    // ✅ Add a question to the bank
    @PostMapping
    public QuestionBankItem addQuestionToBank(@RequestBody QuestionBankItem item) {
        return questionBankService.addQuestionToBank(item);
    }

    // ✅ Fetch all questions by teacher ID
    @GetMapping("/teacher/{teacherId}")
    public List<QuestionBankItem> getQuestionsByTeacher(@PathVariable String teacherId) {
        return questionBankService.getQuestionsByTeacherId(teacherId);
    }

    // ❌ DELETE endpoint
    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable String id) {
        questionBankService.deleteQuestionById(id);
}

}
