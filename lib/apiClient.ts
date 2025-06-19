// src/lib/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: To add the auth token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor for logging and handling 401s gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    if (error.response) {
      const status = error.response.status;
      const url = error.config.url;
      if (status === 401 && url && url.endsWith('/auth/status')) {
        // This is an expected error for an invalid/expired token, no need to log it as a big red error.
        // The AuthInitializer will handle the logout.
      } else {
        console.error(`[apiClient] Response Error: ${status} for ${url}`, error.response.data);
      }
    } else {
      console.error('[apiClient] Network or other error:', error.message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;