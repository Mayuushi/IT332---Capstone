package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.DTO.ClassWithStudentsDTO;
import com.edu.cit.Learnify.DTO.CreateClassDTO;
import com.edu.cit.Learnify.Entity.Class;
import com.edu.cit.Learnify.Service.ClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassService classService;

    @PostMapping
    public Class createClass(@RequestBody CreateClassDTO dto) {
        return classService.createClass(dto);
    }

    @GetMapping
    public List<Class> getAllClasses() {
        return classService.getAllClasses();
    }

    @GetMapping("/with-students")
    public List<ClassWithStudentsDTO> getAllClassesWithStudents() {
        return classService.getAllClassesWithStudents();
    }

    @GetMapping("/{id}")
    public Class getClassById(@PathVariable String id) {
        return classService.getClassById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
    }

    @PutMapping("/{id}")
    public Class updateClass(@PathVariable String id, @RequestBody Class updatedClass) {
        return classService.updateClass(id, updatedClass);
    }

    @DeleteMapping("/{id}")
    public void deleteClass(@PathVariable String id) {
        classService.deleteClass(id);
    }

    @GetMapping("/student/{studentId}")
    public List<Class> getClassesByStudentId(@PathVariable String studentId) {
        return classService.getClassesByStudentId(studentId);
    }



}
