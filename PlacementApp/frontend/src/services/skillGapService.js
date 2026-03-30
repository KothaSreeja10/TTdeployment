import api from './api';

export const skillGapService = {
  analyzeSkillGap: (studentId, jobRoleId) => 
    api.post('/skill-gap/analyze', null, { params: { studentId, jobRoleId } }),
  getReportById: (id) => api.get(`/skill-gap/report/${id}`),
  getReportsByStudent: (studentId) => api.get(`/skill-gap/student/${studentId}`),
  getReportsByJobRole: (jobRoleId) => api.get(`/skill-gap/job/${jobRoleId}`),
  getAllReports: () => api.get('/skill-gap/all'),
  getHighMatchReports: (minPercentage = 70.0) => 
    api.get('/skill-gap/high-match', { params: { minPercentage } })
};
