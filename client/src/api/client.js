import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('swasthsetu_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network request failed';
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('swasthsetu_token');
      localStorage.removeItem('swasthsetu_user');
      window.location.href = '/login';
    }
    return Promise.reject(new Error(message));
  }
);

export default api;

