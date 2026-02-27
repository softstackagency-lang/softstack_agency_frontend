"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  DollarSign,
  Tag,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { auth } from "@/lib/firebase";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/pricing`;

export default function PricingPlanComponent() {
  const [categories, setCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: { USD: 0, BDT: 0 },
    duration: "month",
    features: [""],
    recommended: false,
    isActive: true,
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [deleteModal, setDeleteModal] = useState({ show: false, planId: null, planName: "" });

  // Fetch categories and plans on component mount
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

  const getAuthToken = async () => {
    const user = auth.currentUser;
    if (!user) {
      showToast("Please log in to continue", "error");
      return null;
    }
    return await user.getIdToken();
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const idToken = await getAuthToken();
      if (!idToken) return;

      const response = await fetch(API_BASE_URL, {
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data.categories) {
        setCategories(data.data.categories);
        // Extract all plans from all categories
        const allPlans = [];
        data.data.categories.forEach((category) => {
          if (category.plans && category.plans.length > 0) {
            category.plans.forEach(plan => {
              allPlans.push({
                ...plan,
                categoryId: category._id,
                categoryName: category.name,
              });
            });
          }
        });
        setPlans(allPlans);
      }
    } catch (error) {
      showToast("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      name: "",
      categoryId: "",
      price: { USD: 0, BDT: 0 },
      duration: "month",
      features: [""],
      recommended: false,
      isActive: true,
    });
  };

  const handleEdit = (plan) => {
    setEditingId(plan.id);
    setFormData({
      name: plan.name,
      categoryId: plan.categoryId,
      price: typeof plan.price === 'object' ? plan.price : { USD: plan.price || 0, BDT: 0 },
      duration: plan.duration,
      features: plan.features || [""],
      recommended: plan.recommended || false,
      isActive: plan.isActive,
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast("Please enter a plan name", "error");
      return;
    }
    if (!formData.categoryId) {
      showToast("Please select a category", "error");
      return;
    }
    if (formData.features.filter(f => f.trim()).length === 0) {
      showToast("Please add at least one feature", "error");
      return;
    }

    setLoading(true);
    try {
      const idToken = await getAuthToken();
      if (!idToken) return;

      // Filter out empty features
      const cleanedFeatures = formData.features.filter(f => f.trim());

      if (editingId) {
        // Update existing plan using PATCH
        const response = await fetch(`${API_BASE_URL}/categories/${formData.categoryId}/plans/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            name: formData.name,
            price: formData.price,
            duration: formData.duration,
            features: cleanedFeatures,
            recommended: formData.recommended,
            isActive: formData.isActive,
          }),
        });

        if (response.ok) {
          showToast("Plan updated successfully!", "success");
          fetchCategories();
          setEditingId(null);
        } else {
          const error = await response.json();
          showToast(error.message || "Failed to update plan", "error");
        }
      } else {
        // Create new plan
        const response = await fetch(`${API_BASE_URL}/categories/${formData.categoryId}/plans`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            name: formData.name,
            price: formData.price,
            duration: formData.duration,
            features: cleanedFeatures,
            recommended: formData.recommended,
            isActive: formData.isActive,
          }),
        });

        if (response.ok) {
          showToast("Plan created successfully!", "success");
          fetchCategories();
          setIsAdding(false);
        } else {
          const error = await response.json();
          showToast(error.message || "Failed to create plan", "error");
        }
      }
      setFormData({
        name: "",
        categoryId: "",
        price: { USD: 0, BDT: 0 },
        duration: "month",
        features: [""],
        recommended: false,
        isActive: true,
      });
    } catch (error) {
      showToast("Failed to save plan", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId, planId) => {
    setLoading(true);
    setDeleteModal({ show: false, planId: null, planName: "" });
    
    try {
      const idToken = await getAuthToken();
      if (!idToken) return;

      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/plans/${planId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        showToast("Plan deleted successfully!", "success");
        fetchCategories();
      } else {
        const error = await response.json();
        showToast(error.message || "Failed to delete plan", "error");
      }
    } catch (error) {
      showToast("Failed to delete plan", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (plan) => {
    setDeleteModal({ show: true, planId: plan.id, planName: plan.name, categoryId: plan.categoryId });
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, planId: null, planName: "", categoryId: null });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: "",
      categoryId: "",
      price: { USD: 0, BDT: 0 },
      duration: "month",
      features: [""],
      recommended: false,
      isActive: true,
    });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const cardStyle =
    "bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500";

  return (
    <div className="relative min-h-screen p-6 overflow-auto text-slate-200">
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pricing Plans</h1>
          <p className="text-gray-400">Manage pricing plans and packages for your services</p>
        </div>

        {/* Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">All Plans</h2>
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
                Add Plan
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className={`${cardStyle} mb-6`}>
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Pricing Plan" : "Add New Pricing Plan"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Plan Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#05060a] border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Basic, Professional"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2 bg-[#05060a] border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={loading || editingId}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {editingId && (
                    <p className="text-xs text-gray-500 mt-1">Category cannot be changed when editing</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price (USD) *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.price.USD}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      setFormData({ ...formData, price: { ...formData.price, USD: parseFloat(value) || 0 } });
                    }}
                    className="w-full px-4 py-2 bg-[#05060a] border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="999"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price (BDT)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.price.BDT}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      setFormData({ ...formData, price: { ...formData.price, BDT: parseFloat(value) || 0 } });
                    }}
                    className="w-full px-4 py-2 bg-[#05060a] border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="99999"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 bg-[#05060a] border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={loading}
                  >
                    <option value="month">Per Month</option>
                    <option value="year">Per Year</option>
                    <option value="once">One Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Features</label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-[#05060a] border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter feature"
                        disabled={loading}
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addFeature}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Add Feature
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.recommended}
                    onChange={(e) =>
                      setFormData({ ...formData, recommended: e.target.checked })
                    }
                    className="w-4 h-4 accent-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-300">Recommended Plan</span>
                </label>
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
        {loading && plans.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <Loader2 size={48} className="animate-spin text-blue-500" />
          </div>
        )}

        {/* Plans Grid */}
        {!loading && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`${cardStyle} relative ${
                  plan.recommended ? "border-2 border-blue-500" : ""
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                    RECOMMENDED
                  </div>
                )}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    {!plan.isActive && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <Tag size={14} />
                    <span>{plan.categoryName || 'Unknown'}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold text-white">
                      ${typeof plan.price === 'object' ? (plan.price.USD || plan.price.BDT || 0) : plan.price}
                    </span>
                    <span className="text-gray-400">/{plan.duration}</span>
                  </div>
                  {typeof plan.price === 'object' && (
                    <div className="flex gap-2 text-sm text-gray-400 mb-4">
                      {plan.price.USD && <span>USD: ${plan.price.USD}</span>}
                      {plan.price.BDT && <span>BDT: ৳{plan.price.BDT}</span>}
                    </div>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features && plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check size={18} className="text-green-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-sm disabled:opacity-50"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(plan)}
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

        {!loading && plans.length === 0 && (
          <div className={`${cardStyle} text-center py-12`}>
            <DollarSign size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Pricing Plans Yet</h3>
            <p className="text-gray-500">Click &quot;Add Plan&quot; to create your first pricing plan</p>
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
              <h3 className="text-2xl font-bold text-white">Delete Plan</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the plan{" "}
              <span className="font-semibold text-white">&quot;{deleteModal.planName}&quot;</span>?
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
                onClick={() => handleDelete(deleteModal.categoryId, deleteModal.planId)}
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
