// cirql-frontend/lib/apiClient.ts
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  // This check runs at build time and client-side.
  // For client-side, it's good to have a runtime warning too if somehow it's still undefined.
  console.error("CRITICAL: NEXT_PUBLIC_BACKEND_URL is not defined. API calls will fail.");
}

const apiClient = axios.create({
  baseURL: backendUrl, // This will be undefined if NEXT_PUBLIC_BACKEND_URL is not set
});

apiClient.interceptors.request.use(
  (config) => {
    // This interceptor runs client-side
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;