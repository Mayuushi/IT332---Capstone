package com.edu.cit.Learnify.DTO;

import java.time.DayOfWeek;

public class EngagementHeatmapDTO {
    private DayOfWeek dayOfWeek;
    private int submissions;

    public EngagementHeatmapDTO() {}

    public EngagementHeatmapDTO(DayOfWeek dayOfWeek, int submissions) {
        this.dayOfWeek = dayOfWeek;
        this.submissions = submissions;
    }

    public DayOfWeek getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public int getSubmissions() { return submissions; }
    public void setSubmissions(int submissions) { this.submissions = submissions; }
}
