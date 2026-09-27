import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fintrox.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.userMessage = 'Server is waking up. This takes about 30 seconds on the first request. Please wait...';
    } else if (!error.response) {
      error.userMessage = 'Cannot reach the server. Please check your connection.';
    } else if (error.response?.status === 401) {
      error.userMessage = error.response?.data?.message || 'Invalid credentials';
    } else {
      error.userMessage = error.response?.data?.message || 'Something went wrong';
    }
    return Promise.reject(error);
  }
);

export default api;