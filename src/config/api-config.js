// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: '/register-cookie',
  LOGIN: '/login-cookie',
  GOOGLE_LOGIN: '/google-login',
  GOOGLE_REGISTER: '/google-register',
  LOGOUT: '/logout',
  PROFILE: '/profile',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // User endpoints
  USERS: '/users',
  USER_BY_ID: (uid) => `/users/${uid}`,
  USER_SEARCH: '/users/search',
  USER_ROLE: '/users/role',
};

export default API_CONFIG;
