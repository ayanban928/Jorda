import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
});

export const jobsAPI = axios.create({
  baseURL: `${API_BASE_URL}/jobs`,
});

export const sheetsAPI = axios.create({
  baseURL: `${API_BASE_URL}/sheets`,
});

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to all requests
const addAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

addAuthInterceptor(api);
addAuthInterceptor(authAPI);
addAuthInterceptor(jobsAPI);
addAuthInterceptor(sheetsAPI);