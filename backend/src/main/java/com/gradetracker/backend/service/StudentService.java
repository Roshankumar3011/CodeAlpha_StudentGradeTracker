package com.gradetracker.backend.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gradetracker.backend.dto.PerformanceReport;
import com.gradetracker.backend.exception.ResourceNotFoundException;
import com.gradetracker.backend.model.Student;
import com.gradetracker.backend.repository.StudentRepository;

import jakarta.annotation.PostConstruct;

/**
 * Service class handling Student operations and calculations.
 * Implements CRUD actions and computes class aggregations.
 */
@Service
public class StudentService {

    private final StudentRepository repository;

    @Autowired
    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    /**
     * Pre-populates the database with some sample students for easy demonstration.
     */
    @PostConstruct
    public void seedDatabase() {
        if (repository.count() == 0) {
            repository.save(new Student("S101", "Jane Doe", 94.5));
            repository.save(new Student("S102", "Bob Smith", 82.0));
            repository.save(new Student("S103", "Alice Cooper", 58.5));
            repository.save(new Student("S104", "Charlie Brown", 71.0));
            repository.save(new Student("S105", "Diana Prince", 89.5));
        }
    }

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Student getStudentById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student with ID '" + id + "' not found."));
    }

    public Student addStudent(Student student) {
        if (repository.existsById(student.getStudentId())) {
            throw new IllegalArgumentException("Student with ID '" + student.getStudentId() + "' already exists.");
        }
        return repository.save(student);
    }

    public Student updateStudentMarks(String id, Double newMarks) {
        Student student = getStudentById(id);
        student.setMarks(newMarks);
        return repository.save(student);
    }

    public void deleteStudent(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student with ID '" + id + "' not found.");
        }
        repository.deleteById(id);
    }

    public double calculateAverageMarks() {
        List<Student> students = repository.findAll();
        if (students.isEmpty()) {
            return 0.0;
        }
        return students.stream()
                .mapToDouble(Student::getMarks)
                .average()
                .orElse(0.0);
    }

    public double findHighestMarks() {
        List<Student> students = repository.findAll();
        return students.stream()
                .mapToDouble(Student::getMarks)
                .max()
                .orElse(0.0);
    }

    public double findLowestMarks() {
        List<Student> students = repository.findAll();
        return students.stream()
                .mapToDouble(Student::getMarks)
                .min()
                .orElse(0.0);
    }

    public PerformanceReport generatePerformanceReport() {
        List<Student> students = repository.findAll();
        int total = students.size();
        
        if (total == 0) {
            return new PerformanceReport(0, 0.0, 0.0, 0.0, 0, 0, 0.0, 0, 0, 0, 0, 0);
        }

        double average = calculateAverageMarks();
        double highest = findHighestMarks();
        double lowest = findLowestMarks();

        long passCount = students.stream().filter(s -> s.getMarks() >= 60.0).count();
        long failCount = total - passCount;
        double passRate = ((double) passCount / total) * 100.0;

        long countA = students.stream().filter(s -> s.getGrade().equals("A")).count();
        long countB = students.stream().filter(s -> s.getGrade().equals("B")).count();
        long countC = students.stream().filter(s -> s.getGrade().equals("C")).count();
        long countD = students.stream().filter(s -> s.getGrade().equals("D")).count();
        long countF = students.stream().filter(s -> s.getGrade().equals("F")).count();

        return new PerformanceReport(
                total, average, highest, lowest,
                passCount, failCount, passRate,
                countA, countB, countC, countD, countF
        );
    }
}
