package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillGapService {
    @Autowired private SkillGapReportRepo reportRepo;
    @Autowired private StudentRepo studentRepo;
    @Autowired private JobRoleRepo jobRoleRepo;

    public SkillGapReport analyzeSkillGap(Long studentId, Long jobRoleId) {
        Student student = studentRepo.findById(studentId).orElseThrow();
        JobRole jobRole = jobRoleRepo.findById(jobRoleId).orElseThrow();

        List<String> studentSkillNames = student.getSkills().stream()
                .map(ss -> ss.getSkill().getName().toLowerCase())
                .collect(Collectors.toList());

        List<JobRoleSkill> requiredSkills = jobRole.getRequiredSkills();
        int totalSkills = requiredSkills.size();
        int matchedSkills = 0;
        
        StringBuilder gapAnalysis = new StringBuilder();

        if (totalSkills == 0) {
            gapAnalysis.append("No specific skills required for this role.");
        } else {
            for (JobRoleSkill req : requiredSkills) {
                String reqSkillName = req.getSkill().getName().toLowerCase();
                if (studentSkillNames.contains(reqSkillName)) {
                    matchedSkills++;
                    gapAnalysis.append("Match: ").append(reqSkillName).append(". ");
                } else {
                    gapAnalysis.append("Gap: Missing ").append(reqSkillName).append(". ");
                }
            }
        }

        double matchPercentage = totalSkills > 0 ? ((double) matchedSkills / totalSkills) * 100 : 100.0;

        SkillGapReport report = new SkillGapReport();
        report.setStudent(student);
        report.setJobRole(jobRole);
        report.setMatchPercentage(matchPercentage);
        report.setGapAnalysis(gapAnalysis.toString());

        return reportRepo.save(report);
    }

    public SkillGapReport getReportById(Long id) { return reportRepo.findById(id).orElseThrow(); }
    public List<SkillGapReport> getReportsByStudent(Long studentId) { return reportRepo.findByStudentId(studentId); }
    public List<SkillGapReport> getReportsByJobRole(Long jobRoleId) { return reportRepo.findByJobRoleId(jobRoleId); }
    public List<SkillGapReport> getAllReports() { return reportRepo.findAll(); }
    public List<SkillGapReport> getHighMatchReports(Double minPercentage) { return reportRepo.findByMatchPercentageGreaterThanEqual(minPercentage); }
}
