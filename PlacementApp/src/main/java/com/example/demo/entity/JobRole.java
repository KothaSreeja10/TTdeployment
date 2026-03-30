package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
public class JobRole {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private Double ctc;
    private Double minCgpa;
    private Integer targetBatchYear;
    
    @ManyToOne
    @JoinColumn(name = "company_id")
    @JsonIgnore
    private Company company;

    @OneToMany(mappedBy = "jobRole", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobRoleSkill> requiredSkills = new ArrayList<>();

    public JobRole() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getCtc() { return ctc; }
    public void setCtc(Double ctc) { this.ctc = ctc; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public Integer getTargetBatchYear() { return targetBatchYear; }
    public void setTargetBatchYear(Integer targetBatchYear) { this.targetBatchYear = targetBatchYear; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public List<JobRoleSkill> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<JobRoleSkill> requiredSkills) { this.requiredSkills = requiredSkills; }
}
