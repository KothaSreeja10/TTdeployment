import api from './api';

export const companyService = {
  // Company endpoints
  getAllCompanies: () => api.get('/companies'),
  getCompanyById: (id) => api.get(`/companies/${id}`),
  addCompany: (company) => api.post('/companies', company),
  updateCompany: (id, company) => api.put(`/companies/${id}`, company),
  deleteCompany: (id) => api.delete(`/companies/${id}`),

  // Job endpoints (within company controller)
  getAllJobRoles: () => api.get('/companies/all-jobs'),
  getJobsByCompany: (companyId) => api.get(`/companies/${companyId}/jobs`),
  getJobRoleById: (jobId) => api.get(`/companies/jobs/${jobId}`),
  addJobRole: (companyId, jobRole) => api.post(`/companies/${companyId}/jobs`, jobRole),
  deleteJobRole: (jobId) => api.delete(`/companies/jobs/${jobId}`),
  getEligibleJobs: (cgpa, year) => api.get(`/companies/jobs/eligible`, { params: { cgpa, year } }),
  
  // Job skills
  addSkillToJobRole: (jobId, skillId, weightage, mandatory = true) => 
    api.post(`/companies/jobs/${jobId}/skills`, null, { params: { skillId, weightage, mandatory } })
};
