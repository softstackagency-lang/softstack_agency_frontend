"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { uploadImageToImgBB } from "@/lib/imgbb-upload";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/projects`;

export default function DemoProjectComponent() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("mobile-apps");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, projectName: "", projectId: "" });
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [""],
    thumbnail: "",
    previewUrl: "",
    isFeatured: false,
    order: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch projects when selected category changes
  useEffect(() => {
    if (selectedCategoryId) {
      fetchProjects();
    }
  }, [selectedCategoryId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const result = await response.json();
      
      if (result.success && result.data && Array.isArray(result.data.categories)) {
        setCategories(result.data.categories);
        
        // Set first category as default if no category is selected
        if (!selectedCategoryId && result.data.categories.length > 0) {
          setSelectedCategoryId(result.data.categories[0].id);
        }
        
        // Load projects for the selected category from the fetched data
        const currentCategory = result.data.categories.find(cat => cat.id === selectedCategoryId);
        if (currentCategory && Array.isArray(currentCategory.projects)) {
          setProjects(currentCategory.projects);
          setLoading(false);
        }
      }
    } catch (err) {
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Fetch all categories with projects
      const response = await fetch(`${API_BASE_URL}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const result = await response.json();
      
      if (result.success && result.data && Array.isArray(result.data.categories)) {
        // Find the selected category and get its projects
        const currentCategory = result.data.categories.find(cat => cat.id === selectedCategoryId);
        if (currentCategory && Array.isArray(currentCategory.projects)) {
          setProjects(currentCategory.projects);
        } else {
          setProjects([]);
        }
      } else {
        setProjects([]);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert tags array to filtered array
      const tagsArray = formData.tags
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      const submitData = {
        ...formData,
        tags: tagsArray,
      };

      if (isEditing) {
        // Update existing project
        const response = await fetch(`${API_BASE_URL}/categories/${selectedCategoryId}/projects/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(submitData),
        });
        
        if (!response.ok) throw new Error('Failed to update project');
        const result = await response.json();
        await fetchProjects();
        setSuccessMessage("Project updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setIsEditing(false);
        setEditId(null);
      } else {
        // Create new project
        const response = await fetch(`${API_BASE_URL}/categories/${selectedCategoryId}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(submitData),
        });
        
        if (!response.ok) throw new Error('Failed to create project');
        const result = await response.json();
        await fetchProjects();
        setSuccessMessage("Project added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }

      setFormData({ 
        title: "", 
        description: "", 
        tags: [""], 
        thumbnail: "", 
        previewUrl: "",
        isFeatured: false,
        order: 0
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (project) => {
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
  };

  const handleDelete = async (projectId) => {
    setDeleteModal({ show: false, projectName: "", projectId: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/categories/${selectedCategoryId}/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to delete project');
      const result = await response.json();
      await fetchProjects();
      setSuccessMessage("Project deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const openDeleteModal = (projectName, projectId) => {
    setDeleteModal({ show: true, projectName, projectId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, projectName: "", projectId: "" });
  };

  const handleCancel = () => {
    setFormData({ 
      title: "", 
      description: "", 
      tags: [""], 
      thumbnail: "", 
      previewUrl: "",
      isFeatured: false,
      order: 0
    });
    setIsEditing(false);
    setEditId(null);
  };

  // Helper functions for tags management
  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ""] });
  };

  const updateTag = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
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
        setFormData({ ...formData, thumbnail: result.imageUrl });
        setSuccessMessage('Image uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Demo Projects</h1>

      {/* Success Modal */}
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 border border-green-500/50 rounded-xl p-6 shadow-2xl max-w-sm mx-4 animate-[scale-in_0.3s_ease-out]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Success!</h3>
                <p className="text-green-300 text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br black border border-red-500/50 rounded-xl p-6 shadow-2xl max-w-md mx-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Delete Project</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Are you sure you want to delete <span className="font-semibold text-white">&quot;{deleteModal.projectName}&quot;</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteModal.projectId)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-white text-center py-8">Loading projects...</div>
      ) : (
        <>
          {/* Add/Edit Project Form */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isEditing ? "Edit Project" : "Add New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-gray-300 mb-2">Category *</label>
                {categories.length === 0 ? (
                  <div className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded-lg text-gray-400">
                    Loading categories...
                  </div>
                ) : (
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Project Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Thumbnail</label>
                  
                  {/* Image Preview */}
                  {formData.thumbnail && (
                    <div className="mb-3 relative w-full h-48 rounded-lg overflow-hidden border-2 border-blue-500/30">
                      <Image 
                        src={formData.thumbnail} 
                        alt="Thumbnail preview" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* URL Input */}
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500 mb-2"
                    placeholder="https://example.com/image.jpg"
                  />

                  {/* File Upload */}
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed transition-colors ${
                        imageUploading 
                          ? 'border-blue-500/50 bg-blue-500/10 cursor-not-allowed' 
                          : 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50'
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
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter project description"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Tags</label>
                <div className="space-y-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="Enter tag"
                      />
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTag}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Add Tag
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Preview URL</label>
                  <input
                    type="url"
                    name="previewUrl"
                    value={formData.previewUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://demo.example.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 bg-slate-900/50 border border-blue-500/30 rounded text-blue-600 focus:ring-blue-500"
                />
                <label className="text-gray-300">Featured Project</label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {isEditing ? "Update Project" : "Add Project"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Projects List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-8">
                No projects found. Add your first project above.
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project._id || project.id}
                  className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-5 hover:border-blue-500/40 transition-all relative"
                >
                  {project.isFeatured && (
                    <div className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs font-semibold">
                      ⭐ Featured
                    </div>
                  )}
                  {project.thumbnail && (
                    <img 
                      src={project.thumbnail} 
                      alt={project.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-3 text-sm line-clamp-3">{project.description}</p>
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mb-3">
                    {project.previewUrl && (
                      <a
                        href={project.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-green-600/80 hover:bg-green-600 text-white rounded text-xs transition-colors"
                      >
                        Preview
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-4 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(project.name, project.id || project._id)}
                      className="px-4 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}