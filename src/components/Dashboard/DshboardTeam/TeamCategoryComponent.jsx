"use client";

import React, { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export default function TeamCategoryComponent() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, categoryName: "" });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/team/departments`, {
        credentials: 'include', // Include cookies for authentication
      });
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const result = await response.json();
      // Handle the response structure: { success: true, data: [...] }
      if (result.success && Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        setCategories([]);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Update existing department
        const response = await fetch(`${API_BASE_URL}/team/departments/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to update department');
        }

        const result = await response.json();
        await fetchDepartments();
        setIsEditing(false);
        setEditId(null);
      } else {
        // Create new department
        const response = await fetch(`${API_BASE_URL}/team/departments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to create department');
        }

        const result = await response.json();
        await fetchDepartments();
        setSuccessMessage("Category added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }

      setFormData({ name: "", description: "" });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
    });
    setIsEditing(true);
    setEditId(category.name); // Using name as ID based on the delete endpoint pattern
  };

  const handleDelete = async (categoryName) => {
    setDeleteModal({ show: false, categoryName: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/team/departments/${categoryName}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error('Failed to delete department');
      }

      const result = await response.json();
      await fetchDepartments();
      setSuccessMessage("Category deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const openDeleteModal = (categoryName) => {
    setDeleteModal({ show: true, categoryName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, categoryName: "" });
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "" });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Team Categories</h1>

      {/* Success Modal */}
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 border border-green-500/50 rounded-xl p-6 shadow-2xl max-w-sm mx-4 animate-[scale-in_0.3s_ease-out]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Success!</h3>
                <p className="text-green-300 text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br black border border-red-500/50 rounded-xl p-6 shadow-2xl max-w-md mx-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Delete Category</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Are you sure you want to delete <span className="font-semibold text-white">&quot;{deleteModal.categoryName}&quot;</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteModal.categoryName)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-white text-center py-8">Loading departments...</div>
      ) : (
        <>
          {/* Add/Edit Category Form */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          {isEditing ? "Edit Category" : "Add New Category"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="3"
              className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter category description"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {isEditing ? "Update Category" : "Add Category"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            No departments found. Add your first department above.
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category._id || category.name}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-5 hover:border-blue-500/40 transition-all"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {category.name}
              </h3>
              <p className="text-gray-400 mb-4 text-sm">{category.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="px-4 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(category.name)}
                  className="px-4 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
        </>
      )}
    </div>
  );
}
