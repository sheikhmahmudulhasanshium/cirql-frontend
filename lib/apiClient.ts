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
      
      // These logs are helpful for debugging but can be commented out for production
      // console.log('[apiClient] Intercepting request to:', config.url);
      
      if (token) {
        // console.log('[apiClient] Token FOUND in localStorage. Attaching header.');
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // console.warn('[apiClient] Token NOT FOUND in localStorage for this request.');
      }
    }
    return config;
  },
  (error) => {
    console.error('[apiClient] Request setup error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor (UPDATED LOGIC HERE)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // First, check if the error is due to a request being canceled.
    if (axios.isCancel(error)) {
      console.log(`[apiClient] Request successfully canceled: ${error.message}`);
      return Promise.reject(error);
    }

    // --- START OF UPDATED SECTION ---
    // Handle actual network/server errors
    if (error.response) {
      const status = error.response.status;
      const url = error.config.url;

      // Check for the specific "invalid session token" scenario.
      // This is an expected failure, so we won't log it as a red 'error'.
      if (status === 401 && url && url.endsWith('/auth/status')) {
        // Log it as simple info. The AuthContext will handle the redirect.
        console.log('[apiClient] INFO: Session token is invalid or expired. This is expected. AuthContext will handle logout.');
      } else {
        // For ALL OTHER errors (e.g., 404, 500, or a 401 on a different endpoint),
        // we still want to see the full, red error message.
        console.error(`[apiClient] Response Error: ${status} for ${url}`, error.response.data);
      }
    } else {
       // For network errors where there's no response object
       console.error('[apiClient] Network or other error:', error.message);
    }
    // --- END OF UPDATED SECTION ---
    
    // IMPORTANT: We still reject the promise so that the calling code's `catch` block will run.
    return Promise.reject(error);
  }
);

export default apiClient;