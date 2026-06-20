package com.gradetracker;

/**
 * Represents a student with an ID, name, and marks.
 * Enforces validation rules on the attributes through its constructor and setters.
 */
public class Student {
    private String studentId;
    private String studentName;
    private double marks;

    /**
     * Constructs a Student object with validated inputs.
     *
     * @param studentId   The unique ID of the student.
     * @param studentName The name of the student.
     * @param marks       The marks scored by the student (0.0 to 100.0).
     * @throws IllegalArgumentException If any input parameter is invalid.
     */
    public Student(String studentId, String studentName, double marks) {
        setStudentId(studentId);
        setStudentName(studentName);
        setMarks(marks);
    }

    public String getStudentId() {
        return studentId;
    }

    /**
     * Sets and validates the student ID.
     *
     * @param studentId The student ID.
     * @throws IllegalArgumentException If ID is null or empty.
     */
    public void setStudentId(String studentId) {
        if (studentId == null || studentId.trim().isEmpty()) {
            throw new IllegalArgumentException("Student ID cannot be null or empty.");
        }
        this.studentId = studentId.trim();
    }

    public String getStudentName() {
        return studentName;
    }

    /**
     * Sets and validates the student name.
     *
     * @param studentName The student name.
     * @throws IllegalArgumentException If the name is empty or contains non-alphabetic characters (except spaces).
     */
    public void setStudentName(String studentName) {
        if (studentName == null || studentName.trim().isEmpty()) {
            throw new IllegalArgumentException("Student name cannot be null or empty.");
        }
        String cleanName = studentName.trim();
        // Regex to check if the name contains only letters, spaces, and optionally hyphens/apostrophes
        if (!cleanName.matches("^[a-zA-Z\\s'-]+$")) {
            throw new IllegalArgumentException("Student name can only contain letters, spaces, hyphens, and apostrophes.");
        }
        this.studentName = cleanName;
    }

    public double getMarks() {
        return marks;
    }

    /**
     * Sets and validates the student marks.
     *
     * @param marks The student marks.
     * @throws IllegalArgumentException If the marks are not in the range [0.0, 100.0].
     */
    public void setMarks(double marks) {
        if (marks < 0.0 || marks > 100.0) {
            throw new IllegalArgumentException("Marks must be between 0.0 and 100.0 (inclusive).");
        }
        this.marks = marks;
    }

    /**
     * Calculates the letter grade of the student based on marks.
     *
     * @return A character grade (A, B, C, D, or F).
     */
    public char getGrade() {
        if (marks >= 90.0) {
            return 'A';
        } else if (marks >= 80.0) {
            return 'B';
        } else if (marks >= 70.0) {
            return 'C';
        } else if (marks >= 60.0) {
            return 'D';
        } else {
            return 'F';
        }
    }

    @Override
    public String toString() {
        return String.format("ID: %-10s | Name: %-25s | Marks: %-6.2f | Grade: %s", 
                studentId, studentName, marks, getGrade());
    }
}
