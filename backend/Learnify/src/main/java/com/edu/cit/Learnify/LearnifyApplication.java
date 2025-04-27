package com.edu.cit.Learnify;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LearnifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearnifyApplication.class, args);
	}

	/*@Bean
	public CommandLineRunner demo(TeacherRepository teacherRepository) {
		return (args) -> {
			// Add a test teacher to the database if not already present
			if (teacherRepository.count() == 0) {
				Teacher testTeacher = new Teacher("John Doe", "john.doe@example.com", "Mathematics");
				teacherRepository.save(testTeacher);
				System.out.println("Test Teacher added: " + testTeacher.getName());
			}
		};*/

}
