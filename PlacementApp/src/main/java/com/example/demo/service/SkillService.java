package com.example.demo.service;

import com.example.demo.entity.Skill;
import com.example.demo.repo.SkillRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SkillService {
    @Autowired private SkillRepo skillRepo;

    public Skill addSkill(Skill skill) { return skillRepo.save(skill); }
    public List<Skill> getAllSkills() { return skillRepo.findAll(); }
    public Skill getSkillById(Long id) { return skillRepo.findById(id).orElseThrow(); }
    public List<Skill> getSkillsByCategory(String category) { return skillRepo.findByCategory(category); }
    public void deleteSkill(Long id) { skillRepo.deleteById(id); }
}
