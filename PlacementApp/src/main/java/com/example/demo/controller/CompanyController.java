package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "*")
public class CompanyController {
    @Autowired
    private CompanyService companyService;

    @PostMapping
    public ResponseEntity<Company> add(@RequestBody Company company) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.addCompany(company));
    }

    @GetMapping
    public ResponseEntity<List<Company>> getAll() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Company> update(@PathVariable("id") Long id, @RequestBody Company company) {
        return ResponseEntity.ok(companyService.updateCompany(id, company));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.ok("Deleted");
    }

    @PostMapping("/{id}/jobs")
    public ResponseEntity<JobRole> addJob(@PathVariable("id") Long id, @RequestBody JobRole jobRole) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.addJobRole(id, jobRole));
    }

    @GetMapping("/all-jobs")
    public ResponseEntity<List<JobRole>> getAllJobs() {
        return ResponseEntity.ok(companyService.getAllJobRoles());
    }

    @GetMapping("/{id}/jobs")
    public ResponseEntity<List<JobRole>> getJobsByCompany(@PathVariable("id") Long id) {
        return ResponseEntity.ok(companyService.getJobsByCompany(id));
    }

    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<JobRole> getJobById(@PathVariable("jobId") Long jobId) {
        return ResponseEntity.ok(companyService.getJobRoleById(jobId));
    }

    @GetMapping("/jobs/eligible")
    public ResponseEntity<List<JobRole>> getEligibleJobs(@RequestParam("cgpa") Double cgpa,
            @RequestParam("year") Integer year) {
        return ResponseEntity.ok(companyService.getEligibleJobs(cgpa, year));
    }

    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<String> deleteJob(@PathVariable("jobId") Long jobId) {
        companyService.deleteJobRole(jobId);
        return ResponseEntity.ok("Deleted");
    }

    @PostMapping("/jobs/{jobId}/skills")
    public ResponseEntity<JobRole> addSkillToJob(@PathVariable("jobId") Long jobId,
            @RequestParam("skillId") Long skillId, @RequestParam("weightage") Double weightage,
            @RequestParam(value = "mandatory", defaultValue = "true") Boolean mandatory) {
        return ResponseEntity.ok(companyService.addSkillToJobRole(jobId, skillId, weightage, mandatory));
    }
}
