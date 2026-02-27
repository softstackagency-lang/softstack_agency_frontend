const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

const teamController = {
  
  /**
   * Get all team categories (departments)
   */
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/departments`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const result = await response.json();
      
      // Handle the response structure: { success: true, data: [...] }
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single category by ID
   */
  getCategoryById: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/departments/${categoryId}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      
      const result = await response.json();
      return result.success ? result.data : result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new team category
   */
  createCategory: async (categoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/departments`, {
        method: 'POST',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      
      const result = await response.json();
      return result.success ? result.data : result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a team category
   */
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/departments/${categoryId}`, {
        method: 'PUT',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      
      const result = await response.json();
      return result.success ? result.data : result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a team category
   */
  deleteCategory: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/departments/${categoryId}`, {
        method: 'DELETE',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },

  
  /**
   * Get all team members
   */
  getMembers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/team`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      
      const result = await response.json();
      
      // Handle the response structure: { success: true, data: [...] }
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get members by category
   */
  getMembersByCategory: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team?category=${categoryId}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single team member by ID
   */
  getMemberById: async (memberId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/${memberId}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch team member');
      }
      
      const result = await response.json();
      return result.success ? result.data : result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new team member
   */
  createMember: async (memberData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team`, {
        method: 'POST',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(memberData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create team member');
      }
      
      const result = await response.json();
      return result.success ? result.data : result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a team member
   */
  updateMember: async (memberId, memberData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/${memberId}`, {
        method: 'PUT',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(memberData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update team member');
      }
      
      const result = await response.json();
      return result.success ? result.data : result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a team member
   */
  deleteMember: async (memberId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/${memberId}`, {
        method: 'DELETE',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete team member');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default teamController;