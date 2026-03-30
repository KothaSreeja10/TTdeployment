import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

/* ─── helpers ───────────────────────────────────────────── */

// gapAnalysis text → { matchedSkills, missingSkills }
function parseGapAnalysis(text = '') {
  const matched = [];
  const missing = [];
  text.split('.').forEach(part => {
    const t = part.trim();
    if (t.startsWith('Match:'))   matched.push(t.replace('Match:', '').trim());
    if (t.startsWith('Gap: Missing')) missing.push(t.replace('Gap: Missing', '').trim());
  });
  return {
    matchedSkills: matched.filter(Boolean).join(', '),
    missingSkills: missing.filter(Boolean).join(', '),
    recommendations: [],
  };
}

// map backend job → frontend shape (salaryLpa, minPassoutYear)
function mapJob(j) {
  if (!j) return j;
  return { ...j, salaryLpa: j.ctc ?? 0, minPassoutYear: j.targetBatchYear ?? '' };
}

// map backend cert → frontend shape (certName, issuedBy, issueYear)
function mapCert(c) {
  if (!c) return c;
  return { ...c, certName: c.name, issuedBy: c.issuingOrganization, issueYear: c.issueDate };
}

// map backend internship → frontend shape (duration)
function mapInternship(i) {
  if (!i) return i;
  return { ...i, duration: i.durationMonths };
}

// map backend report → frontend shape
function mapReport(r) {
  if (!r) return r;
  const parsed = parseGapAnalysis(r.gapAnalysis);
  return { ...r, ...parsed };
}

/* ─── Companies ─────────────────────────────────────────── */
export const getAllCompanies = () => api.get('/companies');
export const addCompany      = (data) => api.post('/companies', data);

/* ─── Jobs ──────────────────────────────────────────────── */
export const getAllJobs = async () => {
  const res = await api.get('/companies/all-jobs');
  res.data = (res.data || []).map(mapJob);
  return res;
};

export const addJobRole = (companyId, data) =>
  api.post(`/companies/${companyId}/jobs`, {
    title:           data.title,
    description:     data.description,
    minCgpa:         parseFloat(data.minCgpa) || 0,
    targetBatchYear: parseInt(data.minPassoutYear) || new Date().getFullYear(),
    ctc:             parseFloat(data.salaryLpa) || 0,
  });

export const addSkillToJob = (jobId, skillId, weightage) =>
  api.post(`/companies/jobs/${jobId}/skills?skillId=${skillId}&weightage=${weightage}&mandatory=true`);

/* ─── Skills ────────────────────────────────────────────── */
export const getAllSkills = () => api.get('/skills');
export const addSkill    = (data) => api.post('/skills', data);

/* ─── Students ──────────────────────────────────────────── */
export const getAllStudents    = () => api.get('/students');
export const registerStudent  = (data) => api.post('/students', data);
export const deleteStudent    = (id) => api.delete(`/students/${id}`);
export const getReadinessScore = (id) => api.get(`/students/${id}/readiness-score`);

/* ─── Student Skills ────────────────────────────────────── */
export const addSkillToStudent = (studentId, skillId, proficiency) =>
  api.post(`/students/${studentId}/skills?skillId=${skillId}&proficiency=${proficiency}`);

export const getStudentSkills = (studentId) => api.get(`/students/${studentId}/skills`);

/* ─── Certifications ────────────────────────────────────── */
export const addCertification = (studentId, data) =>
  api.post(`/students/${studentId}/certifications`, {
    name:                data.certName,
    issuingOrganization: data.issuedBy,
    issueDate:           data.issueYear,
  });

export const getCertifications = async (studentId) => {
  const res = await api.get(`/students/${studentId}/certifications`);
  res.data = (res.data || []).map(mapCert);
  return res;
};

/* ─── Internships ───────────────────────────────────────── */
export const addInternship = (studentId, data) =>
  api.post(`/students/${studentId}/internships`, {
    companyName:     data.companyName,
    role:            data.role,
    durationMonths:  data.duration,
  });

export const getInternships = async (studentId) => {
  const res = await api.get(`/students/${studentId}/internships`);
  res.data = (res.data || []).map(mapInternship);
  return res;
};

/* ─── Skill Gap ─────────────────────────────────────────── */
export const analyzeSkillGap = async (studentId, jobRoleId) => {
  const res = await api.post(`/skill-gap/analyze?studentId=${studentId}&jobRoleId=${jobRoleId}`);
  res.data = mapReport(res.data);
  return res;
};

export const getReportsByStudent = async (studentId) => {
  const res = await api.get(`/skill-gap/student/${studentId}`);
  res.data = (res.data || []).map(mapReport);
  return res;
};
