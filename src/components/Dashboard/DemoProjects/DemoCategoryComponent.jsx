"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, X, Loader2, Tag, Edit, Trash2, Save, CheckCircle,
} from "lucide-react";
import api from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export default function DemoCategoryComponent() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, categoryName: "", categoryId: "" });
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  /* ─── Shared card style (same as HomeManagement) ─── */
  const cardStyle =
    "bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 sm:p-6 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500";

  useEffect(() => { fetchDemoCategories(); }, []);

  const fetchDemoCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      const result = response.data;
      if (result.success && result.data && Array.isArray(result.data.categories)) {
        setCategories(result.data.categories);
      } else {
        setCategories([]);
      }
      setError(null);
    } catch (err) {
      setError(err.userMessage || err.message || "Failed to fetch demo categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({ name: "", description: "" });
    setIsEditing(false);
    setEditId(null);
    setShowFormModal(true);
  };

  const openEditModal = (category) => {
    setFormData({ name: category.name, description: category.description });
    setIsEditing(true);
    setEditId(category.id);
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setFormData({ name: "", description: "" });
    setIsEditing(false);
    setEditId(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Please fill in both name and description");
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      setLoading(true);
      if (isEditing) {
        await api.put(`/projects/categories/${editId}`, formData);
        setSuccessMessage("Category updated successfully!");
      } else {
        await api.post('/projects/categories', formData);
        setSuccessMessage("Category added successfully!");
      }
      await fetchDemoCategories();
      setTimeout(() => setSuccessMessage(""), 3000);
      closeFormModal();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    setDeleteModal({ show: false, categoryName: "", categoryId: "" });
    try {
      setLoading(true);
      await api.delete(`/projects/categories/${categoryId}`);
      await fetchDemoCategories();
      setSuccessMessage("Category deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setError(null);
    } catch (err) {
      setError(err.userMessage || err.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-3 sm:p-4 md:p-6 overflow-auto text-slate-200">
      <div className="relative z-10">

        {/* ── Page Header ── */}
        <div className="mb-5 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
            Demo Categories
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400">
            Manage demo project categories
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        {/* ── Header row ── */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
            Manage Categories
          </h2>
          <button
            onClick={openAddModal}
            disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            Add Category
          </button>
        </div>

        {/* ── Categories Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {categories.length === 0 && !loading && (
            <div className={`${cardStyle} md:col-span-2 text-center py-10 sm:py-12`}>
              <Tag className="mx-auto mb-3 sm:mb-4 text-gray-600 w-10 h-10 sm:w-12 sm:h-12" />
              <p className="text-gray-400 text-sm sm:text-base">
                No categories found. Create your first category!
              </p>
            </div>
          )}

          {categories.map((category) => (
            <div key={category._id || category.id} className={`${cardStyle} relative`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold truncate mb-1">
                    {category.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3 sm:mt-4">
                <button
                  onClick={() => openEditModal(category)}
                  disabled={loading}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50"
                >
                  <Edit size={14} className="sm:w-4 sm:h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteModal({ show: true, categoryName: category.name, categoryId: category.id })}
                  disabled={loading}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ══════════ ADD / EDIT FORM MODAL ══════════ */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0a0f23]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.2)] w-full max-w-sm sm:max-w-md">

              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-blue-500/20">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                  {isEditing ? "Edit Category" : "Add New Category"}
                </h3>
                <button
                  onClick={closeFormModal}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="dashboard-input"
                    placeholder="Enter category name"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="dashboard-textarea min-h-[80px] sm:min-h-[100px]"
                    placeholder="Enter category description"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading
                      ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      : <Save size={16} className="sm:w-5 sm:h-5" />}
                    Save
                  </button>
                  <button
                    onClick={closeFormModal}
                    disabled={loading}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    <X size={16} className="sm:w-5 sm:h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ DELETE MODAL ══════════ */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${cardStyle} max-w-sm sm:max-w-md w-full`}>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to delete{" "}
                <span className="text-white font-semibold">&quot;{deleteModal.categoryName}&quot;</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => handleDelete(deleteModal.categoryId)}
                  disabled={loading}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />}
                  Delete
                </button>
                <button
                  onClick={() => setDeleteModal({ show: false, categoryName: "", categoryId: "" })}
                  disabled={loading}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ SUCCESS TOAST ══════════ */}
        {successMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[min(90vw,360px)]">
            <div className="bg-[#0a0f23]/95 backdrop-blur-xl border border-green-500/30 rounded-2xl px-4 py-3.5 shadow-[0_0_20px_rgba(34,197,94,0.15)] flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Success!</p>
                <p className="text-green-400 text-xs">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}