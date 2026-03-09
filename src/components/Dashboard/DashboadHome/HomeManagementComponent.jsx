"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Star,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { bannerApi, faqApi, testimonialApi } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/imgbb-upload";

export default function HomeManagementComponent() {
  const [activeTab, setActiveTab] = useState("testimonials");
  const [isVisible, setIsVisible] = useState(true);

  const cardStyle =
    "bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 sm:p-6 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500";

  return (
    <div className="relative min-h-screen p-3 sm:p-4 md:p-6 overflow-auto text-slate-200">
      <div
        className={`relative z-10 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {/* Header */}
        <div className="mb-5 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
            Home Page Management
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400">
            Manage testimonials, hero banner images, and frequently asked questions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 sm:gap-4 mb-5 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <TabButton
            active={activeTab === "testimonials"}
            onClick={() => setActiveTab("testimonials")}
            icon={<MessageSquare size={16} className="sm:w-5 sm:h-5" />}
            label="Testimonials"
          />
          <TabButton
            active={activeTab === "banner"}
            onClick={() => setActiveTab("banner")}
            icon={<ImageIcon size={16} className="sm:w-5 sm:h-5" />}
            label="Hero Banner"
          />
          <TabButton
            active={activeTab === "faqs"}
            onClick={() => setActiveTab("faqs")}
            icon={<HelpCircle size={16} className="sm:w-5 sm:h-5" />}
            label="FAQs"
          />
        </div>

        {/* Content Sections */}
        {activeTab === "testimonials" && <TestimonialsSection cardStyle={cardStyle} />}
        {activeTab === "banner" && <BannerSection cardStyle={cardStyle} />}
        {activeTab === "faqs" && <FAQsSection cardStyle={cardStyle} />}
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 md:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-xs sm:text-sm md:text-base ${active
          ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/10 text-white border border-blue-500/50"
          : "bg-[#0a0f23]/40 text-gray-400 hover:text-white hover:bg-[#0a0f23]/60 border border-blue-500/10"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ===================== TESTIMONIALS SECTION =====================
function TestimonialsSection({ cardStyle }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    company: "",
    rating: 5,
    message: "",
    avatar: "",
    isFeatured: false,
  });

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await testimonialApi.getAllTestimonials();
      setTestimonials(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({ name: "", designation: "", company: "", rating: 5, message: "", avatar: "", isFeatured: false });
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial._id);
    setFormData({
      name: testimonial.name || "",
      designation: testimonial.designation || "",
      company: testimonial.company || "",
      rating: testimonial.rating || 5,
      message: testimonial.message || "",
      avatar: testimonial.avatar || "",
      isFeatured: testimonial.isFeatured || false,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingId) {
        await testimonialApi.updateTestimonial(editingId, formData);
      } else {
        await testimonialApi.createTestimonial(formData);
      }
      await fetchTestimonials();
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: "", designation: "", company: "", rating: 5, message: "", avatar: "", isFeatured: false });
    } catch (err) {
      setError(err.message || "Failed to save testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await testimonialApi.deleteTestimonial(deleteModal.id);
      await fetchTestimonials();
      setDeleteModal({ isOpen: false, id: null });
    } catch (err) {
      setError(err.message || "Failed to delete testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", designation: "", company: "", rating: 5, message: "", avatar: "", isFeatured: false });
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
      setUploadingImage(true);
      const result = await uploadImageToImgBB(file);
      if (result.success) {
        setFormData({ ...formData, avatar: result.imageUrl });
      } else {
        setError(result.error || "Failed to upload image");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError("Error uploading image");
      setTimeout(() => setError(null), 3000);
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading && testimonials.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Header row */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Manage Testimonials</h2>
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            Add Testimonial
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className={cardStyle}>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">
            {editingId ? "Edit Testimonial" : "Add New Testimonial"}
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {/* Name + Designation — stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="dashboard-input"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="dashboard-input"
                  placeholder="Enter designation"
                />
              </div>
            </div>

            {/* Company + Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="dashboard-input"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Rating *</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="dashboard-select"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num} Star{num > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Avatar Image</label>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg cursor-pointer transition-colors border border-blue-500/30 text-sm">
                    <ImageIcon size={16} className="sm:w-5 sm:h-5" />
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                  </label>
                  {uploadingImage && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-500" />}
                </div>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="dashboard-input"
                  placeholder="Or enter avatar image URL"
                />
                {formData.avatar && (
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <Image src={formData.avatar} alt="Preview" width={48} height={48} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
                    <span className="text-xs sm:text-sm text-green-400">Image uploaded successfully</span>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="dashboard-textarea min-h-[80px] sm:min-h-[100px]"
                placeholder="Enter testimonial message"
                required
              />
            </div>

            {/* Featured checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isFeatured" className="text-xs sm:text-sm text-gray-400">Mark as Featured</label>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Save size={16} className="sm:w-5 sm:h-5" />}
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
      )}

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className={`${cardStyle} relative`}>
            {testimonial.isFeatured && (
              <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-xs font-semibold">
                Featured
              </div>
            )}
            <div className="flex items-start gap-3 sm:gap-4">
              {testimonial.avatar && (
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={56}
                  height={56}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base md:text-lg font-semibold truncate">{testimonial.name}</h4>
                {testimonial.designation && (
                  <p className="text-xs sm:text-sm text-gray-400 truncate">{testimonial.designation}</p>
                )}
                {testimonial.company && (
                  <p className="text-xs text-gray-500 truncate">{testimonial.company}</p>
                )}
                <div className="flex gap-0.5 sm:gap-1 my-1 sm:my-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} className="sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2 line-clamp-3">{testimonial.message}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-4">
              <button
                onClick={() => handleEdit(testimonial)}
                disabled={loading}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50"
              >
                <Edit size={14} className="sm:w-4 sm:h-4" />
                Edit
              </button>
              <button
                onClick={() => setDeleteModal({ isOpen: true, id: testimonial._id })}
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

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardStyle} max-w-sm sm:max-w-md w-full`}>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Confirm Delete</h3>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to delete this testimonial? This action cannot be undone.
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
                onClick={() => setDeleteModal({ isOpen: false, id: null })}
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
    </div>
  );
}

