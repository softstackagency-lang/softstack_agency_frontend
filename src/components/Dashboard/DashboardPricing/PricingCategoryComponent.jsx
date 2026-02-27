"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Tag,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { auth } from "@/lib/firebase";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/pricing`;

export default function PricingCategoryComponent() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [deleteModal, setDeleteModal] = useState({ show: false, categoryId: null, categoryName: "" });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        showToast("Please log in to continue", "error");
        return;
      }

      const idToken = await user.getIdToken();
      const response = await fetch(API_BASE_URL, {
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data.categories) {
        setCategories(data.data.categories);
      }
    } catch (error) {
      showToast("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({ name: "", isActive: true });
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({ name: category.name, isActive: category.isActive });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast("Please enter a category name", "error");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        showToast("Please log in to continue", "error");
        return;
      }

      const idToken = await user.getIdToken();

      if (editingId) {
        // Update existing category
        const response = await fetch(`${API_BASE_URL}/categories/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          showToast("Category updated successfully!", "success");
          fetchCategories();
          setEditingId(null);
        } else {
          const error = await response.json();
          showToast(error.message || "Failed to update category", "error");
        }
      } else {
        // Create new category
        const response = await fetch(`${API_BASE_URL}/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          showToast("Category created successfully!", "success");
          fetchCategories();
          setIsAdding(false);
        } else {
          const error = await response.json();
          showToast(error.message || "Failed to create category", "error");
        }
      }
      setFormData({ name: "", isActive: true });
    } catch (error) {
      showToast("Failed to save category", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setDeleteModal({ show: false, categoryId: null, categoryName: "" });
    
    try {
      const user = auth.currentUser;
      if (!user) {
        showToast("Please log in to continue", "error");
        return;
      }

      const idToken = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        showToast("Category deleted successfully!", "success");
        fetchCategories();
      } else {
        const error = await response.json();
        showToast(error.message || "Failed to delete category", "error");
      }
    } catch (error) {
      showToast("Failed to delete category", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (category) => {
    setDeleteModal({ show: true, categoryId: category._id, categoryName: category.name });
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, categoryId: null, categoryName: "" });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", isActive: true });
  };

  const cardStyle =
    "bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500";

  return (
    <div className="relative min-h-screen p-6 overflow-auto text-slate-200">
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pricing Categories</h1>
          <p className="text-gray-400">Manage pricing categories for your services</p>
        </div>

        {/* Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">All Categories</h2>
          <div className="flex gap-3">
            <button
              onClick={fetchCategories}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
              Refresh
            </button>
            {!isAdding && !editingId && (
              <button
                onClick={handleAdd}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <Plus size={20} />
                Add Category
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className={`${cardStyle} mb-6`}>
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Category" : "Add New Category"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#05060a] border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Ai agent, Web Development"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-300">Active</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && categories.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <Loader2 size={48} className="animate-spin text-blue-500" />
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div className={`${cardStyle} text-center py-12`}>
            <Tag size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Categories Yet</h3>
            <p className="text-gray-500">Click &quot;Add Category&quot; to create your first pricing category</p>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category._id} className={cardStyle}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag size={20} className="text-blue-400" />
                      <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">Status:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          category.isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>ID: {category._id}</span>
                  </div>
                  {category.plans && category.plans.length > 0 && (
                    <div className="text-xs text-gray-400">
                      {category.plans.length} plan{category.plans.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-sm disabled:opacity-50"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(category)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-sm disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border backdrop-blur-xl ${
              toast.type === "success"
                ? "bg-green-500/20 border-green-500/50 text-green-300"
                : toast.type === "error"
                ? "bg-red-500/20 border-red-500/50 text-red-300"
                : "bg-blue-500/20 border-blue-500/50 text-blue-300"
            }`}
          >
            {toast.type === "success" && <CheckCircle size={24} className="flex-shrink-0" />}
            {toast.type === "error" && <XCircle size={24} className="flex-shrink-0" />}
            {toast.type === "info" && <AlertCircle size={24} className="flex-shrink-0" />}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, message: "", type: "" })}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0a0f23] border border-red-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertCircle size={28} className="text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Delete Category</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the category{" "}
              <span className="font-semibold text-white">{deleteModal.categoryName}</span>?
              <br />
              <span className="text-sm text-red-400 mt-2 block">This action cannot be undone.</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.categoryId)}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={20} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
