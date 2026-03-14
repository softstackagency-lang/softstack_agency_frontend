"use client";
import React, { useState, useEffect } from "react";
import {
  Plus, Edit, Trash2, Save, X, Tag, RefreshCw, Loader2,
  CheckCircle, XCircle, AlertCircle,
} from "lucide-react";
import { auth } from "@/lib/firebase";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api"}/pricing`;

export default function PricingCategoryComponent() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", isActive: true });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [deleteModal, setDeleteModal] = useState({ show: false, categoryId: null, categoryName: "" });

  /* ─── Shared card style (same as HomeManagement) ─── */
  const cardStyle =
    "bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500";

  useEffect(() => { fetchCategories(); }, []);

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
      const response = await fetch(API_BASE_URL, { headers: { Authorization: `Bearer ${idToken}` } });
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        showToast(`Category ${editingId ? "updated" : "created"} successfully!`, "success");
        fetchCategories();
        handleCancel();
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
        headers: { Authorization: `Bearer ${idToken}` },
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

  return (
    <div className="relative min-h-screen p-3 sm:p-4 md:p-6 overflow-auto text-slate-200">
      <div className="relative z-10">

        {/* ── Page Header ── */}
        <div className="mb-5 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
            Pricing Categories
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400">
            Manage pricing categories for your services
          </p>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
            All Categories
            {categories.length > 0 && (
              <span className="ml-2 text-xs text-gray-500 font-normal">({categories.length})</span>
            )}
          </h2>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={fetchCategories}
              disabled={loading}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleAdd}
              disabled={loading}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              <Plus size={16} className="sm:w-5 sm:h-5" />
              Add Category
            </button>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && categories.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <Loader2 size={40} className="animate-spin text-blue-500" />
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && categories.length === 0 && (
          <div className={`${cardStyle} p-6 sm:p-12 text-center`}>
            <Tag size={40} className="mx-auto text-gray-600 mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-xl font-semibold text-gray-400 mb-2">No Categories Yet</h3>
            <p className="text-gray-500 text-sm">
              Click &quot;Add Category&quot; to create your first pricing category
            </p>
          </div>
        )}

        {/* ── Categories Grid ── */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {categories.map((category) => (
              <div key={category._id} className={`${cardStyle} p-4 sm:p-6 flex flex-col`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Tag size={18} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white truncate mb-1.5">
                      {category.name}
                    </h3>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      category.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 mb-4 flex-1">
                  <p className="text-xs text-gray-600 truncate">ID: {category._id}</p>
                  {category.plans?.length > 0 && (
                    <p className="text-xs text-gray-400">
                      {category.plans.length} plan{category.plans.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-blue-500/10">
                  <button
                    onClick={() => handleEdit(category)}
                    disabled={loading}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50"
                  >
                    <Edit size={14} className="sm:w-4 sm:h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ show: true, categoryId: category._id, categoryName: category.name })}
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
        )}
      </div>

      {/* ══════════ ADD / EDIT FORM MODAL ══════════ */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0f23]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.2)] w-full max-w-sm sm:max-w-md">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-blue-500/20">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                {editingId ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={handleCancel}
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
                  placeholder="e.g., AI Agent, Web Development"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <div
                  onClick={() => !loading && setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                    formData.isActive ? "bg-blue-500" : "bg-gray-600"
                  } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    formData.isActive ? "translate-x-5" : "translate-x-0"
                  }`} />
                </div>
                <span className="text-xs sm:text-sm text-gray-400">
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
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
                  onClick={handleCancel}
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
          <div className={`${cardStyle} max-w-sm sm:max-w-md w-full p-4 sm:p-6`}>
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
                onClick={() => setDeleteModal({ show: false, categoryId: null, categoryName: "" })}
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

      {/* ══════════ TOAST ══════════ */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[min(90vw,360px)]">
          <div className={`bg-[#0a0f23]/95 backdrop-blur-xl border rounded-2xl px-4 py-3.5 shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center gap-3 ${
            toast.type === "success"
              ? "border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
              : toast.type === "error"
              ? "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
              : "border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          }`}>
            {toast.type === "success" && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
            {toast.type === "error" && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
            {toast.type === "info" && <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />}
            <span className={`text-sm font-medium flex-1 ${
              toast.type === "success" ? "text-green-400"
              : toast.type === "error" ? "text-red-400"
              : "text-blue-400"
            }`}>
              {toast.message}
            </span>
            <button
              onClick={() => setToast({ show: false, message: "", type: "" })}
              className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}