// ===================== BANNER SECTION =====================
function BannerSection({ cardStyle }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, bannerId: null, bannerTitle: "" });

  const [formData, setFormData] = useState({
    badge: "",
    title: { highlight: "", text: "" },
    description: "",
    ctaButtons: [
      { text: "Get Started", link: "/contact", type: "primary" },
      { text: "View Our Work", link: "/projects", type: "secondary" },
    ],
    images: [{ id: 1, title: "", imageUrl: "" }],
    layout: "grid-5",
    isActive: true,
  });

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerApi.getAllBanners();
      if (response.success && Array.isArray(response.data)) setBanners(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setFormData({
      badge: "", title: { highlight: "", text: "" }, description: "",
      ctaButtons: [
        { text: "Get Started", link: "/contact", type: "primary" },
        { text: "View Our Work", link: "/projects", type: "secondary" },
      ],
      images: [{ id: 1, title: "", imageUrl: "" }],
      layout: "grid-5", isActive: true,
    });
  };

  const handleEdit = (banner) => {
    setIsEditing(true);
    setIsAdding(false);
    setEditingId(banner._id);
    setFormData({
      badge: banner.badge || "",
      title: banner.title || { highlight: "", text: "" },
      description: banner.description || "",
      ctaButtons: banner.ctaButtons || [],
      images: banner.images || [],
      layout: banner.layout || "grid-5",
      isActive: banner.isActive !== false,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (isAdding) await bannerApi.createBanner(formData);
      else if (isEditing && editingId) await bannerApi.updateBanner(editingId, formData);
      await fetchBanners();
      setIsAdding(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bannerId) => {
    try {
      setLoading(true);
      await bannerApi.deleteBanner(bannerId);
      await fetchBanners();
      setDeleteModal({ show: false, bannerId: null, bannerTitle: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const addImage = () => setFormData({ ...formData, images: [...formData.images, { id: formData.images.length + 1, title: "", imageUrl: "" }] });
  const removeImage = (i) => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) });
  const updateImage = (i, field, value) => {
    const imgs = [...formData.images];
    imgs[i] = { ...imgs[i], [field]: value };
    setFormData({ ...formData, images: imgs });
  };
  const addCtaButton = () => setFormData({ ...formData, ctaButtons: [...formData.ctaButtons, { text: "", link: "", type: "primary" }] });
  const removeCtaButton = (i) => setFormData({ ...formData, ctaButtons: formData.ctaButtons.filter((_, idx) => idx !== i) });
  const updateCtaButton = (i, field, value) => {
    const btns = [...formData.ctaButtons];
    btns[i] = { ...btns[i], [field]: value };
    setFormData({ ...formData, ctaButtons: btns });
  };

  if (loading && banners.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <span className="ml-3 text-gray-400 text-sm">Loading banners...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Hero Banner Settings</h2>
        {!isAdding && !isEditing && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            Add Banner
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Banner Form */}
      {(isAdding || isEditing) && (
        <div className={cardStyle}>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">
            {isAdding ? "Add New Banner" : "Edit Banner"}
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Badge</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="dashboard-input"
                placeholder="SoftStack Agency"
              />
            </div>

            {/* Title fields — stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Title Highlight</label>
                <input
                  type="text"
                  value={formData.title.highlight}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, highlight: e.target.value } })}
                  className="dashboard-input"
                  placeholder="Modern"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Title Text</label>
                <input
                  type="text"
                  value={formData.title.text}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, text: e.target.value } })}
                  className="dashboard-input"
                  placeholder="Build Modern & Scalable Web Experiences"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="dashboard-textarea min-h-[80px] sm:min-h-[100px]"
                placeholder="We design and develop high-performance websites..."
              />
            </div>

            {/* CTA Buttons */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs sm:text-sm text-gray-400">CTA Buttons</label>
                <button onClick={addCtaButton} className="text-xs px-2 sm:px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400">
                  + Add Button
                </button>
              </div>
              {formData.ctaButtons.map((btn, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="text"
                    value={btn.text}
                    onChange={(e) => updateCtaButton(index, "text", e.target.value)}
                    className="dashboard-input flex-1"
                    placeholder="Button Text"
                  />
                  <input
                    type="text"
                    value={btn.link}
                    onChange={(e) => updateCtaButton(index, "link", e.target.value)}
                    className="dashboard-input flex-1"
                    placeholder="/link"
                  />
                  <div className="flex gap-2">
                    <select
                      value={btn.type}
                      onChange={(e) => updateCtaButton(index, "type", e.target.value)}
                      className="dashboard-select flex-1 sm:flex-none"
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                    <button onClick={() => removeCtaButton(index)} className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400">
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Images */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs sm:text-sm text-gray-400">Images</label>
                <button onClick={addImage} className="text-xs px-2 sm:px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400">
                  + Add Image
                </button>
              </div>
              {formData.images.map((img, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="text"
                    value={img.title}
                    onChange={(e) => updateImage(index, "title", e.target.value)}
                    className="dashboard-input flex-1"
                    placeholder="Image Title"
                  />
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={img.imageUrl}
                      onChange={(e) => updateImage(index, "imageUrl", e.target.value)}
                      className="dashboard-input flex-1"
                      placeholder="Image URL"
                    />
                    <button onClick={() => removeImage(index)} className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 flex-shrink-0">
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Layout + Status */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Layout</label>
                <select
                  value={formData.layout}
                  onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 bg-[#05060a] border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500 text-xs sm:text-sm md:text-base"
                >
                  <option value="grid-5">Grid 5</option>
                  <option value="grid-4">Grid 4</option>
                  <option value="grid-3">Grid 3</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Status</label>
                <select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                  className="w-full px-3 sm:px-4 py-2 bg-[#05060a] border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500 text-xs sm:text-sm md:text-base"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <Save size={16} className="sm:w-5 sm:h-5" />
                {loading ? "Saving..." : "Save Banner"}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm sm:text-base"
              >
                <X size={16} className="sm:w-5 sm:h-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banners List */}
      {!isAdding && !isEditing && (
        <div className="grid gap-3 sm:gap-4">
          {banners.map((banner) => (
            <div key={banner._id} className={cardStyle}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 sm:py-1 bg-blue-500/20 text-blue-400 rounded">{banner.badge}</span>
                    <span className={`text-xs px-2 py-0.5 sm:py-1 rounded ${banner.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1">
                    <span className="text-cyan-400">{banner.title?.highlight}</span> {banner.title?.text}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{banner.description}</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    {banner.ctaButtons?.map((btn, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 sm:py-1 bg-purple-500/20 text-purple-400 rounded">
                        {btn.text} ({btn.type})
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {banner.images?.map((img, idx) => (
                      <div key={idx} className="text-xs px-2 py-0.5 sm:py-1 bg-gray-500/20 text-gray-400 rounded">
                        {img.title || `Image ${idx + 1}`}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 sm:flex-col sm:gap-2 self-start">
                  <button onClick={() => handleEdit(banner)} className="p-1.5 sm:p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors">
                    <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button onClick={() => setDeleteModal({ show: true, bannerId: banner._id, bannerTitle: banner.title?.text || "this banner" })} className="p-1.5 sm:p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors">
                    <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {banners.length === 0 && !loading && (
            <div className={`${cardStyle} text-center py-10 sm:py-12`}>
              <ImageIcon className="mx-auto mb-3 sm:mb-4 text-gray-600 w-10 h-10 sm:w-12 sm:h-12" />
              <p className="text-gray-400 text-sm sm:text-base">No banners found. Create your first banner!</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f23] border border-blue-500/30 rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full">
            <h3 className="text-base sm:text-xl font-semibold text-white mb-3 sm:mb-4">Confirm Delete</h3>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to delete "{deleteModal.bannerTitle}"?
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => handleDelete(deleteModal.bannerId)}
                disabled={loading}
                className="flex-1 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteModal({ show: false, bannerId: null, bannerTitle: "" })}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm sm:text-base"
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

// ===================== FAQs SECTION =====================
function FAQsSection({ cardStyle }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, faqId: null, faqQuestion: "" });

  const [formData, setFormData] = useState({ question: "", answer: "", isActive: true, order: 1 });

  useEffect(() => { fetchFAQs(); }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await faqApi.getAllFAQs();
      if (response.success && Array.isArray(response.data)) {
        setFaqs(response.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ question: "", answer: "", isActive: true, order: faqs.length + 1 });
  };

  const handleEdit = (faq) => {
    setEditingId(faq._id);
    setIsAdding(false);
    setFormData({ question: faq.question, answer: faq.answer, isActive: faq.isActive !== false, order: faq.order || 1 });
  };

  const handleSave = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert("Please fill in both question and answer");
      return;
    }
    try {
      setLoading(true);
      if (isAdding) await faqApi.createFAQ(formData);
      else if (editingId) await faqApi.updateFAQ(editingId, formData);
      await fetchFAQs();
      setIsAdding(false);
      setEditingId(null);
      setFormData({ question: "", answer: "", isActive: true, order: 1 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (faqId) => {
    try {
      setLoading(true);
      await faqApi.deleteFAQ(faqId);
      await fetchFAQs();
      setDeleteModal({ show: false, faqId: null, faqQuestion: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ question: "", answer: "", isActive: true, order: 1 });
  };

  if (loading && faqs.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <span className="ml-3 text-gray-400 text-sm">Loading FAQs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Manage FAQs</h2>
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            Add FAQ
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className={cardStyle}>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
            {editingId ? "Edit FAQ" : "Add New FAQ"}
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Question</label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="dashboard-input"
                placeholder="Enter question"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Answer</label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="dashboard-textarea min-h-[80px] sm:min-h-[100px]"
                placeholder="Enter answer"
              />
            </div>
            {/* Order + Status — always 2 cols since they're short */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 sm:px-4 py-2 bg-[#05060a] border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                  placeholder="1"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Status</label>
                <select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                  className="w-full px-3 sm:px-4 py-2 bg-[#05060a] border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <Save size={16} className="sm:w-5 sm:h-5" />
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm sm:text-base"
              >
                <X size={16} className="sm:w-5 sm:h-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQs List */}
      {!isAdding && !editingId && (
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq) => (
            <div key={faq._id} className={cardStyle}>
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded">
                      Order: {faq.order || 1}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${faq.isActive !== false ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {faq.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2">{faq.question}</h4>
                  <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 sm:line-clamp-none">{faq.answer}</p>
                </div>
                <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-1.5 sm:p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-blue-400"
                  >
                    <Edit size={14} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ show: true, faqId: faq._id, faqQuestion: faq.question })}
                    className="p-1.5 sm:p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400"
                  >
                    <Trash2 size={14} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {faqs.length === 0 && !loading && (
            <div className={`${cardStyle} text-center py-10 sm:py-12`}>
              <HelpCircle className="mx-auto mb-3 sm:mb-4 text-gray-600 w-10 h-10 sm:w-12 sm:h-12" />
              <p className="text-gray-400 text-sm sm:text-base">No FAQs found. Create your first FAQ!</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f23] border border-blue-500/30 rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full">
            <h3 className="text-base sm:text-xl font-semibold text-white mb-3 sm:mb-4">Confirm Delete</h3>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to delete this FAQ: <br />
              <span className="text-white font-semibold">"{deleteModal.faqQuestion}"</span>?
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => handleDelete(deleteModal.faqId)}
                disabled={loading}
                className="flex-1 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteModal({ show: false, faqId: null, faqQuestion: "" })}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm sm:text-base"
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