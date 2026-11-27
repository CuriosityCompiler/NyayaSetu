import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token to outbound requests if present
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nyaya_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle unauthorized statuses cleanly
api.interceptors.response.use(
  (response) => {
    // If backend uses TransformInterceptor with { ok: true, data: ... }, unwrap it
    if (response.data && response.data.ok === true && response.data.data !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      error.config?.url !== '/auth/me'
    ) {
      localStorage.removeItem('nyaya_access_token');
      localStorage.removeItem('nyaya_refresh_token');
      localStorage.removeItem('nyaya_user');
      window.dispatchEvent(new Event('nyaya:unauthorized'));
    }
    return Promise.reject(error);
  },
);

export default api;
