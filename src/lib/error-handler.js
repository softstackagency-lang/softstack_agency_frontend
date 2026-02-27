/**
 * Centralized error handling utility
 * Provides user-friendly error messages for different error scenarios
 */

export const ErrorTypes = {
  NETWORK: 'NETWORK',
  AUTH: 'AUTH',
  VALIDATION: 'VALIDATION',
  SERVER: 'SERVER',
  FIREBASE: 'FIREBASE',
};

export const handleApiError = (error, context = '') => {
  console.error(`[${context}] API Error:`, {
    message: error.message,
    code: error.code,
    status: error.response?.status,
    data: error.response?.data,
  });

  // Network errors (backend not reachable)
  if (error.code === 'ERR_NETWORK' || !error.response) {
    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api').replace('/api', '');
    return {
      type: ErrorTypes.NETWORK,
      message: `❌ Cannot connect to backend server at ${backendUrl}\n\nPlease ensure:\n• Backend server is running\n• CORS is configured properly\n• No firewall blocking the connection\n\nRun: npm run dev (in backend folder)`,
      technicalMessage: error.message,
    };
  }

  // Firebase auth errors
  if (error.code?.startsWith('auth/')) {
    const firebaseErrors = {
      'auth/popup-closed-by-user': 'Sign in cancelled. Please try again.',
      'auth/popup-blocked': 'Popup blocked by browser. Please allow popups for this site.',
      'auth/network-request-failed': 'Network error. Please check your internet connection.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/invalid-credential': 'Invalid credentials provided.',
      'auth/invalid-phone-number': 'Invalid phone number format. Please enter a valid phone number (e.g., 01XXXXXXXXX).',
    };

    return {
      type: ErrorTypes.FIREBASE,
      message: firebaseErrors[error.code] || `Firebase error: ${error.message}`,
      technicalMessage: error.code,
    };
  }

  // Check for Firebase error in response data
  if (error.response?.data?.message?.includes('phone number') || 
      error.response?.data?.message?.includes('E.164')) {
    return {
      type: ErrorTypes.VALIDATION,
      message: 'Invalid phone number format. Please enter a valid phone number (e.g., 01XXXXXXXXX).',
      technicalMessage: error.response?.data?.message,
    };
  }

  // HTTP status errors
  const statusErrors = {
    400: {
      type: ErrorTypes.VALIDATION,
      message: error.response?.data?.message || 'Invalid data provided. Please check your information.',
    },
    401: {
      type: ErrorTypes.AUTH,
      message: error.response?.data?.message || 'Invalid email or password. Please try again.',
    },
    403: {
      type: ErrorTypes.AUTH,
      message: error.response?.data?.message || 'Access denied. You do not have permission to perform this action.',
    },
    404: {
      type: ErrorTypes.AUTH,
      message: error.response?.data?.message || 'Account not found. Please sign up first.',
    },
    409: {
      type: ErrorTypes.VALIDATION,
      message: 'Email already exists. Please sign in instead or use a different email.',
    },
    500: {
      type: ErrorTypes.SERVER,
      message: 'Server error occurred. Please try again later or contact support.',
    },
    502: {
      type: ErrorTypes.SERVER,
      message: 'Backend server is not responding. Please ensure it is running.',
    },
    503: {
      type: ErrorTypes.SERVER,
      message: 'Service temporarily unavailable. Please try again in a few moments.',
    },
  };

  if (error.response?.status && statusErrors[error.response.status]) {
    return {
      ...statusErrors[error.response.status],
      technicalMessage: error.response?.data?.error || error.message,
    };
  }

  // Default error
  return {
    type: ErrorTypes.SERVER,
    message: error.userMessage || error.message || 'An unexpected error occurred. Please try again.',
    technicalMessage: error.message,
  };
};

/**
 * Format error for display in UI
 */
export const formatErrorMessage = (error) => {
  const errorInfo = handleApiError(error);
  return errorInfo.message;
};

/**
 * Check if backend is reachable
 */
export const checkBackendHealth = async () => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
    const response = await fetch(`${apiBaseUrl}/health`, {
      method: 'GET',
        cache: 'no-store',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Log error to console with context
 */
export const logError = (context, error, additionalInfo = {}) => {
};
