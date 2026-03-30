package com.example.demo.repo;

import com.example.demo.entity.SkillGapReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SkillGapReportRepo extends JpaRepository<SkillGapReport, Long> {
    List<SkillGapReport> findByStudentId(Long studentId);
    List<SkillGapReport> findByJobRoleId(Long jobRoleId);
    List<SkillGapReport> findByMatchPercentageGreaterThanEqual(Double matchPercentage);
}
