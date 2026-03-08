"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Loader2, Tag } from "lucide-react";

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
      const response = await fetch(`${API_BASE_URL}/team/departments`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch departments');
      const result = await response.json();
      setCategories(result.success && Array.isArray(result.data) ? result.data : []);
      setError(null);
    } catch (err) {
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
      if (isEditing) {
        const response = await fetch(`${API_BASE_URL}/team/departments/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to update department');
        await fetchDepartments();
        setSuccessMessage("Category updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setIsEditing(false);
        setEditId(null);
      } else {
        const response = await fetch(`${API_BASE_URL}/team/departments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to create department');
        await fetchDepartments();
        setSuccessMessage("Category added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
      setFormData({ name: "", description: "" });
      setShowFormModal(false);
      setError(null);
    } catch (err) {
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
      const response = await fetch(`${API_BASE_URL}/team/departments/${categoryName}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete department');
      await fetchDepartments();
      setSuccessMessage("Category deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "" });
    setIsEditing(false);
    setEditId(null);
    setShowFormModal(false);
  };

  const inputClass = "w-full px-3 py-2.5 text-sm bg-slate-900/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors";
  const labelClass = "block text-gray-300 text-sm mb-1.5 font-medium";

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-5 sm:mb-6 mt-12 md:mt-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-white">Team Categories</h1>
        </div>
        <button
          onClick={() => setShowFormModal(true)}
          className="px-3 py-2 sm:px-5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors flex items-center gap-1.5 text-sm sm:text-base font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
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
                    className={inputClass}
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
                    className={inputClass}
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
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-gray-400 text-sm">Loading departments...</span>
        </div>
      ) : (
        <>
          {categories.length > 0 && (
            <p className="text-gray-600 text-xs mb-4">
              {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
            </p>
          )}

          {/* Categories Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {categories.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-14 h-14 bg-blue-600/10 rounded-full flex items-center justify-center">
                  <Tag className="w-7 h-7 text-blue-600/40" />
                </div>
                <p className="text-gray-500 text-sm">No departments found.</p>
                <button
                  onClick={() => setShowFormModal(true)}
                  className="text-blue-400 text-sm hover:text-blue-300 underline underline-offset-2"
                >
                  Add your first category
                </button>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id || category.name}
                  className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-4 sm:p-5 hover:border-blue-500/40 transition-all flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-2 flex-1">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Tag className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-white truncate mb-1">
                        {category.name}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-blue-500/10">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 py-2 bg-blue-600/70 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteModal({ show: true, categoryName: category.name })}
                      className="flex-1 py-2 bg-red-600/70 hover:bg-red-600 active:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
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