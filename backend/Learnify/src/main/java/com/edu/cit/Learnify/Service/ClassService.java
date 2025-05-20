package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.DTO.ClassWithStudentsDTO;
import com.edu.cit.Learnify.DTO.ClassWithUsersDTO;
import com.edu.cit.Learnify.DTO.CreateClassDTO;
import com.edu.cit.Learnify.DTO.UserDTO;
import com.edu.cit.Learnify.Entity.Class;
import com.edu.cit.Learnify.Entity.Quiz;
import com.edu.cit.Learnify.Entity.Student;
import com.edu.cit.Learnify.Entity.Teacher;
import com.edu.cit.Learnify.Repository.ClassRepository;
import com.edu.cit.Learnify.Repository.QuizRepository;
import com.edu.cit.Learnify.Repository.StudentRepository;
import com.edu.cit.Learnify.Repository.TeacherRepository;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClassService {

    private static final Logger logger = LogManager.getLogger(ClassService.class);

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private QuizRepository quizRepository;


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

    public List<ClassWithStudentsDTO> getAllClassesWithStudents() {
        List<Class> classes = classRepository.findAll();
        return classes.stream()
                .map(clazz -> {
                    List<Student> students = studentRepository.findAllById(clazz.getStudentIds());
                    return new ClassWithStudentsDTO(clazz, students);
                })
                .collect(Collectors.toList());
    }

    public Class updateClass(String id, Class updatedData) {
        return classRepository.findById(id).map(existing -> {
            existing.setTopic(updatedData.getTopic());
            existing.setStudentIds(updatedData.getStudentIds());
            return classRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Class not found"));
    }

    public void deleteClass(String id) {
        classRepository.deleteById(id);
    }

    public List<Class> getClassesByStudentId(String studentId) {
        return classRepository.findByStudentIdsContaining(studentId);
    }

    public List<ClassWithUsersDTO> getClassesByStudentIdWithUserData(String studentId) {
        List<Class> classes = classRepository.findByStudentIdsContaining(studentId);

        return classes.stream().map(clazz -> {
            String teacherId = clazz.getTeacherId();
            Optional<Teacher> teacherOpt = teacherRepository.findById(teacherId);
            UserDTO teacher = teacherOpt.map(t -> new UserDTO(t.getId(), t.getName()))
                    .orElseGet(() -> {
                        logger.warn("Teacher not found for teacherId: " + teacherId);
                        return null;
                    });

            List<Student> classmates = studentRepository.findAllById(clazz.getStudentIds());
            List<UserDTO> classmateDTOs = classmates.stream()
                    .map(s -> new UserDTO(s.getId(), s.getName()))
                    .collect(Collectors.toList());

            List<Quiz> quizzes = quizRepository.findByClassId(clazz.getId());

            return new ClassWithUsersDTO(clazz.getId(), clazz.getTopic(), teacher, classmateDTOs, quizzes);
        }).collect(Collectors.toList());
    }

    public List<Class> getClassesByTeacherId(String teacherId) {
        return classRepository.findByTeacherId(teacherId);
    }

    // New method to get classes by teacher with students loaded
    public List<ClassWithStudentsDTO> getClassesByTeacherIdWithStudents(String teacherId) {
        List<Class> classes = classRepository.findByTeacherId(teacherId);
        return classes.stream()
                .map(clazz -> {
                    List<Student> students = studentRepository.findAllById(clazz.getStudentIds());
                    return new ClassWithStudentsDTO(clazz, students);
                })
                .collect(Collectors.toList());
    }
}
