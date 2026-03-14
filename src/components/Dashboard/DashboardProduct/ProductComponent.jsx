"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Package, Search, Eye, Edit, Trash2, X, Save, AlertTriangle, Plus, Upload, Loader2 } from 'lucide-react';
import { productApi } from '@/lib/api';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { uploadImageToImgBB } from '@/lib/imgbb-upload';

export default function ProductComponent() {
  const { user } = useCustomAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const emptyForm = {
    slug: '', title: '', tagline: '', description: '',
    coverImage: { url: '', alt: '' },
    badge: { label: '', color: '' },
    liveLink: '', repoLink: '',
    highlights: [{ label: '', value: '' }],
    features: [''],
    cta: { text: '', url: '' },
    theme: { gradientFrom: '', gradientTo: '' },
    status: 'active', order: 0,
  };

  const [editForm, setEditForm] = useState(emptyForm);

  useEffect(() => { fetchProducts(); }, []);

  const openCreateModal = () => { setEditForm(emptyForm); setShowCreateModal(true); };
  const resetForm = () => setEditForm(emptyForm);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAllProducts();
      if (data.success) {
        setProducts(Array.isArray(data.data) ? data.data : []);
      } else {
        setError(data.message || 'Failed to fetch projects');
        setProducts([]);
      }
    } catch (error) {
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select a valid image file'); setTimeout(() => setError(null), 3000); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image size should be less than 5MB'); setTimeout(() => setError(null), 3000); return; }
    try {
      setImageUploading(true);
      const result = await uploadImageToImgBB(file);
      if (result.success) {
        setEditForm({ ...editForm, coverImage: { ...editForm.coverImage, url: result.imageUrl } });
        setSuccessMessage('Image uploaded successfully!');
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
        setError(result.error || 'Failed to upload image');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError('Error uploading image');
      setTimeout(() => setError(null), 3000);
    } finally {
      setImageUploading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user?.uid) { setError('User not authenticated'); return; }
    try {
      const data = await productApi.createProduct(user.uid, editForm);
      if (data.success) {
        setShowCreateModal(false);
        setSuccessMessage('Project created successfully!');
        setShowSuccessModal(true);
        fetchProducts();
      }
    } catch (error) { setError(error.message); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await productApi.updateProduct(selectedProduct._id, editForm);
      if (data.success) {
        setShowEditModal(false);
        setSuccessMessage('Project updated successfully!');
        setShowSuccessModal(true);
        fetchProducts();
      }
    } catch (error) { setError(error.message); }
  };

  const handleDelete = async () => {
    try {
      await productApi.deleteProduct(selectedProduct._id);
      setProducts(products.filter(p => p._id !== selectedProduct._id));
      setShowDeleteModal(false);
      setSelectedProduct(null);
      setSuccessMessage('Project deleted successfully!');
      setShowSuccessModal(true);
    } catch (error) { setError(error.message); }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditForm({
      slug: product.slug || '', title: product.title || '', tagline: product.tagline || '',
      description: product.description || '',
      coverImage: product.coverImage || { url: '', alt: '' },
      badge: product.badge || { label: '', color: '' },
      liveLink: product.liveLink || '', repoLink: product.repoLink || '',
      highlights: product.highlights || [{ label: '', value: '' }],
      features: product.features || [''],
      cta: product.cta || { text: '', url: '' },
      theme: product.theme || { gradientFrom: '', gradientTo: '' },
      status: product.status || 'active', order: product.order || 0,
    });
    setShowEditModal(true);
  };

  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeFormModal = () => { setShowCreateModal(false); setShowEditModal(false); resetForm(); };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  /* ─── shared input style ─── */
  const inp = "w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500";
  const sectionHead = "text-white font-medium mb-2 text-sm sm:text-base";

  return (
    <div className="p-3 sm:p-4 md:p-6">

      {/* ── Page header ── */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 sm:mb-6 mt-12 md:mt-0">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Projects</h1>
        <button
          onClick={openCreateModal}
          aria-label="Add a new project"
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-colors"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 sm:p-4 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* ── Search + Table card ── */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-3 sm:p-4 md:p-6">
        {/* Search */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        {/* ── DESKTOP TABLE (md+) ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-700">
                {['Title', 'Status', 'Created', 'Posted By', 'Actions'].map(h => (
                  <th key={h} className="pb-3 text-gray-400 font-medium text-sm">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 text-sm">No projects found.</td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="py-4">
                    <p className="text-white font-medium text-sm">{product.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{product.tagline}</p>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-400 text-xs">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }) : 'N/A'}
                  </td>
                  <td className="py-4 text-gray-400 text-xs">
                    {product.postedBy?.displayName || product.postedBy?.email || 'Unknown'}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-1.5">
                      <button onClick={() => { setSelectedProduct(product); setShowViewModal(true); }} aria-label="View project details" className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded transition-colors"><Eye size={16} /></button>
                      <button onClick={() => openEditModal(product)} aria-label="Edit project" className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"><Edit size={16} /></button>
                      <button onClick={() => { setSelectedProduct(product); setShowDeleteModal(true); }} aria-label="Delete project" className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE / TABLET CARDS (below md) ── */}
        <div className="md:hidden space-y-3">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No projects found.</p>
          ) : filteredProducts.map((product) => (
            <div key={product._id} className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-3.5 hover:bg-slate-700/50 transition-colors">
              {/* Title row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{product.title}</p>
                  {product.tagline && <p className="text-gray-400 text-xs mt-0.5 truncate">{product.tagline}</p>}
                </div>
                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => { setSelectedProduct(product); setShowViewModal(true); }} className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded transition-colors"><Eye size={15} /></button>
                  <button onClick={() => openEditModal(product)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"><Edit size={15} /></button>
                  <button onClick={() => { setSelectedProduct(product); setShowDeleteModal(true); }} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-600/40">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {product.status}
                </span>
                <span className="text-gray-500 text-xs">
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                </span>
                <span className="text-gray-500 text-xs ml-auto truncate max-w-[120px]">
                  {product.postedBy?.displayName || product.postedBy?.email || 'Unknown'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ VIEW MODAL ══════════ */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-2xl md:max-w-4xl max-h-[92vh] overflow-hidden border border-cyan-500/20">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-b border-cyan-500/20 p-4 sm:p-6">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-3xl font-bold text-white mb-1 truncate">{selectedProduct.title}</h2>
                  <p className="text-gray-400 text-xs sm:text-sm">{selectedProduct.tagline}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-3">
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${selectedProduct.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {selectedProduct.status}
                    </span>
                    {selectedProduct.badge?.label && (
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {selectedProduct.badge.label}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-white hover:bg-white/10 p-1.5 sm:p-2 rounded-lg transition-all flex-shrink-0">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[calc(92vh-120px)] p-4 sm:p-6 space-y-4 sm:space-y-6">
              {selectedProduct.coverImage?.url && (
                <div className="relative rounded-xl overflow-hidden border border-cyan-500/20">
                  <Image src={selectedProduct.coverImage.url} alt={selectedProduct.coverImage.alt || selectedProduct.title} width={800} height={400} className="w-full h-40 sm:h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-700/50">
                  <label className="text-gray-400 text-xs uppercase tracking-wide mb-1 block">Slug</label>
                  <p className="text-white font-mono text-xs sm:text-sm break-all">{selectedProduct.slug}</p>
                </div>
                {selectedProduct.createdAt && (
                  <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-700/50">
                    <label className="text-gray-400 text-xs uppercase tracking-wide mb-1 block">Created</label>
                    <p className="text-white text-xs sm:text-sm">{new Date(selectedProduct.createdAt).toLocaleString()}</p>
                  </div>
                )}
                {(selectedProduct.postedBy?.displayName || selectedProduct.postedBy?.email) && (
                  <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-700/50 sm:col-span-2">
                    <label className="text-gray-400 text-xs uppercase tracking-wide mb-1 block">Posted By</label>
                    <p className="text-white text-xs sm:text-sm">{selectedProduct.postedBy?.displayName || selectedProduct.postedBy?.email}</p>
                  </div>
                )}
              </div>

              {selectedProduct.description && (
                <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-lg p-4 sm:p-5 border border-cyan-500/20">
                  <label className="text-cyan-400 text-xs uppercase tracking-wide mb-2 block font-semibold">Description</label>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{selectedProduct.description}</p>
                </div>
              )}

              {(selectedProduct.liveLink || selectedProduct.repoLink) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProduct.liveLink && (
                    <a href={selectedProduct.liveLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/30 rounded-lg p-3 sm:p-4 transition-all group">
                      <Eye className="text-green-400 flex-shrink-0" size={18} />
                      <div className="flex-1 min-w-0">
                        <label className="text-green-400 text-xs uppercase tracking-wide block">Live Demo</label>
                        <p className="text-white text-xs sm:text-sm truncate">{selectedProduct.liveLink}</p>
                      </div>
                    </a>
                  )}
                  {selectedProduct.repoLink && (
                    <a href={selectedProduct.repoLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/30 rounded-lg p-3 sm:p-4 transition-all group">
                      <Package className="text-purple-400 flex-shrink-0" size={18} />
                      <div className="flex-1 min-w-0">
                        <label className="text-purple-400 text-xs uppercase tracking-wide block">Repository</label>
                        <p className="text-white text-xs sm:text-sm truncate">{selectedProduct.repoLink}</p>
                      </div>
                    </a>
                  )}
                </div>
              )}

              {selectedProduct.highlights?.length > 0 && selectedProduct.highlights[0]?.label && (
                <div className="bg-slate-800/50 rounded-lg p-4 sm:p-5 border border-slate-700/50">
                  <label className="text-gray-400 text-xs uppercase tracking-wide mb-3 block font-semibold">Highlights</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {selectedProduct.highlights.map((h, i) => h.label && (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="text-white font-medium text-xs sm:text-sm">{h.label}:</span>
                          <span className="text-gray-400 text-xs sm:text-sm ml-1">{h.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.features?.length > 0 && selectedProduct.features[0] && (
                <div className="bg-slate-800/50 rounded-lg p-4 sm:p-5 border border-slate-700/50">
                  <label className="text-gray-400 text-xs uppercase tracking-wide mb-3 block font-semibold">Features</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProduct.features.map((f, i) => f && (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5 flex-shrink-0">✓</span>
                        <p className="text-gray-300 text-xs sm:text-sm">{f}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.cta?.url && (
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-3 sm:p-4 border border-cyan-500/30">
                  <label className="text-cyan-400 text-xs uppercase tracking-wide mb-2 block font-semibold">Call to Action</label>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm">{selectedProduct.cta.text || 'Learn More'}</p>
                      <p className="text-gray-400 text-xs truncate">{selectedProduct.cta.url}</p>
                    </div>
                    <a href={selectedProduct.cta.url} target="_blank" rel="noopener noreferrer"
                      className="px-3 sm:px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-xs sm:text-sm flex-shrink-0">
                      Visit
                    </a>
                  </div>
                </div>
              )}

              {(selectedProduct.theme?.gradientFrom || selectedProduct.theme?.gradientTo) && (
                <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-700/50">
                  <label className="text-gray-400 text-xs uppercase tracking-wide mb-3 block font-semibold">Theme Colors</label>
                  <div className="flex flex-wrap gap-4">
                    {selectedProduct.theme.gradientFrom && (
                      <div>
                        <p className="text-gray-400 text-xs mb-1.5">Gradient From</p>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-slate-600" style={{ backgroundColor: selectedProduct.theme.gradientFrom }} />
                          <span className="text-white text-xs sm:text-sm font-mono">{selectedProduct.theme.gradientFrom}</span>
                        </div>
                      </div>
                    )}
                    {selectedProduct.theme.gradientTo && (
                      <div>
                        <p className="text-gray-400 text-xs mb-1.5">Gradient To</p>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-slate-600" style={{ backgroundColor: selectedProduct.theme.gradientTo }} />
                          <span className="text-white text-xs sm:text-sm font-mono">{selectedProduct.theme.gradientTo}</span>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-slate-800 rounded-xl w-full max-w-sm sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {showCreateModal ? 'Create Project' : 'Edit Project'}
              </h2>
              <button onClick={closeFormModal} className="text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={showCreateModal ? handleCreate : handleUpdate} className="p-4 sm:p-6 space-y-4">
              {/* Slug */}
              <div>
                <label className="block text-gray-400 text-xs sm:text-sm mb-1">Slug</label>
                <input type="text" value={editForm.slug} onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} className={inp} required />
              </div>
              {/* Title */}
              <div>
                <label className="block text-gray-400 text-xs sm:text-sm mb-1">Title</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className={inp} required />
              </div>
              {/* Tagline */}
              <div>
                <label className="block text-gray-400 text-xs sm:text-sm mb-1">Tagline</label>
                <input type="text" value={editForm.tagline} onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })} className={inp} />
              </div>
              {/* Description */}
              <div>
                <label className="block text-gray-400 text-xs sm:text-sm mb-1">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className={`${inp} h-20 sm:h-24 resize-none`} />
              </div>

              {/* Cover Image */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className={sectionHead}>Cover Image</h3>
                {editForm.coverImage.url && (
                  <div className="mb-3 relative w-full h-36 sm:h-48 rounded-lg overflow-hidden border-2 border-blue-500/30">
                    <Image src={editForm.coverImage.url} alt={editForm.coverImage.alt || "Cover preview"} fill className="object-cover" />
                  </div>
                )}
                {/* URL + Alt — stack on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Image URL</label>
                    <input type="url" value={editForm.coverImage.url} onChange={(e) => setEditForm({ ...editForm, coverImage: { ...editForm.coverImage, url: e.target.value } })} className={inp} placeholder="https://example.com/image.jpg" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Alt Text</label>
                    <input type="text" value={editForm.coverImage.alt} onChange={(e) => setEditForm({ ...editForm, coverImage: { ...editForm.coverImage, alt: e.target.value } })} className={inp} placeholder="Image description" />
                  </div>
                </div>
                <label className="block cursor-pointer">
                  <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed transition-colors ${imageUploading ? 'border-blue-500/50 bg-blue-500/10 cursor-not-allowed' : 'border-slate-600 bg-slate-700 hover:bg-slate-600 hover:border-blue-500/50'}`}>
                    {imageUploading ? <><Loader2 className="w-4 h-4 animate-spin" /><span className="text-xs sm:text-sm text-gray-300">Uploading...</span></> : <><Upload className="w-4 h-4 text-blue-400" /><span className="text-xs sm:text-sm text-gray-300">Upload Image</span></>}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} className="hidden" />
                </label>
                <p className="text-xs text-gray-500 mt-1">Upload or paste URL (Max 5MB)</p>
              </div>

              {/* Badge */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className={sectionHead}>Badge</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Label</label>
                    <input type="text" value={editForm.badge.label} onChange={(e) => setEditForm({ ...editForm, badge: { ...editForm.badge, label: e.target.value } })} className={inp} placeholder="New" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Color</label>
                    <input type="text" value={editForm.badge.color} onChange={(e) => setEditForm({ ...editForm, badge: { ...editForm.badge, color: e.target.value } })} className={inp} placeholder="cyan-500" />
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className={sectionHead}>Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Live Link</label>
                    <input type="url" value={editForm.liveLink} onChange={(e) => setEditForm({ ...editForm, liveLink: e.target.value })} className={inp} placeholder="https://example.com" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Repository Link</label>
                    <input type="url" value={editForm.repoLink} onChange={(e) => setEditForm({ ...editForm, repoLink: e.target.value })} className={inp} placeholder="https://github.com/user/repo" />
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className={sectionHead}>Highlights</h3>
                {editForm.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" value={highlight.label} onChange={(e) => { const n = [...editForm.highlights]; n[index].label = e.target.value; setEditForm({ ...editForm, highlights: n }); }} className={`${inp} flex-1`} placeholder="Label" />
                    <input type="text" value={highlight.value} onChange={(e) => { const n = [...editForm.highlights]; n[index].value = e.target.value; setEditForm({ ...editForm, highlights: n }); }} className={`${inp} flex-1`} placeholder="Value" />
                    <button type="button" onClick={() => setEditForm({ ...editForm, highlights: editForm.highlights.filter((_, i) => i !== index) })} className="bg-red-600 hover:bg-red-700 text-white px-2 rounded text-sm flex-shrink-0">×</button>
                  </div>
                ))}
                <button type="button" onClick={() => setEditForm({ ...editForm, highlights: [...editForm.highlights, { label: '', value: '' }] })} className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-xs sm:text-sm">
                  Add Highlight
                </button>
              </div>

              {/* Features */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className={sectionHead}>Features</h3>
                {editForm.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" value={feature} onChange={(e) => { const n = [...editForm.features]; n[index] = e.target.value; setEditForm({ ...editForm, features: n }); }} className={`${inp} flex-1`} placeholder="Feature description" />
                    <button type="button" onClick={() => setEditForm({ ...editForm, features: editForm.features.filter((_, i) => i !== index) })} className="bg-red-600 hover:bg-red-700 text-white px-2 rounded text-sm flex-shrink-0">×</button>
                  </div>
                ))}
                <button type="button" onClick={() => setEditForm({ ...editForm, features: [...editForm.features, ''] })} className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-xs sm:text-sm">
                  Add Feature
                </button>
              </div>

              {/* CTA */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className={sectionHead}>Call to Action</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Button Text</label>
                    <input type="text" value={editForm.cta.text} onChange={(e) => setEditForm({ ...editForm, cta: { ...editForm.cta, text: e.target.value } })} className={inp} placeholder="Learn More" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Button URL</label>
                    <input type="url" value={editForm.cta.url} onChange={(e) => setEditForm({ ...editForm, cta: { ...editForm.cta, url: e.target.value } })} className={inp} placeholder="https://example.com" />
                  </div>
                </div>
              </div>

              {/* Theme */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className={sectionHead}>Theme</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Gradient From</label>
                    <input type="text" value={editForm.theme.gradientFrom} onChange={(e) => setEditForm({ ...editForm, theme: { ...editForm.theme, gradientFrom: e.target.value } })} className={inp} placeholder="cyan-500" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Gradient To</label>
                    <input type="text" value={editForm.theme.gradientTo} onChange={(e) => setEditForm({ ...editForm, theme: { ...editForm.theme, gradientTo: e.target.value } })} className={inp} placeholder="blue-600" />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className={sectionHead}>Status</h3>
                <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className={inp}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Submit */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700">
                <button type="submit" className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded transition-colors text-sm sm:text-base">
                  <Save size={16} />
                  {showCreateModal ? 'Create' : 'Update'}
                </button>
                <button type="button" onClick={closeFormModal} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors text-sm sm:text-base">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ DELETE MODAL ══════════ */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <AlertTriangle className="text-red-400 flex-shrink-0" size={22} />
              <h2 className="text-lg sm:text-xl font-bold text-white">Delete Project</h2>
            </div>
            <p className="text-gray-400 mb-5 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to delete &ldquo;{selectedProduct.title}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors text-sm sm:text-base">Delete</button>
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors text-sm sm:text-base">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ SUCCESS MODAL ══════════ */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-5 sm:p-6 w-full max-w-xs sm:max-w-md">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="text-green-400 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Success</h2>
            </div>
            <p className="text-gray-400 mb-5 sm:mb-6 text-sm sm:text-base">{successMessage}</p>
            <div className="flex justify-end">
              <button onClick={() => setShowSuccessModal(false)} className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded transition-colors text-sm sm:text-base">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}