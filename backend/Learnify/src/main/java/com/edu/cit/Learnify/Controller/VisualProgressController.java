package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.DTO.ClassAverageScoreDTO;
import com.edu.cit.Learnify.DTO.EngagementHeatmapDTO;
import com.edu.cit.Learnify.DTO.QuizScoreTrendDTO;
import com.edu.cit.Learnify.Service.VisualProgressService;
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
}

