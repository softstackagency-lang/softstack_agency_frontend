"use client";
import React, { useState, useEffect } from "react";
import {
  Plus, Edit, Trash2, Save, X, Check, DollarSign, Tag,
  RefreshCw, Loader2, CheckCircle, XCircle, AlertCircle,
} from "lucide-react";
import { auth } from "@/lib/firebase";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/pricing`;

const defaultForm = {
  name: "", categoryId: "", price: { USD: 0, BDT: 0 },
  duration: "month", features: [""], recommended: false, isActive: true,
};

export default function PricingPlanComponent() {
  const [categories, setCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [deleteModal, setDeleteModal] = useState({ show: false, planId: null, planName: "", categoryId: null });

  useEffect(() => { fetchCategories(); }, []); // eslint-disable-line

  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
      return () => clearTimeout(t);
    }
  }, [toast.show]);

  const showToast = (message, type = "success") => setToast({ show: true, message, type });

  const getAuthToken = async () => {
    const user = auth.currentUser;
    if (!user) { showToast("Please log in to continue", "error"); return null; }
    return await user.getIdToken();
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const idToken = await getAuthToken();
      if (!idToken) return;
      const response = await fetch(API_BASE_URL, { headers: { "Authorization": `Bearer ${idToken}` } });
      const data = await response.json();
      if (data.success && data.data.categories) {
        setCategories(data.data.categories);
        const allPlans = [];
        data.data.categories.forEach((cat) => {
          (cat.plans || []).forEach(plan => allPlans.push({ ...plan, categoryId: cat._id, categoryName: cat.name }));
        });
        setPlans(allPlans);
      }
    } catch { showToast("Failed to fetch categories", "error"); }
    finally { setLoading(false); }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setShowFormModal(true);
  };

  const handleEdit = (plan) => {
    setEditingId(plan.id);
    setFormData({
      name: plan.name, categoryId: plan.categoryId,
      price: typeof plan.price === 'object' ? plan.price : { USD: plan.price || 0, BDT: 0 },
      duration: plan.duration, features: plan.features?.length ? plan.features : [""],
      recommended: plan.recommended || false, isActive: plan.isActive,
    });
    setShowFormModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) { showToast("Please enter a plan name", "error"); return; }
    if (!formData.categoryId) { showToast("Please select a category", "error"); return; }
    if (!formData.features.filter(f => f.trim()).length) { showToast("Please add at least one feature", "error"); return; }

    setLoading(true);
    try {
      const idToken = await getAuthToken();
      if (!idToken) return;
      const cleanedFeatures = formData.features.filter(f => f.trim());
      const body = { name: formData.name, price: formData.price, duration: formData.duration, features: cleanedFeatures, recommended: formData.recommended, isActive: formData.isActive };

      const url = editingId
        ? `${API_BASE_URL}/categories/${formData.categoryId}/plans/${editingId}`
        : `${API_BASE_URL}/categories/${formData.categoryId}/plans`;
      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, { method, headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` }, body: JSON.stringify(body) });

      if (response.ok) {
        showToast(`Plan ${editingId ? "updated" : "created"} successfully!`, "success");
        fetchCategories();
        setShowFormModal(false);
        setEditingId(null);
        setFormData(defaultForm);
      } else {
        const error = await response.json();
        showToast(error.message || `Failed to ${editingId ? "update" : "create"} plan`, "error");
      }
    } catch { showToast("Failed to save plan", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (categoryId, planId) => {
    setLoading(true);
    setDeleteModal({ show: false, planId: null, planName: "", categoryId: null });
    try {
      const idToken = await getAuthToken();
      if (!idToken) return;
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/plans/${planId}`, { method: "DELETE", headers: { "Authorization": `Bearer ${idToken}` } });
      if (response.ok) { showToast("Plan deleted successfully!", "success"); fetchCategories(); }
      else { const e = await response.json(); showToast(e.message || "Failed to delete plan", "error"); }
    } catch { showToast("Failed to delete plan", "error"); }
    finally { setLoading(false); }
  };

  const handleCancel = () => { setShowFormModal(false); setEditingId(null); setFormData(defaultForm); };
  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ""] });
  const updateFeature = (i, v) => { const f = [...formData.features]; f[i] = v; setFormData({ ...formData, features: f }); };
  const removeFeature = (i) => setFormData({ ...formData, features: formData.features.filter((_, idx) => idx !== i) });

  const cardStyle = "bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500";
  const inputClass = "w-full px-3 py-2.5 text-sm bg-[#05060a] border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors";
  const labelClass = "block text-sm text-gray-400 mb-1.5 font-medium";

  const Toggle = ({ checked, onChange, disabled, label }) => (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${checked ? 'bg-blue-500' : 'bg-slate-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  );

  return (
    <div className="relative min-h-screen p-3 sm:p-6 overflow-auto text-slate-200 max-w-7xl mx-auto">
      <div className="relative z-10">

        {/* Header */}
        <div className="mb-5 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Pricing Plans</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Manage pricing plans and packages for your services</p>
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center mb-5 sm:mb-6 gap-3">
          <h2 className="text-base sm:text-xl font-semibold text-white">
            All Plans
            {plans.length > 0 && <span className="ml-2 text-xs text-gray-500 font-normal">({plans.length})</span>}
          </h2>
          <div className="flex gap-2 sm:gap-3">
            <button onClick={fetchCategories} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 text-sm">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={handleAdd} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium">
              <Plus size={16} />
              <span>Add Plan</span>
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && plans.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <Loader2 size={40} className="animate-spin text-blue-500" />
          </div>
        )}

        {/* Empty State */}
        {!loading && plans.length === 0 && (
          <div className={`${cardStyle} p-6 sm:p-12 text-center`}>
            <DollarSign size={40} className="mx-auto text-gray-600 mb-3" />
            <h3 className="text-base sm:text-xl font-semibold text-gray-400 mb-2">No Pricing Plans Yet</h3>
            <p className="text-gray-500 text-sm">Click &quot;Add Plan&quot; to create your first pricing plan</p>
          </div>
        )}

        {/* Plans Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        {!loading && plans.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className={`${cardStyle} p-4 sm:p-5 lg:p-6 relative flex flex-col ${plan.recommended ? "border-2 border-blue-500" : ""}`}>

                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                    RECOMMENDED
                  </div>
                )}

                {/* Plan Name & Status */}
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">{plan.name}</h3>
                  {!plan.isActive && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded shrink-0">Inactive</span>
                  )}
                </div>

                {/* Category */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                  <Tag size={12} />
                  <span>{plan.categoryName || 'Unknown'}</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    ${typeof plan.price === 'object' ? (plan.price.USD || plan.price.BDT || 0) : plan.price}
                  </span>
                  <span className="text-gray-400 text-sm">/{plan.duration}</span>
                </div>
                {typeof plan.price === 'object' && (plan.price.USD || plan.price.BDT) && (
                  <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-3">
                    {plan.price.USD ? <span>USD: ${plan.price.USD}</span> : null}
                    {plan.price.BDT ? <span>BDT: ৳{plan.price.BDT}</span> : null}
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features?.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                      <Check size={15} className="text-green-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-blue-500/10">
                  <button onClick={() => handleEdit(plan)} disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 active:bg-blue-500/40 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => setDeleteModal({ show: true, planId: plan.id, planName: plan.name, categoryId: plan.categoryId })} disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast - centered top on mobile, top-right on desktop */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-[60] w-[min(90vw,360px)] sm:w-auto sm:max-w-sm">
          <div className={`flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-2xl border backdrop-blur-xl ${
            toast.type === "success" ? "bg-green-500/20 border-green-500/50 text-green-300"
            : toast.type === "error" ? "bg-red-500/20 border-red-500/50 text-red-300"
            : "bg-blue-500/20 border-blue-500/50 text-blue-300"
          }`}>
            {toast.type === "success" && <CheckCircle size={18} className="shrink-0" />}
            {toast.type === "error" && <XCircle size={18} className="shrink-0" />}
            {toast.type === "info" && <AlertCircle size={18} className="shrink-0" />}
            <span className="font-medium text-sm flex-1">{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: "", type: "" })} className="ml-1 hover:opacity-70 shrink-0"><X size={15} /></button>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal — bottom sheet on mobile, centered on desktop */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full sm:w-[min(100vw-2rem,600px)] max-h-[92dvh] sm:max-h-[88vh] bg-[#0a0f23] border-t sm:border border-slate-700 sm:border-blue-500/25 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col">

            {/* Drag handle (mobile only) */}
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700/80 shrink-0">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {editingId ? "Edit Pricing Plan" : "Add New Pricing Plan"}
              </h3>
              <button onClick={handleCancel}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 overscroll-contain px-4 sm:px-6 py-4">
              <div className="space-y-4">

                {/* Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Plan Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="dashboard-input" placeholder="e.g., Basic, Professional" disabled={loading} />
                  </div>
                  <div>
                    <label className={labelClass}>Category *</label>
                    <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="dashboard-select" disabled={loading || !!editingId}>
                      <option value="">Select a category</option>
                      {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                    {editingId && <p className="text-xs text-gray-500 mt-1">Category cannot be changed when editing</p>}
                  </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Price (USD) *</label>
                    <input type="text" inputMode="numeric" value={formData.price.USD}
                      onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, ''); setFormData({ ...formData, price: { ...formData.price, USD: parseFloat(v) || 0 } }); }}
                      className="dashboard-input" placeholder="999" disabled={loading} />
                  </div>
                  <div>
                    <label className={labelClass}>Price (BDT)</label>
                    <input type="text" inputMode="numeric" value={formData.price.BDT}
                      onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, ''); setFormData({ ...formData, price: { ...formData.price, BDT: parseFloat(v) || 0 } }); }}
                      className="dashboard-input" placeholder="99999" disabled={loading} />
                  </div>
                </div>

                {/* Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Duration</label>
                    <select value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="dashboard-select" disabled={loading}>
                      <option value="month">Per Month</option>
                      <option value="year">Per Year</option>
                      <option value="once">One Time</option>
                    </select>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className={labelClass}>Features</label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={feature} onChange={(e) => updateFeature(index, e.target.value)}
                          className="dashboard-input flex-1" placeholder="Enter feature" disabled={loading} />
                        <button onClick={() => removeFeature(index)}
                          className="w-10 h-10 flex items-center justify-center bg-red-500/15 hover:bg-red-500/25 active:bg-red-500/35 rounded-lg transition-colors shrink-0">
                          <X size={15} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                    <button onClick={addFeature}
                      className="flex items-center gap-1.5 px-3 py-2 bg-blue-500/15 hover:bg-blue-500/25 rounded-lg transition-colors text-sm text-blue-300 font-medium">
                      <Plus size={14} /> Add Feature
                    </button>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <Toggle checked={formData.recommended} onChange={(v) => setFormData({ ...formData, recommended: v })} disabled={loading} label="Recommended Plan" />
                  <Toggle checked={formData.isActive} onChange={(v) => setFormData({ ...formData, isActive: v })} disabled={loading} label="Active" />
                </div>

                <div className="h-1" />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-700/80 shrink-0 bg-[#0a0f23] rounded-b-2xl">
              <div className="flex gap-3">
                <button onClick={handleCancel} disabled={loading}
                  className="flex-1 sm:flex-none sm:w-28 flex items-center justify-center gap-1.5 py-2.5 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  <X size={15} /> Cancel
                </button>
                <button onClick={handleSave} disabled={loading}
                  className="flex-1 sm:flex-none sm:w-36 flex items-center justify-center gap-1.5 py-2.5 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {loading ? "Saving..." : "Save Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal — bottom sheet on mobile, centered on desktop */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:w-auto sm:max-w-md bg-[#0a0f23] border-t sm:border border-slate-700 sm:border-red-500/30 rounded-t-2xl sm:rounded-2xl p-5 sm:p-8 shadow-2xl">
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="p-2.5 bg-red-500/20 rounded-full shrink-0">
                <AlertCircle size={22} className="text-red-400" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white">Delete Plan</h3>
            </div>
            <p className="text-gray-300 text-sm sm:text-base mb-5 sm:mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">&quot;{deleteModal.planName}&quot;</span>?
              <span className="text-xs sm:text-sm text-red-400 mt-1.5 block">This action cannot be undone.</span>
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ show: false, planId: null, planName: "", categoryId: null })}
                className="flex-1 py-2.5 sm:py-3 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteModal.categoryId, deleteModal.planId)} disabled={loading}
                className="flex-1 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Deleting...</> : <><Trash2 size={16} /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}