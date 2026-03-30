package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CompanyService {
    @Autowired private CompanyRepo companyRepo;
    @Autowired private JobRoleRepo jobRoleRepo;
    @Autowired private SkillRepo skillRepo;
    @Autowired private JobRoleSkillRepo jobRoleSkillRepo;

    public Company addCompany(Company company) { return companyRepo.save(company); }
    public List<Company> getAllCompanies() { return companyRepo.findAll(); }
    public Company getCompanyById(Long id) { return companyRepo.findById(id).orElseThrow(); }
    
    public Company updateCompany(Long id, Company company) {
        Company existing = getCompanyById(id);
        existing.setName(company.getName());
        existing.setLocation(company.getLocation());
        existing.setWebsite(company.getWebsite());
        return companyRepo.save(existing);
    }
    
    public void deleteCompany(Long id) { companyRepo.deleteById(id); }

    public JobRole addJobRole(Long companyId, JobRole jobRole) {
        Company company = getCompanyById(companyId);
        jobRole.setCompany(company);
        return jobRoleRepo.save(jobRole);
    }
    
    public List<JobRole> getAllJobRoles() { return jobRoleRepo.findAll(); }
    public List<JobRole> getJobsByCompany(Long companyId) { return jobRoleRepo.findByCompanyId(companyId); }
    public JobRole getJobRoleById(Long jobId) { return jobRoleRepo.findById(jobId).orElseThrow(); }
    public List<JobRole> getEligibleJobs(Double cgpa, Integer year) { return jobRoleRepo.findByMinCgpaLessThanEqualAndTargetBatchYearGreaterThanEqual(cgpa, year); }
    public void deleteJobRole(Long jobId) { jobRoleRepo.deleteById(jobId); }

    public JobRole addSkillToJobRole(Long jobId, Long skillId, Double weightage, Boolean mandatory) {
        JobRole jobRole = getJobRoleById(jobId);
        Skill skill = skillRepo.findById(skillId).orElseThrow();
        JobRoleSkill jrs = new JobRoleSkill();
        jrs.setJobRole(jobRole);
        jrs.setSkill(skill);
        jrs.setWeightage(weightage);
        jrs.setMandatory(mandatory);
        jobRoleSkillRepo.save(jrs);
        return getJobRoleById(jobId);
    }
}
