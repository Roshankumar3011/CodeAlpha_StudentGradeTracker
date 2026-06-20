package com.gradetracker.backend.dto;

/**
 * Data Transfer Object (DTO) containing aggregated statistics of class-wide performance.
 */
public class PerformanceReport {
    private int totalStudents;
    private double averageMarks;
    private double highestMarks;
    private double lowestMarks;
    private long passCount;
    private long failCount;
    private double passRate;
    private long gradeACount;
    private long gradeBCount;
    private long gradeCCount;
    private long gradeDCount;
    private long gradeFCount;

    public PerformanceReport() {
    }

    public PerformanceReport(int totalStudents, double averageMarks, double highestMarks, double lowestMarks,
                             long passCount, long failCount, double passRate, long gradeACount, long gradeBCount,
                             long gradeCCount, long gradeDCount, long gradeFCount) {
        this.totalStudents = totalStudents;
        this.averageMarks = averageMarks;
        this.highestMarks = highestMarks;
        this.lowestMarks = lowestMarks;
        this.passCount = passCount;
        this.failCount = failCount;
        this.passRate = passRate;
        this.gradeACount = gradeACount;
        this.gradeBCount = gradeBCount;
        this.gradeCCount = gradeCCount;
        this.gradeDCount = gradeDCount;
        this.gradeFCount = gradeFCount;
    }

    // Getters and Setters

    public int getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(int totalStudents) {
        this.totalStudents = totalStudents;
    }

    public double getAverageMarks() {
        return averageMarks;
    }

    public void setAverageMarks(double averageMarks) {
        this.averageMarks = averageMarks;
    }

    public double getHighestMarks() {
        return highestMarks;
    }

    public void setHighestMarks(double highestMarks) {
        this.highestMarks = highestMarks;
    }

    public double getLowestMarks() {
        return lowestMarks;
    }

    public void setLowestMarks(double lowestMarks) {
        this.lowestMarks = lowestMarks;
    }

    public long getPassCount() {
        return passCount;
    }

    public void setPassCount(long passCount) {
        this.passCount = passCount;
    }

    public long getFailCount() {
        return failCount;
    }

    public void setFailCount(long failCount) {
        this.failCount = failCount;
    }

    public double getPassRate() {
        return passRate;
    }

    public void setPassRate(double passRate) {
        this.passRate = passRate;
    }

    public long getGradeACount() {
        return gradeACount;
    }

    public void setGradeACount(long gradeACount) {
        this.gradeACount = gradeACount;
    }

    public long getGradeBCount() {
        return gradeBCount;
    }

    public void setGradeBCount(long gradeBCount) {
        this.gradeBCount = gradeBCount;
    }

    public long getGradeCCount() {
        return gradeCCount;
    }

    public void setGradeCCount(long gradeCCount) {
        this.gradeCCount = gradeCCount;
    }

    public long getGradeDCount() {
        return gradeDCount;
    }

    public void setGradeDCount(long gradeDCount) {
        this.gradeDCount = gradeDCount;
    }

    public long getGradeFCount() {
        return gradeFCount;
    }

    public void setGradeFCount(long gradeFCount) {
        this.gradeFCount = gradeFCount;
    }
}
