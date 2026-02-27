const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/services`;

const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

const servicesController = {
  
  /**
   * Get all service categories
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
   * Create a new service category
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
   * Update a service category
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
   * Delete a service category
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
   * Get all services
   */
  getServices: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single service by ID
   */
  getServiceById: async (serviceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${serviceId}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch service');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new service
   */
  createService: async (serviceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(serviceData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create service');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a service
   */
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${serviceId}`, {
        method: 'PUT',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(serviceData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update service');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a service
   */
  deleteService: async (serviceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${serviceId}`, {
        method: 'DELETE',
        cache: 'no-store',

        cache: 'no-store',        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};

export default servicesController;
