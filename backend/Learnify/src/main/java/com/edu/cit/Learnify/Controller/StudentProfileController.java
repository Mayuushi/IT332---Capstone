package com.edu.cit.Learnify.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.cit.Learnify.DTO.StudentProfileDTO;
import com.edu.cit.Learnify.Service.StudentProfileService;

@CrossOrigin(origins = "http://localhost:3000") // Accept all origins
@RestController
@RequestMapping("/api/profiles")
public class StudentProfileController {

    @Autowired private StudentProfileService profileService;

    @GetMapping("/{studentId}")
    public ResponseEntity<StudentProfileDTO> getProfile(@PathVariable String studentId) {
        StudentProfileDTO profile = profileService.getStudentProfile(studentId);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/{studentId}/notes")
    public ResponseEntity<?> addNote(
            @PathVariable String studentId,
            @RequestBody Map<String, String> payload,
            @RequestHeader("teacherId") String teacherId) {
        
        String noteContent = payload.get("note");
        if (noteContent == null || noteContent.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Note content cannot be empty");
        }
        profileService.addNoteToStudent(studentId, teacherId, noteContent.trim());
        return ResponseEntity.ok().build();
    }
}
