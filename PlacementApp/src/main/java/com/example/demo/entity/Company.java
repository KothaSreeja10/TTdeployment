package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Company {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String industry;
    private String location;
    private String website;
    private String hrEmail;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<JobRole> jobRoles;

    public Company() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getHrEmail() { return hrEmail; }
    public void setHrEmail(String hrEmail) { this.hrEmail = hrEmail; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    
    public List<JobRole> getJobRoles() { return jobRoles; }
    public void setJobRoles(List<JobRole> jobRoles) { this.jobRoles = jobRoles; }
}
