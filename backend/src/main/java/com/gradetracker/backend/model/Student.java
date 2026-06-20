package com.gradetracker.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * Entity class representing a Student record in the database.
 * Formulates the table structure and input validation constraints.
 */
@Entity
public class Student {

    @Id
    @NotBlank(message = "Student ID cannot be empty.")
    private String studentId;

    @NotBlank(message = "Student Name cannot be empty.")
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "Name can only contain letters, spaces, hyphens, and apostrophes.")
    private String studentName;

    @NotNull(message = "Marks cannot be empty.")
    @Min(value = 0, message = "Marks cannot be less than 0.0.")
    @Max(value = 100, message = "Marks cannot be greater than 100.0.")
    private Double marks;

    /**
     * Default constructor (required by JPA).
     */
    public Student() {
    }

    /**
     * All-arguments constructor.
     */
    public Student(String studentId, String studentName, Double marks) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.marks = marks;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId != null ? studentId.trim() : null;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName != null ? studentName.trim() : null;
    }

    public Double getMarks() {
        return marks;
    }

    public void setMarks(Double marks) {
        this.marks = marks;
    }

    /**
     * Computes the grade letter dynamically. 
     * Jackson will serialize this as a 'grade' field in the JSON response.
     */
    public String getGrade() {
        if (marks == null) {
            return "N/A";
        }
        if (marks >= 90.0) {
            return "A";
        } else if (marks >= 80.0) {
            return "B";
        } else if (marks >= 70.0) {
            return "C";
        } else if (marks >= 60.0) {
            return "D";
        } else {
            return "F";
        }
    }
}
