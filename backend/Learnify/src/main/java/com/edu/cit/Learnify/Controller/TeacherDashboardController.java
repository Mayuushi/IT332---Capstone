package com.edu.cit.Learnify.Controller;

import com.edu.cit.Learnify.Service.SessionLogService;
import com.edu.cit.Learnify.Service.TeacherDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher-dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class TeacherDashboardController {

    @Autowired
    private TeacherDashboardService dashboardService;

    @Autowired
    private SessionLogService sessionLogService;

    @GetMapping("/overview/{classId}")
    public Map<String, Object> getOverviewForClass(@PathVariable String classId) {
        return dashboardService.getOverviewData(classId);
    }

    @GetMapping("/realtime/{classId}")
    public Map<String, Object> getRealTimeMonitoring(@PathVariable String classId) {
    return dashboardService.getRealTimeMonitoringData(classId);
}


    // New endpoint for ongoing sessions
    @GetMapping("/sessions/ongoing/{classId}")
    public List<?> getOngoingSessions(@PathVariable String classId) {
        return sessionLogService.getOngoingSessionsByClass(classId);
    }

    // New endpoint for completed sessions
    @GetMapping("/sessions/completed/{classId}")
    public List<?> getCompletedSessions(@PathVariable String classId) {
        return sessionLogService.getCompletedSessionsByClass(classId);
    }
}

