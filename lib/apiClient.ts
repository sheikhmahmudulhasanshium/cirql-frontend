// lib/apiClient.ts
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  console.error("CRITICAL: NEXT_PUBLIC_BACKEND_URL is not defined.");
}

const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: To add the auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      
      // --- DEBUG LOGGING ---
      console.log('[apiClient] Intercepting request to:', config.url);
      
      if (token) {
        console.log('[apiClient] Token FOUND in localStorage. Attaching header.');
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('[apiClient] Token NOT FOUND in localStorage for this request.');
      }
    }
    return config;
  },
  (error) => {
    console.error('[apiClient] Request setup error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // --- DEBUG LOGGING ---
    if (error.response) {
      console.error(`[apiClient] Response Error: ${error.response.status} for ${error.config.url}`, error.response.data);
    } else {
       console.error('[apiClient] Network or other error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;