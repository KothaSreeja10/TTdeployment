package com.example.demo.repo;

import com.example.demo.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SkillRepo extends JpaRepository<Skill, Long> {
    List<Skill> findByCategory(String category);
}
