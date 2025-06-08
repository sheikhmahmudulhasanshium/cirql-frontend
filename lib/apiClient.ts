// lib/apiClient.ts
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  // This would be a critical error at build/runtime if not set.
  console.error("CRITICAL: NEXT_PUBLIC_BACKEND_URL is not defined. API calls will fail.");
}

const apiClient = axios.create({
  baseURL: backendUrl,
  // Default headers can be set here too, e.g.,
   headers: {
     'Content-Type': 'application/json',
   },
});

// Request Interceptor: To add the auth token
apiClient.interceptors.request.use(
  (config) => {
    // Ensure this runs only on the client-side where localStorage is available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Ensure Authorization header is not already set by some other means if that's possible
        // if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
        // }
        // console.log('[apiClient Request Interceptor] Token added:', token ? 'Yes' : 'No');
      } else {
        // console.log('[apiClient Request Interceptor] No token found in localStorage.');
      }
    }
    // console.log('[apiClient Request Interceptor] Config:', config);
    return config;
  },
  (error) => {
    console.error('[apiClient Request Interceptor] Error:', error);
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor (example for handling 401s globally)
apiClient.interceptors.response.use(
  (response) => {
    // console.log('[apiClient Response Interceptor] Response:', response);
    return response;
  },
  (error) => {
    console.error('[apiClient Response Interceptor] Error:', error.response || error.message);
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/sign-in') && !window.location.pathname.startsWith('/auth')) {
        console.warn("[apiClient Response Interceptor] Received 401. Clearing token and redirecting to /sign-in might be needed here.");
        // Potentially call logout from AuthContext or directly clear storage and redirect
        // localStorage.removeItem('authToken');
        // window.location.href = '/sign-in?session_expired=true'; // Full page reload
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;