package com.example.demo.controller;
import com.example.demo.entity.*;
import com.example.demo.repo.StudentRepo;
import com.example.demo.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/students") @CrossOrigin(origins="*")
public class StudentController {
    @Autowired private StudentService studentService;
    @Autowired private StudentRepo studentRepo;
    @PostMapping public ResponseEntity<Student> register(@Valid @RequestBody Student student){return ResponseEntity.status(HttpStatus.CREATED).body(studentService.registerStudent(student));}
    @GetMapping public ResponseEntity<List<Student>> getAll(){return ResponseEntity.ok(studentService.getAllStudents());}
    @GetMapping("/{id}") public ResponseEntity<Student> getById(@PathVariable("id") Long id){return ResponseEntity.ok(studentService.getStudentById(id));}
    @GetMapping("/email/{email}") public ResponseEntity<Student> getByEmail(@PathVariable("email") String email){return studentRepo.findByEmailIgnoreCase(email).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());}
    @PutMapping("/{id}") public ResponseEntity<Student> update(@PathVariable("id") Long id,@RequestBody Student student){return ResponseEntity.ok(studentService.updateStudent(id,student));}
    @DeleteMapping("/{id}") public ResponseEntity<String> delete(@PathVariable("id") Long id){studentService.deleteStudent(id);return ResponseEntity.ok("Deleted");}
    @GetMapping("/branch/{branch}") public ResponseEntity<List<Student>> getByBranch(@PathVariable("branch") String branch){return ResponseEntity.ok(studentService.getStudentsByBranch(branch));}
    @GetMapping("/readiness/{level}") public ResponseEntity<List<Student>> getByReadiness(@PathVariable("level") String level){return ResponseEntity.ok(studentService.getStudentsByReadiness(level));}
    @GetMapping("/{id}/readiness-score") public ResponseEntity<Student> getScore(@PathVariable("id") Long id){return ResponseEntity.ok(studentService.calculateReadinessScore(id));}
    @GetMapping("/eligible") public ResponseEntity<List<Student>> getEligible(@RequestParam("cgpa") Double cgpa,@RequestParam("year") Integer year){return ResponseEntity.ok(studentService.getEligibleStudents(cgpa,year));}
    @PostMapping("/{id}/skills") public ResponseEntity<StudentSkill> addSkill(@PathVariable("id") Long id,@RequestParam("skillId") Long skillId,@RequestParam(value="proficiency", defaultValue="INTERMEDIATE") String proficiency){return ResponseEntity.ok(studentService.addSkillToStudent(id,skillId,proficiency));}
    @GetMapping("/{id}/skills") public ResponseEntity<List<StudentSkill>> getSkills(@PathVariable("id") Long id){return ResponseEntity.ok(studentService.getStudentSkills(id));}
    @DeleteMapping("/{id}/skills/{skillId}") public ResponseEntity<String> removeSkill(@PathVariable("id") Long id,@PathVariable("skillId") Long skillId){studentService.removeSkillFromStudent(id,skillId);return ResponseEntity.ok("Removed");}
    @PostMapping("/{id}/certifications") public ResponseEntity<Certification> addCert(@PathVariable("id") Long id,@RequestBody Certification cert){return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addCertification(id,cert));}
    @GetMapping("/{id}/certifications") public ResponseEntity<List<Certification>> getCerts(@PathVariable("id") Long id){return ResponseEntity.ok(studentService.getStudentCertifications(id));}
    @DeleteMapping("/certifications/{certId}") public ResponseEntity<String> deleteCert(@PathVariable("certId") Long certId){studentService.deleteCertification(certId);return ResponseEntity.ok("Deleted");}
    @PostMapping("/{id}/internships") public ResponseEntity<Internship> addInternship(@PathVariable("id") Long id,@RequestBody Internship internship){return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addInternship(id,internship));}
    @GetMapping("/{id}/internships") public ResponseEntity<List<Internship>> getInternships(@PathVariable("id") Long id){return ResponseEntity.ok(studentService.getStudentInternships(id));}
    @DeleteMapping("/internships/{internshipId}") public ResponseEntity<String> deleteInternship(@PathVariable("internshipId") Long internshipId){studentService.deleteInternship(internshipId);return ResponseEntity.ok("Deleted");}
}
