const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/pricing`;

const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

const pricingController = {
  
  /**
   * Get all pricing categories
   */
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single category by ID
   */
  getCategoryById: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new pricing category
   */
  createCategory: async (categoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a pricing category
   */
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'PUT',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a pricing category
   */
  deleteCategory: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  
  /**
   * Get all pricing plans
   */
  getPlans: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/plans`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get plans by category
   */
  getPlansByCategory: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plans?category=${categoryId}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single plan by ID
   */
  getPlanById: async (planId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch plan');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new pricing plan
   */
  createPlan: async (planData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plans`, {
        method: 'POST',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(planData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create plan');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a pricing plan
   */
  updatePlan: async (planId, planData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
        method: 'PUT',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(planData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update plan');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a pricing plan
   */
  deletePlan: async (planId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
        method: 'DELETE',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete plan');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};

export default pricingController;
