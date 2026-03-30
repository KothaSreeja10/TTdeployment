package com.example.demo.repo;

import com.example.demo.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface StudentRepo extends JpaRepository<Student, Long> {
    Optional<Student> findByEmailIgnoreCase(String email);
    List<Student> findByBranch(String branch);
    List<Student> findByReadinessLevel(String level);
    List<Student> findByCgpaGreaterThanEqualAndGraduationYear(Double cgpa, Integer year);
}
