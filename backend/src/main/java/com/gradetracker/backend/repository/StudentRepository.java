package com.gradetracker.backend.repository;

import com.gradetracker.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Student entities.
 * Handles database operations automatically via Spring Data JPA.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
}
