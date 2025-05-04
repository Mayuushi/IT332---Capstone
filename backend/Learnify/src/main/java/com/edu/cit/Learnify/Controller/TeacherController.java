package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.DTO.CreateTeacherDTO;
import com.edu.cit.Learnify.Entity.Teacher;
import com.edu.cit.Learnify.Service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // Accepting frontend origins

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @PostMapping
    public Teacher createTeacher(@RequestBody CreateTeacherDTO dto) {
        // Now include password
        return teacherService.createTeacher(dto);
    }

    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    @GetMapping("/{id}")
    public Teacher getTeacherById(@PathVariable String id) {
        return teacherService.getTeacherById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
    }
}
