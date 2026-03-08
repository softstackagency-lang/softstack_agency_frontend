"use client";
import React, { useState, useEffect } from "react";
import {
  Plus, Edit, Trash2, Save, X, Tag, RefreshCw, Loader2,
  CheckCircle, XCircle, AlertCircle,
} from "lucide-react";
import { auth } from "@/lib/firebase";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/pricing`;

export default function PricingCategoryComponent() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", isActive: true });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [deleteModal, setDeleteModal] = useState({ show: false, categoryId: null, categoryName: "" });

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = "success") => setToast({ show: true, message, type });

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) { showToast("Please log in to continue", "error"); return null; }
    return await user.getIdToken();
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const idToken = await getToken();
      if (!idToken) return;
      const response = await fetch(API_BASE_URL, { headers: { "Authorization": `Bearer ${idToken}` } });
      const data = await response.json();
      if (data.success && data.data.categories) setCategories(data.data.categories);
    } catch {
      showToast("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: "", isActive: true });
    setShowFormModal(true);
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({ name: category.name, isActive: category.isActive });
    setShowFormModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) { showToast("Please enter a category name", "error"); return; }
    setLoading(true);
    try {
      const idToken = await getToken();
      if (!idToken) return;

      const url = editingId ? `${API_BASE_URL}/categories/${editingId}` : `${API_BASE_URL}/categories`;
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(`Category ${editingId ? "updated" : "created"} successfully!`, "success");
        fetchCategories();
        setShowFormModal(false);
        setEditingId(null);
        setFormData({ name: "", isActive: true });
      } else {
        const error = await response.json();
        showToast(error.message || `Failed to ${editingId ? "update" : "create"} category`, "error");
      }
    } catch {
      showToast("Failed to save category", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setDeleteModal({ show: false, categoryId: null, categoryName: "" });
    try {
      const idToken = await getToken();
      if (!idToken) return;
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${idToken}` },
      });
      if (response.ok) {
        showToast("Category deleted successfully!", "success");
        fetchCategories();
      } else {
        const error = await response.json();
        showToast(error.message || "Failed to delete category", "error");
      }
    } catch {
      showToast("Failed to delete category", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowFormModal(false);
    setEditingId(null);
    setFormData({ name: "", isActive: true });
  };

  const cardStyle = "bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500";
  const inputClass = "w-full px-3 py-2.5 text-sm bg-[#05060a] border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors";
  const labelClass = "block text-sm text-gray-400 mb-1.5 font-medium";

  return (
    <div className="relative min-h-screen p-3 sm:p-6 overflow-auto text-slate-200 max-w-7xl mx-auto">
      <div className="relative z-10">

        {/* Header */}
        <div className="mb-5 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Pricing Categories</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Manage pricing categories for your services</p>
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center mb-5 sm:mb-6 gap-3">
          <h2 className="text-base sm:text-xl font-semibold text-white">
            All Categories
            {categories.length > 0 && (
              <span className="ml-2 text-xs text-gray-500 font-normal">({categories.length})</span>
            )}
          </h2>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={fetchCategories}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleAdd}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
            >
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && categories.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <Loader2 size={40} className="animate-spin text-blue-500" />
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div className={`${cardStyle} p-6 sm:p-12 text-center`}>
            <Tag size={40} className="mx-auto text-gray-600 mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-xl font-semibold text-gray-400 mb-2">No Categories Yet</h3>
            <p className="text-gray-500 text-sm">Click &quot;Add Category&quot; to create your first pricing category</p>
          </div>
        )}

        {/* Categories Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {categories.map((category) => (
              <div key={category._id} className={`${cardStyle} p-4 sm:p-5 lg:p-6 flex flex-col`}>

                {/* Card Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 bg-blue-500/15 rounded-lg flex items-center justify-center shrink-0">
                    <Tag size={18} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-white truncate mb-1.5">
                      {category.name}
                    </h3>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      category.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div className="space-y-1 mb-4 flex-1">
                  <p className="text-xs text-gray-600 truncate">ID: {category._id}</p>
                  {category.plans?.length > 0 && (
                    <p className="text-xs text-gray-400">
                      {category.plans.length} plan{category.plans.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-blue-500/10">
                  <button
                    onClick={() => handleEdit(category)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 active:bg-blue-500/40 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ show: true, categoryId: category._id, categoryName: category.name })}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast - top center on mobile, top right on desktop */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-[60] w-[min(90vw,360px)] sm:w-auto sm:max-w-sm">
          <div className={`flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-2xl border backdrop-blur-xl ${
            toast.type === "success" ? "bg-green-500/20 border-green-500/50 text-green-300"
            : toast.type === "error" ? "bg-red-500/20 border-red-500/50 text-red-300"
            : "bg-blue-500/20 border-blue-500/50 text-blue-300"
          }`}>
            {toast.type === "success" && <CheckCircle size={20} className="shrink-0" />}
            {toast.type === "error" && <XCircle size={20} className="shrink-0" />}
            {toast.type === "info" && <AlertCircle size={20} className="shrink-0" />}
            <span className="font-medium text-sm flex-1">{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: "", type: "" })} className="ml-1 hover:opacity-70 transition-opacity shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal - bottom sheet on mobile, centered on desktop */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full sm:w-[min(100vw-2rem,440px)] bg-[#0a0f23] border-t sm:border border-slate-700 sm:border-blue-500/30 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col">

            {/* Drag handle (mobile only) */}
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700/80 shrink-0">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {editingId ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={handleCancel}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Body */}
            <div className="px-4 sm:px-6 py-4 space-y-4">
              <div>
                <label className={labelClass}>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., AI Agent, Web Development"
                  disabled={loading}
                  autoFocus
                />
              </div>
              <div>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => !loading && setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`relative w-10 h-5 rounded-full transition-colors ${formData.isActive ? 'bg-blue-500' : 'bg-slate-600'} ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm text-gray-300">Active</span>
                </label>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-700/80 shrink-0 bg-[#0a0f23] rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 sm:flex-none sm:w-28 flex items-center justify-center gap-2 py-2.5 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <X size={15} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 sm:flex-none sm:w-36 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - bottom sheet on mobile, centered on desktop */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:w-auto sm:max-w-md bg-[#0a0f23] border-t sm:border border-slate-700 sm:border-red-500/30 rounded-t-2xl sm:rounded-2xl p-5 sm:p-8 shadow-2xl">

            {/* Drag handle (mobile only) */}
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-red-500/20 rounded-full shrink-0">
                <AlertCircle size={22} className="text-red-400" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white">Delete Category</h3>
            </div>

            <p className="text-gray-300 text-sm sm:text-base mb-5 sm:mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">&quot;{deleteModal.categoryName}&quot;</span>?
              <span className="text-xs sm:text-sm text-red-400 mt-1.5 block">This action cannot be undone.</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, categoryId: null, categoryName: "" })}
                className="flex-1 py-2.5 sm:py-3 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.categoryId)}
                disabled={loading}
                className="flex-1 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Deleting...</> : <><Trash2 size={16} /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}