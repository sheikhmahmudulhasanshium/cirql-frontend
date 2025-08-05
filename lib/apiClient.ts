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

// Response Interceptor for logging and handling errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response) {
      const status = error.response.status;
      const url = error.config.url;

      // --- START: MODIFIED CODE ---
      // Define a list of status codes that are handled by the UI (with toasts, etc.)
      // and should not be logged as "errors" in the console.
      const ignoredStatusCodes = [400, 401, 403, 404, 409, 429]; // ADD 429 HERE
      // --- END: MODIFIED CODE ---

      if (!ignoredStatusCodes.includes(status)) {
        console.error(
          `[apiClient] Unexpected Response Error: ${status} for ${url}`,
          error.response.data,
        );
      }
    } else {
      console.error('[apiClient] Network or other error:', error.message);
    }
    
    return Promise.reject(error);
  },
);

export default apiClient;