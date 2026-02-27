const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/projects`;

const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

const demoController = {
  
  /**
   * Get all demo categories
   */
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
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
   * Create a new demo category
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
   * Update a demo category
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
   * Delete a demo category
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
   * Get all projects in a category
   */
  getProjects: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const result = await response.json();
      
      // Filter projects by category if categoryId is provided
      if (categoryId && result.success) {
        const category = result.data.find(cat => cat.id === categoryId);
        return {
          ...result,
          data: category ? category.projects : []
        };
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single project by ID
   */
  getProjectById: async (categoryId, projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/projects/${projectId}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new project
   */
  createProject: async (categoryId, projectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/projects`, {
        method: 'POST',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a project
   */
  updateProject: async (categoryId, projectId, projectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/projects/${projectId}`, {
        method: 'PUT',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a project
   */
  deleteProject: async (categoryId, projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/projects/${projectId}`, {
        method: 'DELETE',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};

export default demoController;
