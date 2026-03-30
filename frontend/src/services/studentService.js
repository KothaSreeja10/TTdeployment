import api from './api';

export const studentService = {
  // Student basic info
  getAllStudents: () => api.get('/students'),
  getStudentById: (id) => api.get(`/students/${id}`),
  getStudentByEmail: (email) => api.get(`/students/email/${email}`),
  registerStudent: (student) => api.post('/students', student),
  updateStudent: (id, student) => api.put(`/students/${id}`, student),
  deleteStudent: (id) => api.delete(`/students/${id}`),
  getStudentsByBranch: (branch) => api.get(`/students/branch/${branch}`),
  getStudentsByReadiness: (level) => api.get(`/students/readiness/${level}`),
  calculateReadinessScore: (id) => api.get(`/students/${id}/readiness-score`),
  getEligibleStudents: (cgpa, year) => api.get(`/students/eligible`, { params: { cgpa, year } }),

  // Student skills
  getStudentSkills: (id) => api.get(`/students/${id}/skills`),
  addSkillToStudent: (id, skillId, proficiency = 'INTERMEDIATE') => 
    api.post(`/students/${id}/skills`, null, { params: { skillId, proficiency } }),
  removeSkillFromStudent: (id, skillId) => api.delete(`/students/${id}/skills/${skillId}`),

  // Student certifications
  getStudentCertifications: (id) => api.get(`/students/${id}/certifications`),
  addCertification: (id, cert) => api.post(`/students/${id}/certifications`, cert),
  deleteCertification: (certId) => api.delete(`/students/certifications/${certId}`),

  // Student internships
  getStudentInternships: (id) => api.get(`/students/${id}/internships`),
  addInternship: (id, internship) => api.post(`/students/${id}/internships`, internship),
  deleteInternship: (internshipId) => api.delete(`/students/internships/${internshipId}`)
};
