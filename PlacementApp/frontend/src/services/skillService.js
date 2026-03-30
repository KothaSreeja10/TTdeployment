import api from './api';

export const skillService = {
  getAllSkills: () => api.get('/skills'),
  getSkillById: (id) => api.get(`/skills/${id}`),
  getSkillsByCategory: (category) => api.get(`/skills/category/${category}`),
  addSkill: (skill) => api.post('/skills', skill),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};
