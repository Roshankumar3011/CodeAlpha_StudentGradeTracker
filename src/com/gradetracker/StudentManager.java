package com.gradetracker;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Manages the collection of Student records.
 * Provides features to add, delete, update, search, and calculate class metrics.
 */
public class StudentManager {
    private final List<Student> students;

    /**
     * Initializes an empty student list.
     */
    public StudentManager() {
        this.students = new ArrayList<>();
    }

    /**
     * Adds a new student to the records.
     *
     * @param student The Student object to add.
     * @throws IllegalArgumentException If a student with the same ID already exists.
     */
    public void addStudent(Student student) {
        if (student == null) {
            throw new IllegalArgumentException("Student record cannot be null.");
        }
        if (findStudentById(student.getStudentId()).isPresent()) {
            throw new IllegalArgumentException("A student with ID '" + student.getStudentId() + "' already exists.");
        }
        students.add(student);
    }

    /**
     * Retrieves an unmodifiable view of all student records.
     *
     * @return List of Students.
     */
    public List<Student> getAllStudents() {
        return Collections.unmodifiableList(students);
    }

    /**
     * Searches for a student by their ID.
     *
     * @param studentId The ID of the student.
     * @return An Optional containing the Student if found, or empty.
     */
    public Optional<Student> findStudentById(String studentId) {
        if (studentId == null || studentId.trim().isEmpty()) {
            return Optional.empty();
        }
        String cleanId = studentId.trim();
        return students.stream()
                .filter(s -> s.getStudentId().equalsIgnoreCase(cleanId))
                .findFirst();
    }

    /**
     * Updates the marks of an existing student.
     *
     * @param studentId The ID of the student.
     * @param newMarks  The new marks (0.0 to 100.0).
     * @throws IllegalArgumentException If student does not exist or marks are out of range.
     */
    public void updateStudentMarks(String studentId, double newMarks) {
        Student student = findStudentById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student with ID '" + studentId + "' not found."));
        student.setMarks(newMarks);
    }

    /**
     * Deletes a student record by ID.
     *
     * @param studentId The ID of the student.
     * @return true if the student was successfully removed, false otherwise.
     */
    public boolean deleteStudent(String studentId) {
        Optional<Student> studentOpt = findStudentById(studentId);
        if (studentOpt.isPresent()) {
            students.remove(studentOpt.get());
            return true;
        }
        return false;
    }

    /**
     * Calculates the average marks of all students.
     *
     * @return The average marks, or 0.0 if there are no students.
     */
    public double calculateAverageMarks() {
        if (students.isEmpty()) {
            return 0.0;
        }
        double sum = students.stream().mapToDouble(Student::getMarks).sum();
        return sum / students.size();
    }

    /**
     * Finds the students with the highest marks.
     * Handles ties by returning a list of all top students.
     *
     * @return List of highest-scoring Students.
     */
    public List<Student> findHighestScoringStudents() {
        if (students.isEmpty()) {
            return Collections.emptyList();
        }
        double maxMarks = students.stream()
                .mapToDouble(Student::getMarks)
                .max()
                .orElse(0.0);

        return students.stream()
                .filter(s -> s.getMarks() == maxMarks)
                .toList();
    }

    /**
     * Finds the students with the lowest marks.
     * Handles ties by returning a list of all lowest-scoring students.
     *
     * @return List of lowest-scoring Students.
     */
    public List<Student> findLowestScoringStudents() {
        if (students.isEmpty()) {
            return Collections.emptyList();
        }
        double minMarks = students.stream()
                .mapToDouble(Student::getMarks)
                .min()
                .orElse(0.0);

        return students.stream()
                .filter(s -> s.getMarks() == minMarks)
                .toList();
    }

    /**
     * Generates and prints a comprehensive class performance report.
     */
    public void printPerformanceReport() {
        if (students.isEmpty()) {
            System.out.println("\n+---------------------------------------------+");
            System.out.println("|           CLASS PERFORMANCE REPORT          |");
            System.out.println("+---------------------------------------------+");
            System.out.println("| No student records available to report.     |");
            System.out.println("+---------------------------------------------+");
            return;
        }

        int totalStudents = students.size();
        double classAverage = calculateAverageMarks();
        List<Student> topStudents = findHighestScoringStudents();
        List<Student> bottomStudents = findLowestScoringStudents();

        // Grade count distributions
        long countA = students.stream().filter(s -> s.getGrade() == 'A').count();
        long countB = students.stream().filter(s -> s.getGrade() == 'B').count();
        long countC = students.stream().filter(s -> s.getGrade() == 'C').count();
        long countD = students.stream().filter(s -> s.getGrade() == 'D').count();
        long countF = students.stream().filter(s -> s.getGrade() == 'F').count();

        long passedCount = totalStudents - countF;
        double passRate = ((double) passedCount / totalStudents) * 100.0;

        System.out.println("\n==========================================================================");
        System.out.println("                        CLASS PERFORMANCE REPORT                          ");
        System.out.println("==========================================================================");
        System.out.printf(" Total Registered Students : %d\n", totalStudents);
        System.out.printf(" Class Average Marks       : %.2f%%\n", classAverage);
        System.out.printf(" Overall Pass Rate         : %.2f%% (Passed: %d, Failed: %d)\n", passRate, passedCount, countF);
        System.out.println("--------------------------------------------------------------------------");
        
        System.out.println(" Grade Distribution:");
        System.out.printf("   - Grade A (90-100) : %2d students  [%s]\n", countA, getBarGraph(countA, totalStudents));
        System.out.printf("   - Grade B (80-89)  : %2d students  [%s]\n", countB, getBarGraph(countB, totalStudents));
        System.out.printf("   - Grade C (70-79)  : %2d students  [%s]\n", countC, getBarGraph(countC, totalStudents));
        System.out.printf("   - Grade D (60-69)  : %2d students  [%s]\n", countD, getBarGraph(countD, totalStudents));
        System.out.printf("   - Grade F (< 60)   : %2d students  [%s]\n", countF, getBarGraph(countF, totalStudents));
        System.out.println("--------------------------------------------------------------------------");

        System.out.println(" Top Scorer(s):");
        for (Student s : topStudents) {
            System.out.printf("   - %s (ID: %s) with %.2f marks [Grade: %s]\n", 
                    s.getStudentName(), s.getStudentId(), s.getMarks(), s.getGrade());
        }

        System.out.println("\n Lowest Scorer(s):");
        for (Student s : bottomStudents) {
            System.out.printf("   - %s (ID: %s) with %.2f marks [Grade: %s]\n", 
                    s.getStudentName(), s.getStudentId(), s.getMarks(), s.getGrade());
        }
        System.out.println("==========================================================================");
    }

    /**
     * Helper to draw a small ASCII progress bar for grade distributions.
     */
    private String getBarGraph(long count, int total) {
        if (total == 0) return "";
        int barLength = 15;
        int filledLength = (int) Math.round(((double) count / total) * barLength);
        StringBuilder bar = new StringBuilder();
        for (int i = 0; i < barLength; i++) {
            if (i < filledLength) {
                bar.append("#");
            } else {
                bar.append("-");
            }
        }
        return bar.toString();
    }
}
