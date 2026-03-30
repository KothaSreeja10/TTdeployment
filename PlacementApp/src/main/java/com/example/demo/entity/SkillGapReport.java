package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
public class SkillGapReport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "job_role_id")
    private JobRole jobRole;

    private Double matchPercentage;
    
    @Column(columnDefinition = "TEXT")
    private String gapAnalysis;

    public SkillGapReport() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public JobRole getJobRole() { return jobRole; }
    public void setJobRole(JobRole jobRole) { this.jobRole = jobRole; }

    public Double getMatchPercentage() { return matchPercentage; }
    public void setMatchPercentage(Double matchPercentage) { this.matchPercentage = matchPercentage; }

    public String getGapAnalysis() { return gapAnalysis; }
    public void setGapAnalysis(String gapAnalysis) { this.gapAnalysis = gapAnalysis; }
}
