package com.edu.cit.Learnify.Service;

import com.edu.cit.Learnify.Entity.Class;
import com.edu.cit.Learnify.Entity.Quiz;
import com.edu.cit.Learnify.Entity.QuizSubmission;
import com.edu.cit.Learnify.DTO.ClassAverageScoreDTO;
import com.edu.cit.Learnify.DTO.QuizScoreTrendDTO;
import com.edu.cit.Learnify.DTO.EngagementHeatmapDTO;
import com.edu.cit.Learnify.Repository.ClassRepository;
import com.edu.cit.Learnify.Repository.QuizRepository;
import com.edu.cit.Learnify.Repository.QuizSubmissionRepository;
import com.edu.cit.Learnify.Repository.StudentRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class VisualProgressService {

    private final QuizSubmissionRepository submissionRepo;
    private final QuizRepository quizRepo;
    private final ClassRepository classRepo;
    private final StudentRepository studentRepo;

    public VisualProgressService(
            QuizSubmissionRepository submissionRepo,
            QuizRepository quizRepo,
            ClassRepository classRepo,
            StudentRepository studentRepo
    ) {
        this.submissionRepo = submissionRepo;
        this.quizRepo = quizRepo;
        this.classRepo = classRepo;
        this.studentRepo = studentRepo;
    }

    // Existing methods here...

    // 1. Class Performance by classId
    public List<ClassAverageScoreDTO> getClassPerformanceByClassId(String classId) {
        Optional<Class> clsOpt = classRepo.findById(classId);
        if (clsOpt.isEmpty()) {
            return Collections.emptyList();
        }
        Class cls = clsOpt.get();
        List<Quiz> quizzes = quizRepo.findByClassId(classId);
        List<String> quizIds = quizzes.stream().map(Quiz::getId).toList();

        List<QuizSubmission> submissions = submissionRepo.findByQuizIdIn(quizIds);

        double avg = submissions.stream()
            .mapToDouble(s -> s.getTotalPossible() == 0 ? 0 : (double) s.getScore() / s.getTotalPossible())
            .average()
            .orElse(0.0) * 100;

        return List.of(new ClassAverageScoreDTO(cls.getId(), cls.getTopic(), avg));
    }

    // 2. Quiz averages by classId (assuming similar to class performance but maybe per quiz)
    public List<ClassAverageScoreDTO> getQuizAveragesByClassId(String classId) {
        List<Quiz> quizzes = quizRepo.findByClassId(classId);
        List<ClassAverageScoreDTO> results = new ArrayList<>();

        for (Quiz quiz : quizzes) {
            List<QuizSubmission> submissions = submissionRepo.findByQuizId(quiz.getId());
            double avg = submissions.stream()
                .mapToDouble(s -> s.getTotalPossible() == 0 ? 0 : (double) s.getScore() / s.getTotalPossible())
                .average()
                .orElse(0.0) * 100;

            results.add(new ClassAverageScoreDTO(quiz.getId(), quiz.getTitle(), avg));
        }

        return results;
    }

    // 3. Engagement heatmap filtered by classId (count submissions per day of week for quizzes in class)
    public List<EngagementHeatmapDTO> getEngagementHeatmapByClassId(String classId) {
        List<Quiz> quizzes = quizRepo.findByClassId(classId);
        List<String> quizIds = quizzes.stream().map(Quiz::getId).toList();

        List<QuizSubmission> submissions = submissionRepo.findByQuizIdIn(quizIds);

        Map<DayOfWeek, Integer> dayCounts = new EnumMap<>(DayOfWeek.class);
        for (QuizSubmission submission : submissions) {
            DayOfWeek day = submission.getSubmittedAt().getDayOfWeek();
            dayCounts.put(day, dayCounts.getOrDefault(day, 0) + 1);
        }

        List<EngagementHeatmapDTO> heatmap = new ArrayList<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            heatmap.add(new EngagementHeatmapDTO(day, dayCounts.getOrDefault(day, 0)));
        }

        return heatmap;
    }

    // 4. Temporal analysis filtered by classId (trends over time for quizzes in class)
    public List<QuizScoreTrendDTO> getTemporalAnalysisByClassId(String classId) {
        List<Quiz> quizzes = quizRepo.findByClassId(classId);
        List<String> quizIds = quizzes.stream().map(Quiz::getId).toList();

        // You may want to add a time range parameter here, or keep default
        LocalDateTime start = LocalDate.now().minusDays(30).atStartOfDay();

        List<QuizSubmission> submissions = submissionRepo.findByQuizIdInAndSubmittedAtAfter(quizIds, start);

        Map<LocalDate, List<QuizSubmission>> grouped = new HashMap<>();
        for (QuizSubmission s : submissions) {
            LocalDate date = s.getSubmittedAt().toLocalDate();
            grouped.computeIfAbsent(date, k -> new ArrayList<>()).add(s);
        }

        List<QuizScoreTrendDTO> trends = new ArrayList<>();
        for (Map.Entry<LocalDate, List<QuizSubmission>> entry : grouped.entrySet()) {
            double avg = entry.getValue().stream()
                .mapToDouble(s -> s.getTotalPossible() == 0 ? 0 : (double) s.getScore() / s.getTotalPossible())
                .average()
                .orElse(0.0) * 100;

            trends.add(new QuizScoreTrendDTO(entry.getKey(), avg));
        }

        trends.sort(Comparator.comparing(QuizScoreTrendDTO::getDate));
        return trends;
    }

    public byte[] exportClassStudentScoresToExcel(String classId, String teacherId) {
        Optional<Class> classOpt = classRepo.findById(classId);
        if (classOpt.isEmpty()) {
            throw new IllegalArgumentException("Class not found");
        }

        Class cls = classOpt.get();
        if (!Objects.equals(cls.getTeacherId(), teacherId)) {
            throw new SecurityException("You are not allowed to export this class");
        }

        List<Quiz> quizzes = quizRepo.findByClassId(classId);
        List<String> quizIds = quizzes.stream().map(Quiz::getId).toList();
        List<QuizSubmission> submissions = quizIds.isEmpty()
                ? Collections.emptyList()
                : submissionRepo.findByQuizIdIn(quizIds);

        Map<String, List<QuizSubmission>> submissionsByStudent = new HashMap<>();
        for (QuizSubmission submission : submissions) {
            submissionsByStudent
                    .computeIfAbsent(submission.getStudentId(), ignored -> new ArrayList<>())
                    .add(submission);
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Student Scores");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Student Name");
            header.createCell(1).setCellValue("Score");

            List<String> studentIds = cls.getStudentIds() == null ? Collections.emptyList() : cls.getStudentIds();
            int rowIndex = 1;
            for (String studentId : studentIds) {
                String studentName = studentRepo.findById(studentId)
                        .map(student -> student.getName() == null || student.getName().isBlank() ? studentId : student.getName())
                        .orElse(studentId);

                List<QuizSubmission> studentSubmissions = submissionsByStudent.getOrDefault(studentId, Collections.emptyList());
                double averageScore = studentSubmissions.stream()
                        .mapToDouble(s -> s.getTotalPossible() == 0 ? 0.0 : (s.getScore() * 100.0) / s.getTotalPossible())
                        .average()
                        .orElse(0.0);

                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(studentName);
                row.createCell(1).setCellValue(Math.round(averageScore * 100.0) / 100.0);
            }

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException ex) {
            throw new RuntimeException("Failed to generate export file", ex);
        }
    }
}
