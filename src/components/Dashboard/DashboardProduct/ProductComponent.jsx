"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Package, Search, Filter, MoreVertical, Eye, Edit, Trash2, X, Save, AlertTriangle, Plus, Upload, Loader2 } from 'lucide-react';
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
  const [editForm, setEditForm] = useState({
    slug: '',
    title: '',
    tagline: '',
    description: '',
    coverImage: { url: '', alt: '' },
    badge: { label: '', color: '' },
    liveLink: '',
    repoLink: '',
    highlights: [{ label: '', value: '' }],
    features: [''],
    cta: { text: '', url: '' },
    theme: { gradientFrom: '', gradientTo: '' },
    status: 'active',
    order: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditForm({
      slug: '',
      title: '',
      tagline: '',
      description: '',
      coverImage: { url: '', alt: '' },
      badge: { label: '', color: '' },
      liveLink: '',
      repoLink: '',
      highlights: [{ label: '', value: '' }],
      features: [''],
      cta: { text: '', url: '' },
      theme: { gradientFrom: '', gradientTo: '' },
      status: 'active',
      order: 0
    });
    setShowCreateModal(true);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const data = await productApi.getAllProducts();
      
      if (data.success) {
        const productsArray = Array.isArray(data.data) ? data.data : [];
        
        // Log each product's ID for debugging
        productsArray.forEach((product, index) => {
          console.log(`Product ${index}:`, {
            id: product._id,
            idType: typeof product._id,
            idLength: product._id?.length || 'N/A',
            title: product.title,
            slug: product.slug
          });
        });
        
        setProducts(productsArray);
      } else {
        setError(data.message || 'Failed to fetch products');
        setProducts([]);
      }
    } catch (error) {
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setImageUploading(true);
      const result = await uploadImageToImgBB(file);

      if (result.success) {
        setEditForm({ 
          ...editForm, 
          coverImage: { ...editForm.coverImage, url: result.imageUrl }
        });
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
    
    if (!user || !user.uid) {
      setError('User not authenticated');
      return;
    }
    
    try {
      
      const data = await productApi.createProduct(user.uid, editForm);
      
      if (data.success) {
        setProducts([...products, data.data]);
        setShowCreateModal(false);
        setSuccessMessage('Product created successfully!');
        setShowSuccessModal(true);
        fetchProducts(); // Refresh the list
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating product:', {
        id: selectedProduct._id,
        idType: typeof selectedProduct._id,
        idLength: selectedProduct._id?.length || 'N/A',
        title: selectedProduct.title
      });
      
      const data = await productApi.updateProduct(selectedProduct._id, editForm);
      
      if (data.success) {
        setProducts(products.map(p => p._id === selectedProduct._id ? { ...p, ...editForm } : p));
        setShowEditModal(false);
        setSuccessMessage('Product updated successfully!');
        setShowSuccessModal(true);
        fetchProducts(); // Refresh the list
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      
      await productApi.deleteProduct(selectedProduct._id);
      
      setProducts(products.filter(p => p._id !== selectedProduct._id));
      setShowDeleteModal(false);
      setSelectedProduct(null);
      setSuccessMessage('Product deleted successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setEditForm({
      slug: '',
      title: '',
      tagline: '',
      description: '',
      coverImage: { url: '', alt: '' },
      badge: { label: '', color: '' },
      liveLink: '',
      repoLink: '',
      highlights: [{ label: '', value: '' }],
      features: [''],
      cta: { text: '', url: '' },
      theme: { gradientFrom: '', gradientTo: '' },
      status: 'active',
      order: 0
    });
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditForm({
      slug: product.slug || '',
      title: product.title || '',
      tagline: product.tagline || '',
      description: product.description || '',
      coverImage: product.coverImage || { url: '', alt: '' },
      badge: product.badge || { label: '', color: '' },
      liveLink: product.liveLink || '',
      repoLink: product.repoLink || '',
      highlights: product.highlights || [{ label: '', value: '' }],
      features: product.features || [''],
      cta: product.cta || { text: '', url: '' },
      theme: product.theme || { gradientFrom: '', gradientTo: '' },
      status: product.status || 'active',
      order: product.order || 0
    });
    setShowEditModal(true);
  };

  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button
          onClick={openCreateModal}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-700">
                <th className="pb-3 text-gray-400 font-medium">Title</th>
                <th className="pb-3 text-gray-400 font-medium">Status</th>
                <th className="pb-3 text-gray-400 font-medium">Created</th>
                <th className="pb-3 text-gray-400 font-medium">Posted By</th>
                <th className="pb-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-slate-700/50">
                  <td className="py-4">
                    <div>
                      <p className="text-white font-medium">{product.title}</p>
                      <p className="text-gray-400 text-sm">{product.tagline}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-400 text-sm">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric'
                    }) : 'N/A'}
                  </td>
                  <td className="py-4 text-gray-400 text-sm">
                    {product.postedBy?.displayName || product.postedBy?.email || 'Unknown'}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowViewModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-cyan-400"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1 text-gray-400 hover:text-blue-400"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal - Redesigned */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-cyan-500/20">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-b border-cyan-500/20 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedProduct.title}</h2>
                  <p className="text-gray-400 text-sm">{selectedProduct.tagline}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedProduct.status === 'active'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {selectedProduct.status}
                    </span>
                    {selectedProduct.badge?.label && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {selectedProduct.badge.label}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
              {/* Cover Image */}
              {selectedProduct.coverImage?.url && (
                <div className="relative rounded-xl overflow-hidden border border-cyan-500/20 group">
                  <Image
                    src={selectedProduct.coverImage.url}
                    alt={selectedProduct.coverImage.alt || selectedProduct.title}
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Slug */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <label className="text-gray-400 text-xs uppercase tracking-wide mb-1 block">Slug</label>
                  <p className="text-white font-mono text-sm">{selectedProduct.slug}</p>
                </div>

                {/* Created Date */}
                {selectedProduct.createdAt && (
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <label className="text-gray-400 text-xs uppercase tracking-wide mb-1 block">Created</label>
                    <p className="text-white text-sm">
                      {new Date(selectedProduct.createdAt).toLocaleDateString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {/* Posted By */}
                {(selectedProduct.postedBy?.displayName || selectedProduct.postedBy?.email) && (
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 md:col-span-2">
                    <label className="text-gray-400 text-xs uppercase tracking-wide mb-1 block">Posted By</label>
                    <p className="text-white text-sm">{selectedProduct.postedBy?.displayName || selectedProduct.postedBy?.email}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-lg p-5 border border-cyan-500/20">
                  <label className="text-cyan-400 text-xs uppercase tracking-wide mb-2 block font-semibold">Description</label>
                  <p className="text-gray-300 leading-relaxed">{selectedProduct.description}</p>
                </div>
              )}

              {/* Links */}
              {(selectedProduct.liveLink || selectedProduct.repoLink) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProduct.liveLink && (
                    <a
                      href={selectedProduct.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/30 rounded-lg p-4 transition-all group"
                    >
                      <Eye className="text-green-400 group-hover:scale-110 transition-transform" size={20} />
                      <div className="flex-1">
                        <label className="text-green-400 text-xs uppercase tracking-wide block">Live Demo</label>
                        <p className="text-white text-sm truncate">{selectedProduct.liveLink}</p>
                      </div>
                    </a>
                  )}
                  {selectedProduct.repoLink && (
                    <a
                      href={selectedProduct.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/30 rounded-lg p-4 transition-all group"
                    >
                      <Package className="text-purple-400 group-hover:scale-110 transition-transform" size={20} />
                      <div className="flex-1">
                        <label className="text-purple-400 text-xs uppercase tracking-wide block">Repository</label>
                        <p className="text-white text-sm truncate">{selectedProduct.repoLink}</p>
                      </div>
                    </a>
                  )}
                </div>
              )}

              {/* Highlights */}
              {selectedProduct.highlights && selectedProduct.highlights.length > 0 && selectedProduct.highlights[0]?.label && (
                <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                  <label className="text-gray-400 text-xs uppercase tracking-wide mb-3 block font-semibold">Highlights</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProduct.highlights.map((highlight, index) => (
                      highlight.label && (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></div>
                          <div>
                            <span className="text-white font-medium text-sm">{highlight.label}:</span>
                            <span className="text-gray-400 text-sm ml-1">{highlight.value}</span>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {selectedProduct.features && selectedProduct.features.length > 0 && selectedProduct.features[0] && (
                <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                  <label className="text-gray-400 text-xs uppercase tracking-wide mb-3 block font-semibold">Features</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedProduct.features.map((feature, index) => (
                      feature && (
                        <div key={index} className="flex items-start gap-2">
                          <div className="text-cyan-400 mt-0.5">✓</div>
                          <p className="text-gray-300 text-sm">{feature}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              {selectedProduct.cta?.url && (
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/30">
                  <label className="text-cyan-400 text-xs uppercase tracking-wide mb-2 block font-semibold">Call to Action</label>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{selectedProduct.cta.text || 'Learn More'}</p>
                      <p className="text-gray-400 text-sm">{selectedProduct.cta.url}</p>
                    </div>
                    <a
                      href={selectedProduct.cta.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm"
                    >
                      Visit
                    </a>
                  </div>
                </div>
              )}

              {/* Theme */}
              {(selectedProduct.theme?.gradientFrom || selectedProduct.theme?.gradientTo) && (
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <label className="text-gray-400 text-xs uppercase tracking-wide mb-3 block font-semibold">Theme Colors</label>
                  <div className="flex gap-4">
                    {selectedProduct.theme.gradientFrom && (
                      <div className="flex-1">
                        <p className="text-gray-400 text-xs mb-2">Gradient From</p>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded border border-slate-600" 
                            style={{ backgroundColor: selectedProduct.theme.gradientFrom }}
                          ></div>
                          <span className="text-white text-sm font-mono">{selectedProduct.theme.gradientFrom}</span>
                        </div>
                      </div>
                    )}
                    {selectedProduct.theme.gradientTo && (
                      <div className="flex-1">
                        <p className="text-gray-400 text-xs mb-2">Gradient To</p>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded border border-slate-600" 
                            style={{ backgroundColor: selectedProduct.theme.gradientTo }}
                          ></div>
                          <span className="text-white text-sm font-mono">{selectedProduct.theme.gradientTo}</span>
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

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {showCreateModal ? 'Create Product' : 'Edit Product'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={showCreateModal ? handleCreate : handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Slug</label>
                <input
                  type="text"
                  value={editForm.slug}
                  onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Tagline</label>
                <input
                  type="text"
                  value={editForm.tagline}
                  onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded h-24"
                />
              </div>

              {/* Cover Image */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-white font-medium mb-2">Cover Image</h3>
                
                {/* Image Preview */}
                {editForm.coverImage.url && (
                  <div className="mb-3 relative w-full h-48 rounded-lg overflow-hidden border-2 border-blue-500/30">
                    <Image 
                      src={editForm.coverImage.url} 
                      alt={editForm.coverImage.alt || "Cover image preview"} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Image URL</label>
                    <input
                      type="url"
                      value={editForm.coverImage.url}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        coverImage: { ...editForm.coverImage, url: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Alt Text</label>
                    <input
                      type="text"
                      value={editForm.coverImage.alt}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        coverImage: { ...editForm.coverImage, alt: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                      placeholder="Image description"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer">
                    <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed transition-colors ${
                      imageUploading 
                        ? 'border-blue-500/50 bg-blue-500/10 cursor-not-allowed' 
                        : 'border-slate-600 bg-slate-700 hover:bg-slate-600 hover:border-blue-500/50'
                    }`}>
                      {imageUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-gray-300">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-300">Upload Image</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload image or paste URL (Max 5MB)</p>
              </div>

              {/* Badge */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-white font-medium mb-2">Badge</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Label</label>
                    <input
                      type="text"
                      value={editForm.badge.label}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        badge: { ...editForm.badge, label: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                      placeholder="New"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Color</label>
                    <input
                      type="text"
                      value={editForm.badge.color}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        badge: { ...editForm.badge, color: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                      placeholder="cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-white font-medium mb-2">Links</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Live Link</label>
                    <input
                      type="url"
                      value={editForm.liveLink}
                      onChange={(e) => setEditForm({ ...editForm, liveLink: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Repository Link</label>
                    <input
                      type="url"
                      value={editForm.repoLink}
                      onChange={(e) => setEditForm({ ...editForm, repoLink: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                      placeholder="https://github.com/user/repo"
                    />
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-white font-medium mb-2">Highlights</h3>
                {editForm.highlights.map((highlight, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={highlight.label}
                      onChange={(e) => {
                        const newHighlights = [...editForm.highlights];
                        newHighlights[index].label = e.target.value;
                        setEditForm({ ...editForm, highlights: newHighlights });
                      }}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                      placeholder="Label"
                    />
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={highlight.value}
                        onChange={(e) => {
                          const newHighlights = [...editForm.highlights];
                          newHighlights[index].value = e.target.value;
                          setEditForm({ ...editForm, highlights: newHighlights });
                        }}
                        className="flex-1 bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                        placeholder="Value"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newHighlights = editForm.highlights.filter((_, i) => i !== index);
                          setEditForm({ ...editForm, highlights: newHighlights });
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 rounded text-sm"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setEditForm({
                    ...editForm,
                    highlights: [...editForm.highlights, { label: '', value: '' }]
                  })}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded text-sm"
                >
                  Add Highlight
                </button>
              </div>

              {/* Features */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-white font-medium mb-2">Features</h3>
                {editForm.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...editForm.features];
                        newFeatures[index] = e.target.value;
                        setEditForm({ ...editForm, features: newFeatures });
                      }}
                      className="flex-1 bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                      placeholder="Feature description"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFeatures = editForm.features.filter((_, i) => i !== index);
                        setEditForm({ ...editForm, features: newFeatures });
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 rounded text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setEditForm({
                    ...editForm,
                    features: [...editForm.features, '']
                  })}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded text-sm"
                >
                  Add Feature
                </button>
              </div>

              {/* CTA */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-white font-medium mb-2">Call to Action</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Button Text</label>
                    <input
                      type="text"
                      value={editForm.cta.text}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        cta: { ...editForm.cta, text: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                      placeholder="Learn More"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Button URL</label>
                    <input
                      type="url"
                      value={editForm.cta.url}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        cta: { ...editForm.cta, url: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Theme */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-white font-medium mb-2">Theme</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Gradient From</label>
                    <input
                      type="text"
                      value={editForm.theme.gradientFrom}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        theme: { ...editForm.theme, gradientFrom: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                      placeholder="cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Gradient To</label>
                    <input
                      type="text"
                      value={editForm.theme.gradientTo}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        theme: { ...editForm.theme, gradientTo: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm"
                      placeholder="blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="border-t border-slate-600 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Save size={16} />
                  {showCreateModal ? 'Create' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-400" size={24} />
              <h2 className="text-xl font-bold text-white">Delete Product</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete &ldquo;{selectedProduct.title}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex-1"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-green-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Success</h2>
            </div>
            <p className="text-gray-400 mb-6">{successMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}