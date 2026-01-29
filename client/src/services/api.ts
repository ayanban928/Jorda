import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  signup: (email: string, password: string) => 
    api.post('/auth/signup', { email, password }),
};

// Sheets endpoints
export const sheetsAPI = {
  getAll: () => api.get('/sheets'),
  create: (name: string) => api.post('/sheets', { name }),
  delete: (id: string) => api.delete(`/sheets/${id}`),
};

// Jobs endpoints
export const jobsAPI = {
  getBySheet: (sheetId: string) => api.get(`/jobs/sheet/${sheetId}`),
  create: (jobData: any) => api.post('/jobs', jobData),
  delete: (id: string) => api.delete(`/jobs/${id}`),
};

export default api;