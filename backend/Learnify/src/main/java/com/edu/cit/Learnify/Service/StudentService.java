package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.Entity.Student;
import com.edu.cit.Learnify.Repository.StudentRepository;
import com.edu.cit.Learnify.DTO.StudentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student registerStudent(StudentDTO studentDTO) {
        // Create a new student object with the DTO data (no encryption)
        Student student = new Student(
                studentDTO.getName(),
                studentDTO.getEmail(),
                studentDTO.getPassword(),  // Store password as plain text
                studentDTO.getGrade()
        );

        // Save the student to the database
        return studentRepository.save(student);
    }

    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }
}
