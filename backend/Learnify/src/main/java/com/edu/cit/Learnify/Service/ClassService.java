package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.DTO.CreateClassDTO;
import com.edu.cit.Learnify.Entity.Class;
import com.edu.cit.Learnify.Repository.ClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClassService {

    @Autowired
    private ClassRepository classRepository;

    public Class createClass(CreateClassDTO dto) {
        Class classEntity = new Class(dto.getTopic(), dto.getTeacherId(), dto.getStudentIds());
        return classRepository.save(classEntity);
    }

    public List<Class> getAllClasses() {
        return classRepository.findAll();
    }

    public Optional<Class> getClassById(String id) {
        return classRepository.findById(id);
    }
}
