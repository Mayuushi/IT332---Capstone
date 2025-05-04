package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.DTO.CreateTeacherDTO;
import com.edu.cit.Learnify.Entity.Teacher;
import com.edu.cit.Learnify.Repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    public Teacher createTeacher(CreateTeacherDTO dto) {
        Teacher teacher = new Teacher(dto.getName(), dto.getEmail(), dto.getPassword());
        teacher.setTeacher(true); // explicitly mark as teacher
        return teacherRepository.save(teacher);
    }


    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Optional<Teacher> getTeacherById(String id) {
        return teacherRepository.findById(id);
    }
}
