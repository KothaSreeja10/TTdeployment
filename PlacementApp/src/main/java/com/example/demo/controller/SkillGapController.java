package com.example.demo.controller;
import com.example.demo.entity.SkillGapReport;
import com.example.demo.service.SkillGapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/skill-gap") @CrossOrigin(origins="*")
public class SkillGapController {
    @Autowired private SkillGapService skillGapService;
    @PostMapping("/analyze") public ResponseEntity<SkillGapReport> analyze(@RequestParam("studentId") Long studentId,@RequestParam("jobRoleId") Long jobRoleId){return ResponseEntity.ok(skillGapService.analyzeSkillGap(studentId,jobRoleId));}
    @GetMapping("/report/{id}") public ResponseEntity<SkillGapReport> getById(@PathVariable("id") Long id){return ResponseEntity.ok(skillGapService.getReportById(id));}
    @GetMapping("/student/{studentId}") public ResponseEntity<List<SkillGapReport>> getByStudent(@PathVariable("studentId") Long studentId){return ResponseEntity.ok(skillGapService.getReportsByStudent(studentId));}
    @GetMapping("/job/{jobRoleId}") public ResponseEntity<List<SkillGapReport>> getByJob(@PathVariable("jobRoleId") Long jobRoleId){return ResponseEntity.ok(skillGapService.getReportsByJobRole(jobRoleId));}
    @GetMapping("/all") public ResponseEntity<List<SkillGapReport>> getAll(){return ResponseEntity.ok(skillGapService.getAllReports());}
    @GetMapping("/high-match") public ResponseEntity<List<SkillGapReport>> getHighMatch(@RequestParam(value="minPercentage", defaultValue="70.0") Double minPercentage){return ResponseEntity.ok(skillGapService.getHighMatchReports(minPercentage));}
}
