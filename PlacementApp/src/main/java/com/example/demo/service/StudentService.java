package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {
    @Autowired private StudentRepo studentRepo;
    @Autowired private SkillRepo skillRepo;
    @Autowired private StudentSkillRepo studentSkillRepo;
    @Autowired private CertificationRepo certificationRepo;
    @Autowired private InternshipRepo internshipRepo;

    public Student registerStudent(Student student) { return studentRepo.save(student); }
    public List<Student> getAllStudents() { return studentRepo.findAll(); }
    public Student getStudentById(Long id) { return studentRepo.findById(id).orElseThrow(); }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = getStudentById(id);
        student.setName(studentDetails.getName());
        student.setBranch(studentDetails.getBranch());
        student.setCgpa(studentDetails.getCgpa());
        student.setGraduationYear(studentDetails.getGraduationYear());
        return studentRepo.save(student);
    }

    public void deleteStudent(Long id) { studentRepo.deleteById(id); }
    public List<Student> getStudentsByBranch(String branch) { return studentRepo.findByBranch(branch); }
    public List<Student> getStudentsByReadiness(String level) { return studentRepo.findByReadinessLevel(level); }
    
    public Student calculateReadinessScore(Long id) {
        Student student = getStudentById(id);
        double score = 0;
        if (student.getCgpa() != null) score += student.getCgpa() * 5; // e.g. 9.0 -> 45
        score += student.getSkills().size() * 5; // each skill 5 pts
        score += student.getCertifications().size() * 10;
        score += student.getInternships().size() * 15;
        
        student.setReadinessScore(score > 100 ? 100 : score);
        if (score > 80) student.setReadinessLevel("HIGH");
        else if (score > 50) student.setReadinessLevel("MEDIUM");
        else student.setReadinessLevel("LOW");
        
        return studentRepo.save(student);
    }

    public List<Student> getEligibleStudents(Double cgpa, Integer year) {
        return studentRepo.findByCgpaGreaterThanEqualAndGraduationYear(cgpa, year);
    }

    public StudentSkill addSkillToStudent(Long studentId, Long skillId, String proficiency) {
        Student student = getStudentById(studentId);
        Skill skill = skillRepo.findById(skillId).orElseThrow();
        StudentSkill ss = new StudentSkill();
        ss.setStudent(student);
        ss.setSkill(skill);
        ss.setProficiency(proficiency);
        return studentSkillRepo.save(ss);
    }

    public List<StudentSkill> getStudentSkills(Long studentId) {
        Student student = getStudentById(studentId);
        return student.getSkills();
    }

    public void removeSkillFromStudent(Long studentId, Long skillId) {
        Student student = getStudentById(studentId);
        student.getSkills().removeIf(ss -> ss.getSkill().getId().equals(skillId));
        studentRepo.save(student);
    }

    public Certification addCertification(Long studentId, Certification cert) {
        Student student = getStudentById(studentId);
        cert.setStudent(student);
        return certificationRepo.save(cert);
    }

    public List<Certification> getStudentCertifications(Long studentId) {
        return getStudentById(studentId).getCertifications();
    }

    public void deleteCertification(Long certId) { certificationRepo.deleteById(certId); }

    public Internship addInternship(Long studentId, Internship internship) {
        Student student = getStudentById(studentId);
        internship.setStudent(student);
        return internshipRepo.save(internship);
    }

    public List<Internship> getStudentInternships(Long studentId) {
        return getStudentById(studentId).getInternships();
    }

    public void deleteInternship(Long internshipId) { internshipRepo.deleteById(internshipId); }
}
