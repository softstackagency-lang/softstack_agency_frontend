"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Loader2, Tag } from "lucide-react";
import { auth } from "@/lib/firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export default function TeamCategoryComponent() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, categoryName: "" });
  const [showFormModal, setShowFormModal] = useState(false);

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      console.log('[TeamCategory] Fetching departments...');
      const user = auth.currentUser;
      console.log('[TeamCategory] Current user:', user ? user.uid : 'Not logged in');

      const headers = { 'Content-Type': 'application/json' };
      if (user) {
        const token = await user.getIdToken();
        headers.Authorization = `Bearer ${token}`;
        console.log('[TeamCategory] Added auth token to headers');
      } else {
        console.warn('[TeamCategory] No user logged in, making unauthenticated request');
      }

      const response = await fetch(`${API_BASE_URL}/team/departments`, {
        credentials: 'include',
        headers
      });

      console.log('[TeamCategory] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[TeamCategory] Failed to fetch departments:', response.status, errorText);
        throw new Error(`Failed to fetch departments: ${response.status}`);
      }

      const result = await response.json();
      console.log('[TeamCategory] Departments fetched:', result);
      setCategories(result.success && Array.isArray(result.data) ? result.data : []);
      setError(null);
    } catch (err) {
      console.error('[TeamCategory] Error:', err);
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const headers = { 'Content-Type': 'application/json' };
      if (user) {
        const token = await user.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }

      if (isEditing) {
        console.log('[TeamCategory] Updating department:', editId);
        const response = await fetch(`${API_BASE_URL}/team/departments/${editId}`, {
          method: 'PUT',
          headers,
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[TeamCategory] Failed to update:', response.status, errorText);
          throw new Error('Failed to update department');
        }
        await fetchDepartments();
        setSuccessMessage("Category updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setIsEditing(false);
        setEditId(null);
      } else {
        console.log('[TeamCategory] Creating new department:', formData);
        const response = await fetch(`${API_BASE_URL}/team/departments`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[TeamCategory] Failed to create:', response.status, errorText);
          throw new Error('Failed to create department');
        }
        await fetchDepartments();
        setSuccessMessage("Category added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
      setFormData({ name: "", description: "" });
      setShowFormModal(false);
      setError(null);
    } catch (err) {
      console.error('[TeamCategory] Submit error:', err);
      setError(err.message);
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, description: category.description });
    setIsEditing(true);
    setEditId(category.name);
    setShowFormModal(true);
  };

  const handleDelete = async (categoryName) => {
    setDeleteModal({ show: false, categoryName: "" });
    try {
      console.log('[TeamCategory] Deleting department:', categoryName);
      const user = auth.currentUser;
      const headers = {};
      if (user) {
        const token = await user.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/team/departments/${categoryName}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[TeamCategory] Failed to delete:', response.status, errorText);
        throw new Error('Failed to delete department');
      }
      await fetchDepartments();
      setSuccessMessage("Category deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setError(null);
    } catch (err) {
      console.error('[TeamCategory] Delete error:', err);
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "" });
    setIsEditing(false);
    setEditId(null);
    setShowFormModal(false);
  };

  const labelClass = "block text-gray-300 text-sm mb-1.5 font-medium";

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="mb-5 sm:mb-8 mt-12 md:mt-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
          Team Categories
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">
          Manage team departments and categories
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
          All Categories
          {categories.length > 0 && (
            <span className="ml-2 text-xs text-gray-500 font-normal">({categories.length})</span>
          )}
        </h2>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={fetchDepartments}
            disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowFormModal(true)}
            disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Success Toast - top center */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[min(90vw,360px)]">
          <div className="bg-gradient-to-r from-green-900/95 to-emerald-900/95 border border-green-500/40 rounded-xl px-4 py-3.5 shadow-2xl backdrop-blur-md flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Success!</p>
              <p className="text-green-300 text-xs">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal - bottom sheet on mobile, centered on desktop */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:w-auto sm:max-w-md bg-slate-900 border-t sm:border border-slate-700 sm:border-red-500/30 rounded-t-2xl sm:rounded-xl p-5 sm:p-6 shadow-2xl">
            {/* Drag handle (mobile only) */}
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-500/15 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-1">Delete Category</h3>
                <p className="text-gray-400 text-sm mb-5">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">&quot;{deleteModal.categoryName}&quot;</span>?{" "}
                  This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal({ show: false, categoryName: "" })}
                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteModal.categoryName)}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal - bottom sheet on mobile, centered on desktop */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full sm:w-[min(100vw-2rem,480px)] bg-slate-900 border-t sm:border border-slate-700 sm:border-blue-500/25 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col">

            {/* Drag handle (mobile only) */}
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700/80 shrink-0">
              <h2 className="text-base sm:text-lg font-semibold text-white">
                {isEditing ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={handleCancel}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Content */}
            <div className="px-4 sm:px-6 py-4">
              <form id="categoryForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="dashboard-input"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="dashboard-textarea"
                    placeholder="Enter category description"
                  />
                </div>
              </form>
            </div>

            {/* Sticky Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-700/80 shrink-0 bg-slate-900 rounded-b-2xl">
              {error && (
                <div className="bg-red-500/15 border border-red-500/40 text-red-300 px-3 py-2 rounded-lg mb-3 text-xs sm:text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none sm:w-28 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="categoryForm"
                  className="flex-1 sm:flex-none sm:w-40 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {isEditing ? "Update Category" : "Add Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top-level error (outside modal) */}
      {error && !showFormModal && (
        <div className="bg-red-500/15 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && categories.length === 0 && (
        <div className="flex justify-center items-center py-16">
          <Loader2 size={40} className="animate-spin text-blue-500" />
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-6 sm:p-12 text-center">
          <Tag size={40} className="mx-auto text-gray-600 mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-xl font-semibold text-gray-400 mb-2">No Categories Yet</h3>
          <p className="text-gray-500 text-sm">
            Click &quot;Add Category&quot; to create your first team category
          </p>
        </div>
      )}

      {/* Categories Grid */}
      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category._id || category.name}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-4 sm:p-6 flex flex-col hover:border-blue-500/40 transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Tag size={18} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white truncate mb-1.5">
                    {category.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-1 mb-4 flex-1">
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                  {category.description}
                </p>
              </div>

              <div className="flex gap-2 pt-3 border-t border-blue-500/10">
                <button
                  onClick={() => handleEdit(category)}
                  disabled={loading}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Edit
                </button>
                <button
                  onClick={() => setDeleteModal({ show: true, categoryName: category.name })}
                  disabled={loading}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}