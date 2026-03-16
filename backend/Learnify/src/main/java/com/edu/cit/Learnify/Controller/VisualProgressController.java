package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.DTO.ClassAverageScoreDTO;
import com.edu.cit.Learnify.DTO.EngagementHeatmapDTO;
import com.edu.cit.Learnify.DTO.QuizScoreTrendDTO;
import com.edu.cit.Learnify.Service.VisualProgressService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin
public class VisualProgressController {

    private final VisualProgressService service;

    public VisualProgressController(VisualProgressService service) {
        this.service = service;
    }

    @GetMapping("/class-performance/{classId}")
    public List<ClassAverageScoreDTO> getClassPerformance(@PathVariable String classId) {
        return service.getClassPerformanceByClassId(classId);
    }

    @GetMapping("/quiz-averages/{classId}")
    public List<ClassAverageScoreDTO> getQuizAverages(@PathVariable String classId) {
        return service.getQuizAveragesByClassId(classId);
    }

    @GetMapping("/engagement-heatmap/{classId}")
    public List<EngagementHeatmapDTO> getEngagementHeatmap(@PathVariable String classId) {
        return service.getEngagementHeatmapByClassId(classId);
    }

    @GetMapping("/temporal-analysis/{classId}")
    public List<QuizScoreTrendDTO> getTemporalAnalysis(@PathVariable String classId) {
        return service.getTemporalAnalysisByClassId(classId);
    }

    @GetMapping("/export/class/{classId}/teacher/{teacherId}")
    public ResponseEntity<byte[]> exportClassStudentScores(
            @PathVariable String classId,
            @PathVariable String teacherId
    ) {
        try {
            byte[] fileBytes = service.exportClassStudentScoresToExcel(classId, teacherId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ));
            headers.setContentDisposition(ContentDisposition.attachment()
                    .filename("class-" + classId + "-student-scores.xlsx")
                    .build());

            return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}

