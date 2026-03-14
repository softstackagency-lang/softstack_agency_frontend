"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Package,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  Plus,
  Upload,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { productApi } from "@/lib/api";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { uploadImageToImgBB } from "@/lib/imgbb-upload";

export default function ProductComponent() {
  const { user } = useCustomAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  /* ─── Shared card style (same as HomeManagement) ─── */
  const cardStyle =
    "bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 sm:p-6 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500";

  const emptyForm = {
    slug: "",
    title: "",
    tagline: "",
    description: "",
    coverImage: { url: "", alt: "" },
    badge: { label: "", color: "" },
    liveLink: "",
    repoLink: "",
    highlights: [{ label: "", value: "" }],
    features: [""],
    cta: { text: "", url: "" },
    theme: { gradientFrom: "", gradientTo: "" },
    status: "active",
    order: 0,
  };

  const [editForm, setEditForm] = useState(emptyForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAllProducts();
      if (data.success) {
        setProducts(Array.isArray(data.data) ? data.data : []);
      } else {
        setError(data.message || "Failed to fetch projects");
        setProducts([]);
      }
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditForm(emptyForm);
    setShowCreateModal(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditForm({
      slug: product.slug || "",
      title: product.title || "",
      tagline: product.tagline || "",
      description: product.description || "",
      coverImage: product.coverImage || { url: "", alt: "" },
      badge: product.badge || { label: "", color: "" },
      liveLink: product.liveLink || "",
      repoLink: product.repoLink || "",
      highlights: product.highlights || [{ label: "", value: "" }],
      features: product.features || [""],
      cta: product.cta || { text: "", url: "" },
      theme: product.theme || { gradientFrom: "", gradientTo: "" },
      status: product.status || "active",
      order: product.order || 0,
    });
    setShowEditModal(true);
  };

  const closeFormModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditForm(emptyForm);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      setImageUploading(true);
      const result = await uploadImageToImgBB(file);
      if (result.success) {
        setEditForm({ ...editForm, coverImage: { ...editForm.coverImage, url: result.imageUrl } });
      } else {
        setError(result.error || "Failed to upload image");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError("Error uploading image");
      setTimeout(() => setError(null), 3000);
    } finally {
      setImageUploading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user?.uid) { setError("User not authenticated"); return; }
    try {
      setLoading(true);
      const data = await productApi.createProduct(user.uid, editForm);
      if (data.success) {
        setShowCreateModal(false);
        setSuccessMessage("Project created successfully!");
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
        await fetchProducts();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await productApi.updateProduct(selectedProduct._id, editForm);
      if (data.success) {
        setShowEditModal(false);
        setSuccessMessage("Project updated successfully!");
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
        await fetchProducts();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await productApi.deleteProduct(selectedProduct._id);
      setProducts(products.filter((p) => p._id !== selectedProduct._id));
      setShowDeleteModal(false);
      setSelectedProduct(null);
      setSuccessMessage("Project deleted successfully!");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && products.length === 0) {
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
            Projects Management
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400">
            Create, edit, and manage your portfolio projects
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        {/* ── Toolbar: Search + Add ── */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5 sm:mb-6">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 text-white pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 text-sm placeholder-gray-500 transition-colors"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            Add Project
          </button>
        </div>

        {/* ── Products Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredProducts.length === 0 && !loading && (
            <div className={`${cardStyle} md:col-span-2 text-center py-10 sm:py-12`}>
              <Package className="mx-auto mb-3 sm:mb-4 text-gray-600 w-10 h-10 sm:w-12 sm:h-12" />
              <p className="text-gray-400 text-sm sm:text-base">No projects found. Create your first project!</p>
            </div>
          )}

          {filteredProducts.map((product) => (
            <div key={product._id} className={`${cardStyle} relative`}>
              {/* Badge */}
              {product.badge?.label && (
                <div className="absolute top-3 right-3 bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-semibold border border-blue-500/30">
                  {product.badge.label}
                </div>
              )}

              {/* Cover Image */}
              {product.coverImage?.url && (
                <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden mb-4 border border-blue-500/20">
                  <Image
                    src={product.coverImage.url}
                    alt={product.coverImage.alt || product.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f23]/80 to-transparent" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${product.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                      }`}
                  >
                    {product.status}
                  </span>
                  {product.order !== undefined && (
                    <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded">
                      Order: {product.order}
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-0.5 truncate">{product.title}</h4>
                {product.tagline && (
                  <p className="text-xs sm:text-sm text-gray-400 truncate mb-1">{product.tagline}</p>
                )}
                {product.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {product.liveLink && (
                    <a
                      href={product.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded border border-green-500/20 hover:bg-green-500/30 transition-colors"
                    >
                      Live Demo ↗
                    </a>
                  )}
                  {product.repoLink && (
                    <a
                      href={product.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded border border-purple-500/20 hover:bg-purple-500/30 transition-colors"
                    >
                      Repo ↗
                    </a>
                  )}
                </div>

                {/* Features preview */}
                {product.features?.length > 0 && product.features[0] && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.features.slice(0, 3).map((f, i) =>
                      f ? (
                        <span key={i} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded">
                          {f}
                        </span>
                      ) : null
                    )}
                    {product.features.length > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded">
                        +{product.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {product.createdAt && (
                  <p className="text-xs text-gray-600 mb-3">
                    {new Date(product.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {product.postedBy?.displayName && ` · ${product.postedBy.displayName}`}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => { setSelectedProduct(product); setShowViewModal(true); }}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors text-xs sm:text-sm text-blue-400"
                >
                  <Eye size={14} className="sm:w-4 sm:h-4" />
                  View
                </button>
                <button
                  onClick={() => openEditModal(product)}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50"
                >
                  <Edit size={14} className="sm:w-4 sm:h-4" />
                  Edit
                </button>
                <button
                  onClick={() => { setSelectedProduct(product); setShowDeleteModal(true); }}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ══════════ VIEW MODAL ══════════ */}
        {showViewModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-[#0a0f23]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.2)] w-full max-w-sm sm:max-w-2xl md:max-w-3xl max-h-[92vh] overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-start gap-3 p-4 sm:p-6 border-b border-blue-500/20">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${selectedProduct.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {selectedProduct.status}
                    </span>
                    {selectedProduct.badge?.label && (
                      <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                        {selectedProduct.badge.label}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white truncate">{selectedProduct.title}</h2>
                  {selectedProduct.tagline && (
                    <p className="text-xs sm:text-sm text-gray-400">{selectedProduct.tagline}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto max-h-[calc(92vh-120px)] p-4 sm:p-6 space-y-4 sm:space-y-5">
                {selectedProduct.coverImage?.url && (
                  <div className="relative rounded-xl overflow-hidden border border-blue-500/20 w-full h-44 sm:h-64">
                    <Image
                      src={selectedProduct.coverImage.url}
                      alt={selectedProduct.coverImage.alt || selectedProduct.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f23]/70 to-transparent" />
                  </div>
                )}

                {/* Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoBlock label="Slug" value={selectedProduct.slug} mono />
                  {selectedProduct.createdAt && (
                    <InfoBlock label="Created" value={new Date(selectedProduct.createdAt).toLocaleString()} />
                  )}
                  {(selectedProduct.postedBy?.displayName || selectedProduct.postedBy?.email) && (
                    <div className="sm:col-span-2">
                      <InfoBlock label="Posted By" value={selectedProduct.postedBy?.displayName || selectedProduct.postedBy?.email} />
                    </div>
                  )}
                </div>

                {selectedProduct.description && (
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Description</label>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{selectedProduct.description}</p>
                  </div>
                )}

                {/* Links */}
                {(selectedProduct.liveLink || selectedProduct.repoLink) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProduct.liveLink && (
                      <a href={selectedProduct.liveLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-xl p-3 sm:p-4 transition-all">
                        <Eye className="text-green-400 flex-shrink-0" size={18} />
                        <div className="min-w-0">
                          <label className="text-green-400 text-xs uppercase tracking-wide block">Live Demo</label>
                          <p className="text-white text-xs sm:text-sm truncate">{selectedProduct.liveLink}</p>
                        </div>
                      </a>
                    )}
                    {selectedProduct.repoLink && (
                      <a href={selectedProduct.repoLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl p-3 sm:p-4 transition-all">
                        <Package className="text-purple-400 flex-shrink-0" size={18} />
                        <div className="min-w-0">
                          <label className="text-purple-400 text-xs uppercase tracking-wide block">Repository</label>
                          <p className="text-white text-xs sm:text-sm truncate">{selectedProduct.repoLink}</p>
                        </div>
                      </a>
                    )}
                  </div>
                )}

                {/* Highlights */}
                {selectedProduct.highlights?.length > 0 && selectedProduct.highlights[0]?.label && (
                  <div className="bg-[#0a0f23]/60 border border-blue-500/20 rounded-xl p-4 sm:p-5">
                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-3 block">Highlights</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProduct.highlights.map((h, i) =>
                        h.label ? (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">
                              <span className="text-white font-medium">{h.label}:</span>{" "}
                              <span className="text-gray-400">{h.value}</span>
                            </span>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                )}

                {/* Features */}
                {selectedProduct.features?.length > 0 && selectedProduct.features[0] && (
                  <div className="bg-[#0a0f23]/60 border border-blue-500/20 rounded-xl p-4 sm:p-5">
                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-3 block">Features</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProduct.features.map((f, i) =>
                        f ? (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                            <p className="text-gray-300 text-xs sm:text-sm">{f}</p>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                )}

                {/* CTA */}
                {selectedProduct.cta?.url && (
                  <div className="bg-blue-500/5 border border-blue-500/30 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <label className="text-blue-400 text-xs uppercase tracking-wide block mb-1">Call to Action</label>
                      <p className="text-white font-medium text-sm">{selectedProduct.cta.text || "Learn More"}</p>
                      <p className="text-gray-400 text-xs truncate">{selectedProduct.cta.url}</p>
                    </div>
                    <a href={selectedProduct.cta.url} target="_blank" rel="noopener noreferrer"
                      className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-xs sm:text-sm flex-shrink-0">
                      Visit
                    </a>
                  </div>
                )}

                {/* Theme */}
                {(selectedProduct.theme?.gradientFrom || selectedProduct.theme?.gradientTo) && (
                  <div className="bg-[#0a0f23]/60 border border-blue-500/20 rounded-xl p-3 sm:p-4">
                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-3 block">Theme Colors</label>
                    <div className="flex flex-wrap gap-4">
                      {selectedProduct.theme.gradientFrom && (
                        <div>
                          <p className="text-gray-400 text-xs mb-1.5">From</p>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded border border-blue-500/30" style={{ backgroundColor: selectedProduct.theme.gradientFrom }} />
                            <span className="text-white text-xs font-mono">{selectedProduct.theme.gradientFrom}</span>
                          </div>
                        </div>
                      )}
                      {selectedProduct.theme.gradientTo && (
                        <div>
                          <p className="text-gray-400 text-xs mb-1.5">To</p>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded border border-blue-500/30" style={{ backgroundColor: selectedProduct.theme.gradientTo }} />
                            <span className="text-white text-xs font-mono">{selectedProduct.theme.gradientTo}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ CREATE / EDIT MODAL ══════════ */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 pt-16 sm:pt-4 z-50 overflow-y-auto">
            <div className="bg-[#0a0f23]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.2)] w-full max-w-sm sm:max-w-2xl md:max-w-3xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden my-4">

              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-blue-500/20 sticky top-0 bg-[#0a0f23]/95 backdrop-blur-xl z-10">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                  {showCreateModal ? "Add New Project" : "Edit Project"}
                </h3>
                <button
                  onClick={closeFormModal}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Form */}
              <form
                onSubmit={showCreateModal ? handleCreate : handleUpdate}
                className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 sm:p-6 space-y-4 sm:space-y-5 pb-24 sm:pb-8"
              >

                {/* ── Basic Info ── */}
                <FormSection title="Basic Information">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Slug *</label>
                      <input
                        type="text"
                        value={editForm.slug}
                        onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                        className="dashboard-input"
                        placeholder="my-project"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Title *</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="dashboard-input"
                        placeholder="Project Title"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Tagline</label>
                    <input
                      type="text"
                      value={editForm.tagline}
                      onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                      className="dashboard-input"
                      placeholder="Short catchy tagline"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="dashboard-textarea min-h-[80px] sm:min-h-[100px]"
                      placeholder="Describe your project..."
                    />
                  </div>
                </FormSection>

                {/* ── Cover Image ── */}
                <FormSection title="Cover Image">
                  {editForm.coverImage.url && (
                    <div className="relative w-full h-36 sm:h-48 rounded-xl overflow-hidden border border-blue-500/20 mb-3">
                      <Image src={editForm.coverImage.url} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f23]/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded border border-green-500/30">
                        Image uploaded successfully
                      </div>
                    </div>
                  )}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg cursor-pointer transition-colors border border-blue-500/30 text-sm">
                        <ImageIcon size={16} className="sm:w-5 sm:h-5" />
                        {imageUploading ? "Uploading..." : "Upload Image"}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={imageUploading} />
                      </label>
                      {imageUploading && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-500" />}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Image URL</label>
                        <input
                          type="text"
                          value={editForm.coverImage.url}
                          onChange={(e) => setEditForm({ ...editForm, coverImage: { ...editForm.coverImage, url: e.target.value } })}
                          className="dashboard-input"
                          placeholder="Or paste image URL"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Alt Text</label>
                        <input
                          type="text"
                          value={editForm.coverImage.alt}
                          onChange={(e) => setEditForm({ ...editForm, coverImage: { ...editForm.coverImage, alt: e.target.value } })}
                          className="dashboard-input"
                          placeholder="Image description"
                        />
                      </div>
                    </div>
                  </div>
                </FormSection>

                {/* ── Badge ── */}
                <FormSection title="Badge">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Label</label>
                      <input
                        type="text"
                        value={editForm.badge.label}
                        onChange={(e) => setEditForm({ ...editForm, badge: { ...editForm.badge, label: e.target.value } })}
                        className="dashboard-input"
                        placeholder="New"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Color</label>
                      <input
                        type="text"
                        value={editForm.badge.color}
                        onChange={(e) => setEditForm({ ...editForm, badge: { ...editForm.badge, color: e.target.value } })}
                        className="dashboard-input"
                        placeholder="cyan-500"
                      />
                    </div>
                  </div>
                </FormSection>

                {/* ── Links ── */}
                <FormSection title="Links">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Live Link</label>
                      <input
                        type="url"
                        value={editForm.liveLink}
                        onChange={(e) => setEditForm({ ...editForm, liveLink: e.target.value })}
                        className="dashboard-input"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Repository Link</label>
                      <input
                        type="url"
                        value={editForm.repoLink}
                        onChange={(e) => setEditForm({ ...editForm, repoLink: e.target.value })}
                        className="dashboard-input"
                        placeholder="https://github.com/user/repo"
                      />
                    </div>
                  </div>
                </FormSection>

                {/* ── Highlights ── */}
                <FormSection title="Highlights">
                  {editForm.highlights.map((highlight, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
                      <input
                        type="text"
                        value={highlight.label}
                        onChange={(e) => {
                          const n = [...editForm.highlights];
                          n[index].label = e.target.value;
                          setEditForm({ ...editForm, highlights: n });
                        }}
                        className="dashboard-input flex-1"
                        placeholder="Label (e.g. Tech Stack)"
                      />
                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          value={highlight.value}
                          onChange={(e) => {
                            const n = [...editForm.highlights];
                            n[index].value = e.target.value;
                            setEditForm({ ...editForm, highlights: n });
                          }}
                          className="dashboard-input flex-1"
                          placeholder="Value (e.g. React, Node)"
                        />
                        <button
                          type="button"
                          onClick={() => setEditForm({ ...editForm, highlights: editForm.highlights.filter((_, i) => i !== index) })}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 flex-shrink-0"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, highlights: [...editForm.highlights, { label: "", value: "" }] })}
                    className="text-xs px-2 sm:px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 border border-blue-500/20"
                  >
                    + Add Highlight
                  </button>
                </FormSection>

                {/* ── Features ── */}
                <FormSection title="Features">
                  {editForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const n = [...editForm.features];
                          n[index] = e.target.value;
                          setEditForm({ ...editForm, features: n });
                        }}
                        className="dashboard-input flex-1"
                        placeholder="Feature description"
                      />
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, features: editForm.features.filter((_, i) => i !== index) })}
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 flex-shrink-0"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, features: [...editForm.features, ""] })}
                    className="text-xs px-2 sm:px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 border border-blue-500/20"
                  >
                    + Add Feature
                  </button>
                </FormSection>

                {/* ── CTA ── */}
                <FormSection title="Call to Action">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Button Text</label>
                      <input
                        type="text"
                        value={editForm.cta.text}
                        onChange={(e) => setEditForm({ ...editForm, cta: { ...editForm.cta, text: e.target.value } })}
                        className="dashboard-input"
                        placeholder="Learn More"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Button URL</label>
                      <input
                        type="url"
                        value={editForm.cta.url}
                        onChange={(e) => setEditForm({ ...editForm, cta: { ...editForm.cta, url: e.target.value } })}
                        className="dashboard-input"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </FormSection>

                {/* ── Theme ── */}
                <FormSection title="Theme Colors">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Gradient From</label>
                      <input
                        type="text"
                        value={editForm.theme.gradientFrom}
                        onChange={(e) => setEditForm({ ...editForm, theme: { ...editForm.theme, gradientFrom: e.target.value } })}
                        className="dashboard-input"
                        placeholder="#3b82f6 or cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Gradient To</label>
                      <input
                        type="text"
                        value={editForm.theme.gradientTo}
                        onChange={(e) => setEditForm({ ...editForm, theme: { ...editForm.theme, gradientTo: e.target.value } })}
                        className="dashboard-input"
                        placeholder="#6366f1 or blue-600"
                      />
                    </div>
                  </div>
                </FormSection>

                {/* ── Status + Order ── */}
                <FormSection title="Settings">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="dashboard-select"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Order</label>
                      <input
                        type="number"
                        value={editForm.order}
                        onChange={(e) => setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })}
                        className="dashboard-input"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </FormSection>

                {/* ── Submit ── */}
                <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                      <Save size={16} className="sm:w-5 sm:h-5" />
                    )}
                    {showCreateModal ? "Create Project" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={closeFormModal}
                    disabled={loading}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    <X size={16} className="sm:w-5 sm:h-5" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══════════ DELETE MODAL ══════════ */}
        {showDeleteModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${cardStyle} max-w-sm sm:max-w-md w-full`}>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <AlertTriangle className="text-red-400 flex-shrink-0" size={22} />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold">Confirm Delete</h3>
              </div>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to delete{" "}
                <span className="text-white font-semibold">"{selectedProduct.title}"</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />}
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
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

        {/* ══════════ SUCCESS MODAL ══════════ */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${cardStyle} max-w-xs sm:max-w-md w-full`}>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <CheckCircle className="text-green-400 flex-shrink-0" size={22} />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold">Success</h3>
              </div>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">{successMessage}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-sm sm:text-base"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ─── Helper: InfoBlock ─── */
function InfoBlock({ label, value, mono = false }) {
  return (
    <div className="bg-[#0a0f23]/60 border border-blue-500/20 rounded-xl p-3 sm:p-4">
      <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">{label}</label>
      <p className={`text-white text-xs sm:text-sm break-all ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

/* ─── Helper: FormSection ─── */
function FormSection({ title, children }) {
  return (
    <div className="border-t border-blue-500/10 pt-4 sm:pt-5 space-y-3 sm:space-y-4">
      <h4 className="text-xs sm:text-sm font-semibold text-blue-400 uppercase tracking-widest">{title}</h4>
      {children}
    </div>
  );
}