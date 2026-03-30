package com.example.demo.controller;
import com.example.demo.entity.Skill;
import com.example.demo.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/skills") @CrossOrigin(origins="*")
public class SkillController {
    @Autowired private SkillService skillService;
    @PostMapping public ResponseEntity<Skill> add(@RequestBody Skill skill){return ResponseEntity.status(HttpStatus.CREATED).body(skillService.addSkill(skill));}
    @GetMapping public ResponseEntity<List<Skill>> getAll(){return ResponseEntity.ok(skillService.getAllSkills());}
    @GetMapping("/{id}") public ResponseEntity<Skill> getById(@PathVariable("id") Long id){return ResponseEntity.ok(skillService.getSkillById(id));}
    @GetMapping("/category/{category}") public ResponseEntity<List<Skill>> getByCategory(@PathVariable("category") String category){return ResponseEntity.ok(skillService.getSkillsByCategory(category));}
    @DeleteMapping("/{id}") public ResponseEntity<String> delete(@PathVariable("id") Long id){skillService.deleteSkill(id);return ResponseEntity.ok("Deleted");}
}
