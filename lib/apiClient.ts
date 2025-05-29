import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  console.error("CRITICAL: NEXT_PUBLIC_BACKEND_URL is not defined. API calls will fail.");
}

const apiClient = axios.create({
  baseURL: backendUrl,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token && !config.headers.Authorization) { // Only set if not already set (e.g., by explicit call in AuthContext)
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add an interceptor to handle 401s globally if needed, e.g., redirect to login
// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       // If not on a public page or login page already
//       if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/sign-in') && !window.location.pathname.startsWith('/auth')) {
//         // Potentially call logout from AuthContext or directly clear storage and redirect
//         console.warn("Global interceptor: Received 401, redirecting to sign-in.");
//         localStorage.removeItem('authToken');
//         // window.location.href = '/sign-in?session_expired=true'; // Full page reload
//         // Or use Next.js router if accessible here, but might be tricky
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;