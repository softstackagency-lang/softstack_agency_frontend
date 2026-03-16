"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, RefreshCw, Loader2, X, Tag, ImageIcon, FileText } from "lucide-react";
import { auth } from "@/lib/firebase";
import { uploadImageToImgBB } from "@/lib/imgbb-upload";

const BLOG_API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api"}/blogs`;

const defaultForm = {
  image: "",
  title: "",
  description: "",
  tags: [""],
};

const normalizeTags = (tagsInput) => {
  if (!tagsInput) return [];

  if (Array.isArray(tagsInput)) {
    return [...new Set(tagsInput.map((tag) => String(tag).trim()).filter(Boolean))];
  }

  return [
    ...new Set(
      String(tagsInput)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    ),
  ];
};

export default function BlogManagementComponent() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: "", title: "" });
  const [uploadingImage, setUploadingImage] = useState(false);

  const filteredBlogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return blogs;

    return blogs.filter((blog) => {
      const tagsText = Array.isArray(blog.tags) ? blog.tags.join(" ") : "";
      return (
        String(blog.id || "").toLowerCase().includes(query) ||
        String(blog.title || "").toLowerCase().includes(query) ||
        String(blog.description || "").toLowerCase().includes(query) ||
        tagsText.toLowerCase().includes(query)
      );
    });
  }, [blogs, searchTerm]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const getAuthToken = async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Please login as admin to manage blogs.");
    }
    return user.getIdToken();
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(BLOG_API_BASE, {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch blogs");
      }

      const blogList = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

      setBlogs(blogList);
    } catch (err) {
      setError(err.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData(defaultForm);
    setShowFormModal(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      image: String(blog.image || ""),
      title: String(blog.title || ""),
      description: String(blog.description || ""),
      tags: Array.isArray(blog.tags) && blog.tags.length > 0 ? blog.tags : [""],
    });
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    if (saving) return;
    setShowFormModal(false);
    setEditingBlog(null);
    setFormData(defaultForm);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTagField = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...(Array.isArray(prev.tags) ? prev.tags : []), ""],
    }));
  };

  const updateTagField = (index, value) => {
    setFormData((prev) => {
      const nextTags = [...(Array.isArray(prev.tags) ? prev.tags : [])];
      nextTags[index] = value;
      return { ...prev, tags: nextTags };
    });
  };

  const removeTagField = (index) => {
    setFormData((prev) => {
      const currentTags = Array.isArray(prev.tags) ? prev.tags : [];
      const nextTags = currentTags.filter((_, tagIndex) => tagIndex !== index);
      return {
        ...prev,
        tags: nextTags.length > 0 ? nextTags : [""],
      };
    });
  };

  const handleSaveBlog = async () => {
    try {
      if (!formData.image.trim()) throw new Error("Blog image URL is required.");
      if (!formData.title.trim()) throw new Error("Blog title is required.");
      if (!formData.description.trim()) throw new Error("Blog description is required.");

      setSaving(true);
      setError(null);

      const token = await getAuthToken();
      const payload = {
        image: String(formData.image).trim(),
        title: String(formData.title).trim(),
        description: String(formData.description).trim(),
        tags: normalizeTags(formData.tags),
      };

      const isEditing = Boolean(editingBlog);
      const targetId = editingBlog?.id;

      if (isEditing && !targetId) {
        throw new Error("Invalid blog id for update.");
      }

      const url = isEditing ? `${BLOG_API_BASE}/${targetId}` : `${BLOG_API_BASE}/upload`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Failed to ${isEditing ? "update" : "create"} blog`);
      }

      await fetchBlogs();
      closeFormModal();
    } catch (err) {
      setError(err.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadingImage(true);
      setError(null);

      const result = await uploadImageToImgBB(file);
      if (!result.success || !result.imageUrl) {
        throw new Error(result.error || "Failed to upload image to Cloudinary.");
      }

      setFormData((prev) => ({ ...prev, image: result.imageUrl }));
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleDeleteBlog = async () => {
    try {
      setSaving(true);
      setError(null);

      const token = await getAuthToken();
      const response = await fetch(`${BLOG_API_BASE}/${deleteModal.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete blog");
      }

      setDeleteModal({ isOpen: false, id: "", title: "" });
      await fetchBlogs();
    } catch (err) {
      setError(err.message || "Failed to delete blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen p-3 sm:p-6 text-slate-200 max-w-7xl mx-auto">
      <div className="mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Blog Management</h1>
        <p className="text-gray-400 text-xs sm:text-sm">Create, update, delete, and view all blogs from dashboard.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by id, title, description or tags"
          className="w-full sm:max-w-md px-3 py-2 bg-[#0a0f23]/70 border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
        />
        <div className="flex gap-2">
          <button
            onClick={fetchBlogs}
            disabled={loading || saving}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            disabled={saving}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            <Plus size={16} />
            Add Blog
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 size={38} className="animate-spin text-blue-500" />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/20 rounded-xl p-10 text-center">
          <FileText className="mx-auto text-gray-600 mb-3" size={44} />
          <h3 className="text-lg text-gray-300 font-semibold">No Blogs Found</h3>
          <p className="text-gray-500 text-sm mt-1">Create your first blog from the Add Blog button.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="bg-[#0a0f23]/60 border border-blue-500/20 rounded-xl overflow-hidden">
              <div className="aspect-video bg-[#050b1d]">
                {blog.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={blog.image} alt={blog.title || "Blog"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <ImageIcon size={28} />
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-cyan-300 font-mono break-all">ID: {blog.id}</p>
                <h3 className="text-white font-semibold line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-3">{blog.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(blog.tags || []).map((tag) => (
                    <span key={`${blog.id}-${tag}`} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full">
                      <Tag size={11} />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(blog)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-sm"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, id: blog.id, title: blog.title })}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0a0f23] border border-blue-500/30 rounded-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg sm:text-xl font-bold">{editingBlog ? "Update Blog" : "Add Blog"}</h2>
              <button onClick={closeFormModal} disabled={saving} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Image URL *</label>
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
                <div className="mt-2 flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm cursor-pointer">
                    {uploadingImage ? "Uploading..." : "Upload to Cloudinary"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                  {uploadingImage && <Loader2 size={16} className="animate-spin text-blue-400" />}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Blog title"
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Blog description"
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tags</label>
                <div className="space-y-2">
                  {(Array.isArray(formData.tags) ? formData.tags : [""]).map((tag, index) => (
                    <div key={`tag-${index}`} className="flex items-center gap-2">
                      <input
                        value={tag}
                        onChange={(event) => updateTagField(index, event.target.value)}
                        placeholder="Tag name"
                        className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                      {(Array.isArray(formData.tags) ? formData.tags.length : 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTagField(index)}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTagField}
                    className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleSaveBlog}
                  disabled={saving || uploadingImage}
                  className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingBlog ? "Update Blog" : "Upload Blog"}
                </button>
                <button
                  onClick={closeFormModal}
                  disabled={saving || uploadingImage}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0a0f23] border border-red-500/30 rounded-xl p-6">
            <h3 className="text-white text-lg font-bold mb-2">Delete Blog</h3>
            <p className="text-gray-400 text-sm mb-5">
              Are you sure you want to delete <span className="text-white font-medium">{deleteModal.title}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteBlog}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteModal({ isOpen: false, id: "", title: "" })}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
