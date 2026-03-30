package com.example.demo.repo;

import com.example.demo.entity.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentSkillRepo extends JpaRepository<StudentSkill, Long> {
}
