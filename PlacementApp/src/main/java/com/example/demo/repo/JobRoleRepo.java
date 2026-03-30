package com.example.demo.repo;

import com.example.demo.entity.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRoleRepo extends JpaRepository<JobRole, Long> {
    List<JobRole> findByCompanyId(Long companyId);
    List<JobRole> findByMinCgpaLessThanEqualAndTargetBatchYearGreaterThanEqual(Double cgpa, Integer year);
}
