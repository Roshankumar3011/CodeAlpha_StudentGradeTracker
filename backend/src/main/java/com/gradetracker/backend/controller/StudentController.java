package com.gradetracker.backend.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gradetracker.backend.dto.PerformanceReport;
import com.gradetracker.backend.model.Student;
import com.gradetracker.backend.service.StudentService;

import jakarta.validation.Valid;

/**
 * REST Controller providing API endpoints for Student Grade Tracker actions.
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService service;

    @Autowired
    public StudentController(StudentService service) {
        this.service = service;
    }

    /**
     * Retrieves all registered students.
     */
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(service.getAllStudents());
    }

    /**
     * Searches and retrieves a student by their ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable String id) {
        return ResponseEntity.ok(service.getStudentById(id));
    }

    /**
     * Registers a new student.
     */
    @PostMapping
    public ResponseEntity<Student> addStudent(@Valid @RequestBody Student student) {
        Student created = service.addStudent(student);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Updates the marks of an existing student.
     */
    @PutMapping("/{id}/marks")
    public ResponseEntity<Student> updateStudentMarks(@PathVariable String id, @RequestBody Double marks) {
        if (marks == null || marks < 0.0 || marks > 100.0) {
            throw new IllegalArgumentException("Marks must be between 0.0 and 100.0 (inclusive).");
        }
        Student updated = service.updateStudentMarks(id, marks);
        return ResponseEntity.ok(updated);
    }

    /**
     * Deletes a student by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String id) {
        service.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Calculates the class average marks.
     */
    @GetMapping("/average")
    public ResponseEntity<Double> getAverageMarks() {
        return ResponseEntity.ok(service.calculateAverageMarks());
    }

    /**
     * Gets the highest marks in the class.
     */
    @GetMapping("/highest")
    public ResponseEntity<Double> getHighestMarks() {
        return ResponseEntity.ok(service.findHighestMarks());
    }

    /**
     * Gets the lowest marks in the class.
     */
    @GetMapping("/lowest")
    public ResponseEntity<Double> getLowestMarks() {
        return ResponseEntity.ok(service.findLowestMarks());
    }

    /**
     * Generates a complete performance report of the class.
     */
    @GetMapping("/report")
    public ResponseEntity<PerformanceReport> getPerformanceReport() {
        return ResponseEntity.ok(service.generatePerformanceReport());
    }
}
