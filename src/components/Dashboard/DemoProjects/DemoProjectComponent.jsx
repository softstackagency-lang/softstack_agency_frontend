"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus, X, Loader2, Edit, Trash2, Save,
  Image as ImageIcon, CheckCircle, Star,
} from "lucide-react";
import { uploadImageToImgBB } from "@/lib/imgbb-upload";
import api from "@/lib/api";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api"}/projects`;

export default function DemoProjectComponent() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, projectName: "", projectId: "" });
  const [showFormModal, setShowFormModal] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    title: "", description: "", tags: [""],
    thumbnail: "", previewUrl: "", isFeatured: false, order: 0,
  };
  const [formData, setFormData] = useState(emptyForm);

  /* ─── Shared card style (same as HomeManagement) ─── */
  const cardStyle =
    "bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 sm:p-6 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500";

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => { if (selectedCategoryId) fetchProjects(); }, [selectedCategoryId]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/projects');
      const result = response.data;
      if (result.success && result.data && Array.isArray(result.data.categories)) {
        const cats = result.data.categories;
        setCategories(cats);

        // Set first category as default if none selected
        if (!selectedCategoryId && cats.length > 0) {
          const firstCategoryId = cats[0].id;
          setSelectedCategoryId(firstCategoryId);
          setProjects(cats[0].projects || []);
          setLoading(false);
        } else if (selectedCategoryId) {
          // Update projects for current category
          const current = cats.find((c) => c.id === selectedCategoryId);
          if (current && Array.isArray(current.projects)) {
            setProjects(current.projects);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    } catch (_) { }
  };

  const fetchProjects = async () => {
    if (!selectedCategoryId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/projects');
      const result = response.data;
      if (result.success && result.data && Array.isArray(result.data.categories)) {
        const current = result.data.categories.find((c) => c.id === selectedCategoryId);
        if (current) {
          setProjects(current.projects || []);
        } else {
          setProjects([]);
        }
      } else {
        setProjects([]);
      }
      setError(null);
    } catch (err) {
      setError(err.userMessage || err.message || "Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setIsEditing(false);
    setEditId(null);
    setShowFormModal(true);
  };

  const openEditModal = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      tags: Array.isArray(project.tags) && project.tags.length > 0 ? project.tags : [""],
      thumbnail: project.thumbnail || "",
      previewUrl: project.previewUrl || "",
      isFeatured: project.isFeatured || false,
      order: project.order || 0,
    });
    setIsEditing(true);
    setEditId(project.id || project._id);
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setFormData(emptyForm);
    setIsEditing(false);
    setEditId(null);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and Description are required");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!selectedCategoryId) {
      setError("No category selected. Please select or create a category first.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Verify category exists
    const categoryExists = categories.find(c => c.id === selectedCategoryId);
    if (!categoryExists) {
      setError(`Category "${selectedCategoryId}" not found. Please refresh and try again.`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setLoading(true);
      const tagsArray = formData.tags.map((t) => t.trim()).filter((t) => t !== "");
      const submitData = { ...formData, tags: tagsArray };

      if (isEditing) {
        await api.put(
          `/projects/categories/${selectedCategoryId}/projects/${editId}`,
          submitData
        );
        setSuccessMessage("Project updated successfully!");
      } else {
        await api.post(
          `/projects/categories/${selectedCategoryId}/projects`,
          submitData
        );
        setSuccessMessage("Project added successfully!");
      }

      await fetchProjects();
      setTimeout(() => setSuccessMessage(""), 3000);
      closeFormModal();
      setError(null);
    } catch (err) {
      // Handle specific error codes
      let errorMsg = 'Failed to save project';
      if (err.response?.status === 409) {
        errorMsg = err.response?.data?.message || 'A project with this title already exists in this category';
      } else if (err.response?.status === 401) {
        errorMsg = 'Unauthorized. Please log in again.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.userMessage) {
        errorMsg = err.userMessage;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    setDeleteModal({ show: false, projectName: "", projectId: "" });
    try {
      setLoading(true);
      await api.delete(
        `/projects/categories/${selectedCategoryId}/projects/${projectId}`
      );
      await fetchProjects();
      setSuccessMessage("Project deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setError(null);
    } catch (err) {
      setError(err.userMessage || err.message || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => setFormData({ ...formData, tags: [...formData.tags, ""] });
  const updateTag = (index, value) => {
    const n = [...formData.tags]; n[index] = value;
    setFormData({ ...formData, tags: n });
  };
  const removeTag = (index) =>
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });

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
        setFormData({ ...formData, thumbnail: result.imageUrl });
      } else {
        setError(result.error || "Failed to upload image");
        setTimeout(() => setError(null), 3000);
      }
    } catch (_) {
      setError("Error uploading image");
      setTimeout(() => setError(null), 3000);
    } finally {
      setImageUploading(false);
    }
  };

  if (loading && projects.length === 0 && categories.length === 0) {
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
            Demo Projects
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400">
            Manage demo projects by category
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        {/* ── Toolbar: Category filter + Add button ── */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5 sm:mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
              Manage Projects
            </h2>
            {/* Category Tab Pills */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap border ${selectedCategoryId === cat.id
                      ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/10 text-white border-blue-500/50"
                      : "bg-[#0a0f23]/40 text-gray-400 hover:text-white hover:bg-[#0a0f23]/60 border-blue-500/10"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={openAddModal}
            disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            Add Project
          </button>
        </div>

        {/* ── Projects Grid ── */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {projects.length === 0 && (
              <div className={`${cardStyle} md:col-span-2 text-center py-10 sm:py-12`}>
                <Plus className="mx-auto mb-3 sm:mb-4 text-gray-600 w-10 h-10 sm:w-12 sm:h-12" />
                <p className="text-gray-400 text-sm sm:text-base">
                  No projects found. Add your first project!
                </p>
              </div>
            )}

            {projects.map((project) => (
              <div key={project._id || project.id} className={`${cardStyle} relative`}>
                {/* Featured badge */}
                {project.isFeatured && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-xs font-semibold border border-yellow-500/30">
                    <Star size={10} className="fill-yellow-400" />
                    Featured
                  </div>
                )}

                {/* Thumbnail */}
                {project.thumbnail && (
                  <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden mb-4 border border-blue-500/20">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f23]/80 to-transparent" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {project.order !== undefined && (
                      <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded">
                        Order: {project.order}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-1 pr-14 truncate">
                    {project.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.slice(0, 4).map((tag, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded border border-blue-500/20">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded">
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Preview link */}
                  {project.previewUrl && (
                    <a
                      href={project.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/20 hover:bg-green-500/30 transition-colors mb-3"
                    >
                      Live Preview ↗
                    </a>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 sm:mt-4">
                  <button
                    onClick={() => openEditModal(project)}
                    disabled={loading}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50"
                  >
                    <Edit size={14} className="sm:w-4 sm:h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ show: true, projectName: project.title, projectId: project.id || project._id })}
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

        {/* ══════════ ADD / EDIT FORM MODAL ══════════ */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 pt-16 md:pt-4">
            <div className="bg-[#0a0f23]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.2)] w-full max-w-sm sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-hidden">

              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-blue-500/20 sticky top-0 bg-[#0a0f23]/95 backdrop-blur-xl z-10">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                  {isEditing ? "Edit Project" : "Add New Project"}
                </h3>
                <button
                  onClick={closeFormModal}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">

                  {/* ── Category ── */}
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Category *</label>
                    {categories.length === 0 ? (
                      <div className="dashboard-input text-gray-500">Loading categories...</div>
                    ) : (
                      <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="dashboard-select"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* ── Title + Order ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Project Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="dashboard-input"
                        placeholder="Enter project title"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                        className="dashboard-input"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* ── Description ── */}
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="dashboard-textarea min-h-[80px] sm:min-h-[100px]"
                      placeholder="Enter project description"
                    />
                  </div>

                  {/* ── Thumbnail ── */}
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Thumbnail Image</label>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg cursor-pointer transition-colors border border-blue-500/30 text-sm">
                          <ImageIcon size={16} className="sm:w-5 sm:h-5" />
                          {imageUploading ? "Uploading..." : "Upload Image"}
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={imageUploading} />
                        </label>
                        {imageUploading && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-500" />}
                      </div>
                      <input
                        type="text"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        className="dashboard-input"
                        placeholder="Or enter image URL"
                      />
                      {formData.thumbnail && (
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <Image
                            src={formData.thumbnail}
                            alt="Preview"
                            width={64}
                            height={48}
                            className="w-14 h-10 sm:w-16 sm:h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <span className="text-xs sm:text-sm text-green-400">Image ready</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Tags ── */}
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Tags</label>
                    <div className="space-y-2">
                      {formData.tags.map((tag, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={tag}
                            onChange={(e) => updateTag(index, e.target.value)}
                            className="dashboard-input flex-1"
                            placeholder="Enter tag"
                          />
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 flex-shrink-0 transition-colors"
                          >
                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTag}
                        className="text-xs px-2 sm:px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 border border-blue-500/20 transition-colors"
                      >
                        + Add Tag
                      </button>
                    </div>
                  </div>

                  {/* ── Preview URL ── */}
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Preview URL</label>
                    <input
                      type="url"
                      value={formData.previewUrl}
                      onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
                      className="dashboard-input"
                      placeholder="https://demo.example.com"
                    />
                  </div>

                  {/* ── Featured checkbox ── */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="isFeatured" className="text-xs sm:text-sm text-gray-400">
                      Mark as Featured
                    </label>
                  </div>

                  {/* ── Action Buttons ── */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      ) : (
                        <Save size={16} className="sm:w-5 sm:h-5" />
                      )}
                      Save
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
                <span className="text-white font-semibold">&quot;{deleteModal.projectName}&quot;</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => handleDelete(deleteModal.projectId)}
                  disabled={loading}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />}
                  Delete
                </button>
                <button
                  onClick={() => setDeleteModal({ show: false, projectName: "", projectId: "" })}
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