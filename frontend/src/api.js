import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ttdeployment-tmof.onrender.com/api',
});

export default api;
