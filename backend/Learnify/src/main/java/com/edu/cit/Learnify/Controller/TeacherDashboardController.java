package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.Service.TeacherDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/teacher-dashboard")
@CrossOrigin(origins = "http://localhost:3000") // Accepting frontend origins
public class TeacherDashboardController {

    @Autowired
    private TeacherDashboardService dashboardService;

    @GetMapping("/overview/{classId}")
    public Map<String, Object> getOverviewForClass(@PathVariable String classId) {
        return dashboardService.getOverviewData(classId);
    }
}
