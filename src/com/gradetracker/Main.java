package com.gradetracker;

import java.util.List;
import java.util.Optional;
import java.util.Scanner;

/**
 * Entry point of the Student Grade Tracker application.
 * Manages the CLI interface, menu navigation, input validation, and exception handling.
 */
public class Main {
    private static final StudentManager manager = new StudentManager();

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        System.out.println("=================================================");
        System.out.println("      WELCOME TO THE STUDENT GRADE TRACKER       ");
        System.out.println("=================================================");

        while (running) {
            printMenu();
            int choice = readIntInput(scanner, "Enter your choice (1-10): ", 1, 10);

            try {
                switch (choice) {
                    case 1 -> addStudentFlow(scanner);
                    case 2 -> viewAllStudentsFlow();
                    case 3 -> searchStudentFlow(scanner);
                    case 4 -> updateStudentMarksFlow(scanner);
                    case 5 -> deleteStudentFlow(scanner);
                    case 6 -> calculateAverageFlow();
                    case 7 -> findHighestFlow();
                    case 8 -> findLowestFlow();
                    case 9 -> generateReportFlow();
                    case 10 -> {
                        System.out.println("\nThank you for using Student Grade Tracker. Goodbye!");
                        running = false;
                    }
                    default -> System.out.println("Invalid option. Please choose a number between 1 and 10.");
                }
            } catch (Exception e) {
                System.out.println("\n[ERROR] An unexpected error occurred: " + e.getMessage());
            }
        }
        scanner.close();
    }

    /**
     * Prints the primary application menu.
     */
    private static void printMenu() {
        System.out.println("\n-------------------------------------------------");
        System.out.println("                  MAIN MENU                      ");
        System.out.println("-------------------------------------------------");
        System.out.println(" 1. Add Student");
        System.out.println(" 2. View All Students");
        System.out.println(" 3. Search Student by ID");
        System.out.println(" 4. Update Student Marks");
        System.out.println(" 5. Delete Student");
        System.out.println(" 6. Calculate Average Marks");
        System.out.println(" 7. Find Highest Marks");
        System.out.println(" 8. Find Lowest Marks");
        System.out.println(" 9. Generate Student Performance Report");
        System.out.println(" 10. Exit");
        System.out.println("-------------------------------------------------");
    }

    /**
     * Flow for adding a new student.
     */
    private static void addStudentFlow(Scanner scanner) {
        System.out.println("\n--- [1] Add New Student ---");
        String id = readStringInput(scanner, "Enter Student ID: ", false);
        
        // Check duplicate early in Main for user convenience
        if (manager.findStudentById(id).isPresent()) {
            System.out.println("[ERROR] A student with ID '" + id + "' already exists. Registration aborted.");
            return;
        }

        String name = readNameInput(scanner, "Enter Student Name: ");
        double marks = readDoubleInput(scanner, "Enter Marks (0.0 - 100.0): ", 0.0, 100.0);

        try {
            Student student = new Student(id, name, marks);
            manager.addStudent(student);
            System.out.println("\n[SUCCESS] Student added successfully!");
            System.out.println(student);
        } catch (IllegalArgumentException e) {
            System.out.println("[ERROR] Failed to add student: " + e.getMessage());
        }
    }

    /**
     * Flow for viewing all students.
     */
    private static void viewAllStudentsFlow() {
        System.out.println("\n--- [2] View All Students ---");
        List<Student> students = manager.getAllStudents();
        if (students.isEmpty()) {
            System.out.println("No student records found. Add some students first!");
            return;
        }

        System.out.println("+------------+---------------------------+--------+-------+");
        System.out.printf("| %-10s | %-25s | %-6s | %-5s |\n", "Student ID", "Student Name", "Marks", "Grade");
        System.out.println("+------------+---------------------------+--------+-------+");
        for (Student s : students) {
            System.out.printf("| %-10s | %-25s | %-6.2f | %-5s |\n", 
                    s.getStudentId(), s.getStudentName(), s.getMarks(), s.getGrade());
        }
        System.out.println("+------------+---------------------------+--------+-------+");
    }

    /**
     * Flow for searching student by ID.
     */
    private static void searchStudentFlow(Scanner scanner) {
        System.out.println("\n--- [3] Search Student by ID ---");
        String id = readStringInput(scanner, "Enter Student ID to search: ", false);
        Optional<Student> studentOpt = manager.findStudentById(id);

        if (studentOpt.isPresent()) {
            System.out.println("\n[FOUND] Student details:");
            System.out.println(studentOpt.get());
        } else {
            System.out.println("[INFO] No student found with ID '" + id + "'.");
        }
    }

    /**
     * Flow for updating student marks.
     */
    private static void updateStudentMarksFlow(Scanner scanner) {
        System.out.println("\n--- [4] Update Student Marks ---");
        String id = readStringInput(scanner, "Enter Student ID to update: ", false);
        Optional<Student> studentOpt = manager.findStudentById(id);

        if (studentOpt.isEmpty()) {
            System.out.println("[ERROR] Student with ID '" + id + "' not found.");
            return;
        }

        System.out.println("Current Record: " + studentOpt.get());
        double newMarks = readDoubleInput(scanner, "Enter New Marks (0.0 - 100.0): ", 0.0, 100.0);

        try {
            manager.updateStudentMarks(id, newMarks);
            System.out.println("[SUCCESS] Marks updated successfully!");
            System.out.println("Updated Record: " + manager.findStudentById(id).orElse(null));
        } catch (IllegalArgumentException e) {
            System.out.println("[ERROR] Update failed: " + e.getMessage());
        }
    }

    /**
     * Flow for deleting a student record.
     */
    private static void deleteStudentFlow(Scanner scanner) {
        System.out.println("\n--- [5] Delete Student ---");
        String id = readStringInput(scanner, "Enter Student ID to delete: ", false);
        Optional<Student> studentOpt = manager.findStudentById(id);

        if (studentOpt.isEmpty()) {
            System.out.println("[ERROR] Student with ID '" + id + "' not found.");
            return;
        }

        System.out.println("Record to Delete: " + studentOpt.get());
        String confirmation = readStringInput(scanner, "Are you sure you want to delete this record? (Y/N): ", false);
        if (confirmation.equalsIgnoreCase("Y") || confirmation.equalsIgnoreCase("YES")) {
            if (manager.deleteStudent(id)) {
                System.out.println("[SUCCESS] Student record deleted successfully.");
            } else {
                System.out.println("[ERROR] Could not delete the student.");
            }
        } else {
            System.out.println("[INFO] Deletion cancelled.");
        }
    }

    /**
     * Flow for calculating and showing class average.
     */
    private static void calculateAverageFlow() {
        System.out.println("\n--- [6] Calculate Average Marks ---");
        List<Student> students = manager.getAllStudents();
        if (students.isEmpty()) {
            System.out.println("No records available to calculate average.");
            return;
        }
        double avg = manager.calculateAverageMarks();
        System.out.printf("The average marks of the class is: %.2f%%\n", avg);
    }

    /**
     * Flow for finding highest scoring students.
     */
    private static void findHighestFlow() {
        System.out.println("\n--- [7] Find Highest Marks ---");
        List<Student> highest = manager.findHighestScoringStudents();
        if (highest.isEmpty()) {
            System.out.println("No student records available.");
            return;
        }
        System.out.printf("Highest Marks: %.2f\n", highest.get(0).getMarks());
        System.out.println("Highest Scoring Student(s):");
        for (Student s : highest) {
            System.out.println(" - " + s);
        }
    }

    /**
     * Flow for finding lowest scoring students.
     */
    private static void findLowestFlow() {
        System.out.println("\n--- [8] Find Lowest Marks ---");
        List<Student> lowest = manager.findLowestScoringStudents();
        if (lowest.isEmpty()) {
            System.out.println("No student records available.");
            return;
        }
        System.out.printf("Lowest Marks: %.2f\n", lowest.get(0).getMarks());
        System.out.println("Lowest Scoring Student(s):");
        for (Student s : lowest) {
            System.out.println(" - " + s);
        }
    }

    /**
     * Flow for generating performance report.
     */
    private static void generateReportFlow() {
        manager.printPerformanceReport();
    }

    /* ==========================================
       ROBUST USER INPUT UTILITIES
       ========================================== */

    /**
     * Reads a non-empty string from console.
     */
    private static String readStringInput(Scanner scanner, String prompt, boolean allowEmpty) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine();
            if (!allowEmpty && (input == null || input.trim().isEmpty())) {
                System.out.println("[ERROR] Input cannot be blank. Please try again.");
                continue;
            }
            return input.trim();
        }
    }

    /**
     * Reads a student name validating it contains only valid alphabetic/space characters.
     */
    private static String readNameInput(Scanner scanner, String prompt) {
        while (true) {
            String name = readStringInput(scanner, prompt, false);
            if (name.matches("^[a-zA-Z\\s'-]+$")) {
                return name;
            }
            System.out.println("[ERROR] Name can only contain letters, spaces, hyphens, and apostrophes.");
        }
    }

    /**
     * Reads an integer within a specific range with exception handling.
     */
    private static int readIntInput(Scanner scanner, String prompt, int min, int max) {
        while (true) {
            System.out.print(prompt);
            String line = scanner.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value >= min && value <= max) {
                    return value;
                }
                System.out.printf("[ERROR] Value must be between %d and %d. Please try again.\n", min, max);
            } catch (NumberFormatException e) {
                System.out.println("[ERROR] Invalid numeric input. Please enter a valid integer.");
            }
        }
    }

    /**
     * Reads a double within a specific range with exception handling.
     */
    private static double readDoubleInput(Scanner scanner, String prompt, double min, double max) {
        while (true) {
            System.out.print(prompt);
            String line = scanner.nextLine().trim();
            try {
                double value = Double.parseDouble(line);
                if (value >= min && value <= max) {
                    return value;
                }
                System.out.printf("[ERROR] Value must be between %.1f and %.1f. Please try again.\n", min, max);
            } catch (NumberFormatException e) {
                System.out.println("[ERROR] Invalid numeric input. Please enter a valid decimal number.");
            }
        }
    }
}
