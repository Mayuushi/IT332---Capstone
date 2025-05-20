// DashboardOverviewDTO.java
package com.edu.cit.Learnify.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardOverviewDTO {
    private double avgQuizScore;
    private double lessonCompletionRate;
    private int totalPoints;
    private int studentCount;
}
