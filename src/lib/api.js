import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      error.userMessage = error.response.data?.message || 'Server error occurred';
    } else if (error.request) {
      error.userMessage = 'Cannot connect to server. Please check if the backend is running.';
    } else {
      error.userMessage = error.message || 'An unexpected error occurred';
    }

    return Promise.reject(error);
  }
);

const normalizeUser = (user) => {
  // Return backend data as-is, only add uid for consistency
  return {
    ...user,
    uid: user.firebaseUid || user.uid || user._id, // Just add uid alias
  };
};

export const authApi = {
  registerWithEmail: async (data) => {
    try {
      const response = await api.post('register-cookie', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  loginWithEmail: async (data) => {
    try {
      const response = await api.post('login-cookie', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  loginWithGoogle: async (idToken) => {
    try {
      const response = await api.post('google-login', { idToken });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  registerWithGoogle: async (idToken) => {
    try {
      const response = await api.post('google-register', { idToken });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('logout');
      return response.data;
    } catch (error) {
      return { ok: true };
    }
  },

  getProfile: async (uid) => {
    const response = await api.get(`users/${uid}`);
    return normalizeUser(response.data);
  },

  getProfileWithToken: async (idToken) => {
    const response = await api.get('profile', {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return normalizeUser(response.data);
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export const userApi = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get('users');
    
    console.log('=== getAllUsers API Response ===');
    console.log('Full Response:', response);
    console.log('Response Data:', response.data);
    
    // Handle different response structures
    const usersData = response.data.data || response.data.users || response.data;
    const usersArray = Array.isArray(usersData) ? usersData : [];
    
    console.log('Extracted Users Data:', usersData);
    console.log('Users Array:', usersArray);
    console.log('Number of Users:', usersArray.length);
    
    const normalizedUsers = usersArray.map(normalizeUser);
    console.log('Normalized Users:', normalizedUsers);
    console.log('================================');
    
    return normalizedUsers;
  },

  // Get all users with status
  getAllUsersWithStatus: async () => {
    const response = await api.get('users/status/all');
    return response.data;
  },

  // Get all users with role
  getAllUsersWithRole: async () => {
    const response = await api.get('users/role/all');
    return response.data;
  },

  // Get single user by ID
  getUser: async (uid) => {
    const response = await api.get(`users/${uid}`);
    
    // Extract the actual user data from { success: true, data: {...} }
    const userData = response.data.data || response.data;
    
    return normalizeUser(userData);
  },

  // Get user status
  getUserStatus: async (uid) => {
    const response = await api.get(`users/${uid}/status`);
    return response.data;
  },

  // Get user role
  getUserRole: async (uid) => {
    const response = await api.get(`users/${uid}/role`);
    return response.data;
  },

  // Update user
  updateUser: async (uid, data) => {
    const response = await api.put(`users/${uid}`, data);
    
    // Extract the actual user data from { success: true, data: {...} }
    const userData = response.data.data || response.data;
    
    return normalizeUser(userData);
  },

  // Update user status
  updateUserStatus: async (uid, status) => {
    const response = await api.patch(`users/${uid}/status`, { status });
    return response.data;
  },

  // Update user role
  updateUserRole: async (uid, role) => {
    const response = await api.patch(`users/${uid}/role`, { role });
    return response.data;
  },

  // Delete user
  deleteUser: async (uid) => {
    const response = await api.delete(`users/${uid}`);
    return response.data;
  },
};

export const productApi = {
  getAllProducts: async (params) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const response = await api.get(`products-module${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`products-module/${id}`);
    return response.data;
  },

  createProduct: async (uid, data) => {
    const response = await api.post(`products-module/${uid}`, data);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`products-module/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    await api.delete(`products-module/${id}`);
  },
};

export const bannerApi = {
  // Get all banners
  getAllBanners: async () => {
    const response = await api.get('banner/all');
    return response.data;
  },

  // Get single banner by ID
  getBanner: async (id) => {
    const response = await api.get(`banner/${id}`);
    return response.data;
  },

  // Create new banner
  createBanner: async (data) => {
    const response = await api.post('banner', data);
    return response.data;
  },

  // Update banner
  updateBanner: async (id, data) => {
    const response = await api.put(`banner/${id}`, data);
    return response.data;
  },

  // Delete banner
  deleteBanner: async (id) => {
    const response = await api.delete(`banner/${id}`);
    return response.data;
  },
};

export const faqApi = {
  // Get all FAQs
  getAllFAQs: async () => {
    const response = await api.get('faqs');
    return response.data;
  },

  // Get single FAQ by ID
  getFAQ: async (id) => {
    const response = await api.get(`faqs/${id}`);
    return response.data;
  },

  // Create new FAQ
  createFAQ: async (data) => {
    const response = await api.post('faqs', data);
    return response.data;
  },

  // Update FAQ
  updateFAQ: async (id, data) => {
    const response = await api.put(`faqs/${id}`, data);
    return response.data;
  },

  // Patch FAQ (partial update)
  patchFAQ: async (id, data) => {
    const response = await api.patch(`faqs/${id}`, data);
    return response.data;
  },

  // Delete FAQ
  deleteFAQ: async (id) => {
    const response = await api.delete(`faqs/${id}`);
    return response.data;
  },
};

export const testimonialApi = {
  // Get all testimonials
  getAllTestimonials: async () => {
    const response = await api.get('testimonials');
    return response.data;
  },

  // Get single testimonial by ID
  getTestimonial: async (id) => {
    const response = await api.get(`testimonials/${id}`);
    return response.data;
  },

  // Create new testimonial
  createTestimonial: async (data) => {
    const response = await api.post('testimonials', data);
    return response.data;
  },

  // Update testimonial (patch)
  updateTestimonial: async (id, data) => {
    const response = await api.patch(`testimonials/${id}`, data);
    return response.data;
  },

  // Delete testimonial
  deleteTestimonial: async (id) => {
    const response = await api.delete(`testimonials/${id}`);
    return response.data;
  },
};

export const orderApi = {
  // Create new order
  createOrder: async (data) => {
    const response = await api.post('orders', data);
    return response.data;
  },

  // Get all orders (admin only)
  getAllOrders: async (params = {}) => {
    const response = await api.get('orders', { params });
    return response.data;
  },

  // Get user's orders
  getUserOrders: async () => {
    const response = await api.get('orders/my-orders');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`orders/${id}`);
    return response.data;
  },

  // Get order by order number
  getOrderByOrderNumber: async (orderNumber) => {
    const response = await api.get(`orders/number/${orderNumber}`);
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`orders/${id}/status`, { status });
    return response.data;
  },

  // Update payment status (admin only)
  updatePaymentStatus: async (id, paymentStatus) => {
    const response = await api.patch(`orders/${id}/payment`, { paymentStatus });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.patch(`orders/${id}/cancel`);
    return response.data;
  },

  // Update order (admin only)
  updateOrder: async (id, data) => {
    const response = await api.put(`orders/${id}`, data);
    return response.data;
  },

  // Delete order (admin only)
  deleteOrder: async (id) => {
    const response = await api.delete(`orders/${id}`);
    return response.data;
  },

  // Get order statistics (admin only)
  getOrderStats: async () => {
    const response = await api.get('orders/stats');
    return response.data;
  },

  // Track orders by email
  trackOrderByEmail: async (email) => {
    const response = await api.get(`orders/track/${email}`);
    return response.data;
  },
};

export const adminApi = {
  createUser: async (data, adminSecret) => {
    const headers = adminSecret ? { 'x-admin-secret': adminSecret } : {};
    const response = await api.post('create-user', data, { headers });
    return response.data;
  },
};

// ==================== CONTACT API ====================
export const contactApi = {
  // Public - Submit contact form
  submitContact: async (data) => {
    const response = await api.post('contact', data);
    return response.data;
  },

  // Admin - Get all contacts
  getAllContacts: async (params = {}) => {
    const response = await api.get('contact', { params });
    return response.data;
  },

  // Admin - Get contact stats
  getContactStats: async () => {
    const response = await api.get('contact/stats');
    return response.data;
  },

  // Admin - Get contact by ID
  getContactById: async (id) => {
    const response = await api.get(`contact/${id}`);
    return response.data;
  },

  // Admin - Update contact status
  updateContactStatus: async (id, status) => {
    const response = await api.patch(`contact/${id}/status`, { status });
    return response.data;
  },

  // Admin - Delete contact
  deleteContact: async (id) => {
    const response = await api.delete(`contact/${id}`);
    return response.data;
  },

  // Admin - Delete multiple contacts
  deleteMultipleContacts: async (ids) => {
    const response = await api.post('contact/delete-multiple', { ids });
    return response.data;
  },
};

// ==================== DASHBOARD API ====================
export const dashboardApi = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get('dashboard');
    return response.data;
  },
};

export const healthCheck = async () => {
  const response = await api.get('health');
  return response.data;
};

export default api;
