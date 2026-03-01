import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010/api/v1',
  withCredentials: true,
});

// Response interceptor for auto-refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    // Skip auth retry for auth-related endpoints to avoid infinite loops
    const isAuthEndpoint = requestUrl.includes('/auth/');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch {
        // Refresh failed — only redirect if on a protected page
        if (typeof window !== 'undefined') {
          const protectedPaths = ['/cart', '/checkout', '/orders', '/admin'];
          const isProtectedPage = protectedPaths.some((p) =>
            window.location.pathname.startsWith(p),
          );
          if (isProtectedPage) {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
