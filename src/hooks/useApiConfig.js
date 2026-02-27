"use client";

import { API_CONFIG, API_ENDPOINTS } from '@/config/api-config';

/**
 * Custom hook to access API configuration
 * @returns {Object} API configuration and endpoints
 */
export function useApiConfig() {
  const getEndpoint = (endpoint, ...params) => {
    if (typeof endpoint === 'function') {
      return `${API_CONFIG.BASE_URL}${endpoint(...params)}`;
    }
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  };

  return {
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    endpoints: API_ENDPOINTS,
    getEndpoint,
    
    // Helper methods for common endpoints
    getUserEndpoint: (uid) => getEndpoint(API_ENDPOINTS.USER_BY_ID, uid),
    getFullUrl: (path) => `${API_CONFIG.BASE_URL}${path}`,
  };
}

export default useApiConfig;
