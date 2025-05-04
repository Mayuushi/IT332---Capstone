package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.DTO.CreateClassDTO;
import com.edu.cit.Learnify.Entity.Class;
import com.edu.cit.Learnify.Service.ClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:3000") // Accepting frontend origins

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

    @GetMapping("/{id}")
    public Class getClassById(@PathVariable String id) {
        return classService.getClassById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
    }
}
