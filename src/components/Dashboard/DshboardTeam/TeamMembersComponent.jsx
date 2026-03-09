"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus, X, Loader2, Users, Edit, Trash2, Save,
  Image as ImageIcon, CheckCircle,
} from "lucide-react";
import { uploadImageToImgBB } from "@/lib/imgbb-upload";
import { auth } from "@/lib/firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

// ── Shared input / select / textarea class strings ──
const inputCls =
  "w-full bg-white/5 border border-blue-500/30 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 text-sm";
const selectCls =
  "w-full bg-[#0a0f23] border border-blue-500/30 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 text-sm";
const textareaCls =
  "w-full bg-white/5 border border-blue-500/30 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 text-sm resize-none";

export default function TeamMembersComponent() {
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, memberId: "", memberName: "" });
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const emptyForm = {
    name: "", role: "", roleValue: 1, department: "", profileImage: "",
    bio: "", city: "", state: "", country: "", joinedDate: "",
    skills: [""], github: "", linkedin: "", twitter: "", status: "active",
  };
  const [formData, setFormData] = useState(emptyForm);

  const cardStyle =
    "bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 sm:p-6 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500";

  useEffect(() => { fetchMembers(); fetchDepartments(); }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      const headers = { 'Content-Type': 'application/json' };
      if (user) { const token = await user.getIdToken(); headers.Authorization = `Bearer ${token}`; }
      const response = await fetch(`${API_BASE_URL}/team`, { credentials: "include", headers });
      if (!response.ok) throw new Error("Failed to fetch team members");
      const result = await response.json();
      setMembers(result.success && Array.isArray(result.data) ? result.data : []);
      setError(null);
    } catch (err) { setError(err.message); setMembers([]); }
    finally { setLoading(false); }
  };

  const fetchDepartments = async () => {
    try {
      const user = auth.currentUser;
      const headers = { 'Content-Type': 'application/json' };
      if (user) { const token = await user.getIdToken(); headers.Authorization = `Bearer ${token}`; }
      const response = await fetch(`${API_BASE_URL}/team/departments`, { credentials: "include", headers });
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) setDepartments(result.data);
      }
    } catch (error) { console.error('[TeamMembers] Error fetching departments:', error); }
  };

  const resetForm = () => setFormData(emptyForm);
  const openAddModal = () => { resetForm(); setIsEditing(false); setEditId(null); setShowFormModal(true); };
  const openEditModal = (member) => {
    let formattedDate = "";
    if (member.joinedDate) formattedDate = new Date(member.joinedDate).toISOString().split("T")[0];
    setFormData({
      name: member.name, role: member.role, roleValue: member.roleValue || 1,
      department: member.department, profileImage: member.profileImage || "",
      bio: member.bio || "", city: member.location?.city || "",
      state: member.location?.state || "", country: member.location?.country || "",
      joinedDate: formattedDate,
      skills: Array.isArray(member.skills) && member.skills.length > 0 ? member.skills : [""],
      github: member.socialLinks?.github || "", linkedin: member.socialLinks?.linkedin || "",
      twitter: member.socialLinks?.twitter || "", status: member.status || "active",
    });
    setIsEditing(true); setEditId(member._id); setShowFormModal(true);
  };
  const closeFormModal = () => { setShowFormModal(false); resetForm(); setIsEditing(false); setEditId(null); };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.role.trim() || !formData.department) {
      setError("Name, Role, and Department are required");
      setTimeout(() => setError(null), 3000); return;
    }
    try {
      setLoading(true);
      const user = auth.currentUser;
      const headers = { "Content-Type": "application/json" };
      if (user) { const token = await user.getIdToken(); headers.Authorization = `Bearer ${token}`; }
      const skillsArray = formData.skills.map((s) => s.trim()).filter((s) => s !== "");
      const payload = {
        name: formData.name, role: formData.role, roleValue: parseInt(formData.roleValue) || 1,
        department: formData.department, profileImage: formData.profileImage || undefined,
        bio: formData.bio || undefined,
        location: { city: formData.city || undefined, state: formData.state || undefined, country: formData.country || undefined },
        joinedDate: formData.joinedDate || undefined,
        skills: skillsArray.length > 0 ? skillsArray : undefined,
        socialLinks: { github: formData.github || undefined, linkedin: formData.linkedin || undefined, twitter: formData.twitter || undefined },
        status: formData.status,
      };
      const url = isEditing ? `${API_BASE_URL}/team/${editId}` : `${API_BASE_URL}/team`;
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, { method, headers, credentials: "include", body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? "update" : "create"} team member`);
      await fetchMembers();
      setSuccessMessage(`Team member ${isEditing ? "updated" : "added"} successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      closeFormModal(); setError(null);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (memberId) => {
    setDeleteModal({ show: false, memberId: "", memberName: "" });
    try {
      setLoading(true);
      const user = auth.currentUser;
      const headers = {};
      if (user) { const token = await user.getIdToken(); headers.Authorization = `Bearer ${token}`; }
      const response = await fetch(`${API_BASE_URL}/team/${memberId}`, { method: "DELETE", credentials: "include", headers });
      if (!response.ok) throw new Error("Failed to delete team member");
      await fetchMembers();
      setSuccessMessage("Team member deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const addSkill = () => setFormData({ ...formData, skills: [...formData.skills, ""] });
  const updateSkill = (i, v) => { const n = [...formData.skills]; n[i] = v; setFormData({ ...formData, skills: n }); };
  const removeSkill = (i) => setFormData({ ...formData, skills: formData.skills.filter((_, idx) => idx !== i) });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file"); setTimeout(() => setError(null), 3000); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image size should be less than 5MB"); setTimeout(() => setError(null), 3000); return; }
    try {
      setImageUploading(true);
      const result = await uploadImageToImgBB(file);
      if (result.success) setFormData({ ...formData, profileImage: result.imageUrl });
      else { setError(result.error || "Failed to upload image"); setTimeout(() => setError(null), 3000); }
    } catch (_) { setError("Error uploading image"); setTimeout(() => setError(null), 3000); }
    finally { setImageUploading(false); }
  };

  if (loading && members.length === 0) {
    return <div className="flex justify-center items-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="relative min-h-screen p-3 sm:p-4 md:p-6 overflow-auto text-slate-200">

      {/* ── Fix date picker icon color & select option bg ── */}
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.7;
          cursor: pointer;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
        select option {
          background-color: #0a0f23;
          color: #e2e8f0;
        }
      `}</style>

      <div className="relative z-10">

        {/* ── Page Header ── */}
        <div className="mb-5 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">Team Members</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400">Manage your team members, roles, and departments</p>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Manage Members</h2>
          <button
            onClick={openAddModal}
            disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            Add Member
          </button>
        </div>

        {/* ── Members Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {members.length === 0 && !loading && (
            <div className={`${cardStyle} md:col-span-2 text-center py-10 sm:py-12`}>
              <Users className="mx-auto mb-3 sm:mb-4 text-gray-600 w-10 h-10 sm:w-12 sm:h-12" />
              <p className="text-gray-400 text-sm sm:text-base">No team members yet. Add your first member!</p>
            </div>
          )}

          {members.map((member) => (
            <div key={member._id} className={`${cardStyle} relative`}>
              <div className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded font-medium ${member.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                {member.status}
              </div>
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                {member.profileImage ? (
                  <Image src={member.profileImage} alt={member.name} width={56} height={56} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0 border border-blue-500/30" />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-lg">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0 pr-12">
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold truncate">{member.name}</h4>
                  <p className="text-xs sm:text-sm text-blue-400 truncate">{member.role}</p>
                  {member.location?.city && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{[member.location.city, member.location.country].filter(Boolean).join(", ")}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/20">{member.department}</span>
              </div>
              {member.bio && <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3">{member.bio}</p>}
              {member.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {member.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded">{skill}</span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded">+{member.skills.length - 3} more</span>
                  )}
                </div>
              )}
              <div className="flex gap-2 mt-3 sm:mt-4">
                <button onClick={() => openEditModal(member)} disabled={loading} className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50">
                  <Edit size={14} className="sm:w-4 sm:h-4" /> Edit
                </button>
                <button onClick={() => setDeleteModal({ show: true, memberId: member._id, memberName: member.name })} disabled={loading} className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50">
                  <Trash2 size={14} className="sm:w-4 sm:h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ══════════ ADD / EDIT FORM MODAL ══════════ */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 pt-16 sm:pt-4 z-50 overflow-y-auto">
            <div className="bg-[#0a0f23]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.2)] w-full max-w-sm sm:max-w-2xl md:max-w-3xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden my-4">

              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-blue-500/20 sticky top-0 bg-[#0a0f23]/95 backdrop-blur-xl z-10">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                  {isEditing ? "Edit Member" : "Add New Member"}
                </h3>
                <button onClick={closeFormModal} className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">

                  {/* Name + Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Name *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="Enter member name" />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Role *</label>
                      <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className={inputCls} placeholder="e.g., Backend Engineer" />
                    </div>
                  </div>

                  {/* Role Value + Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Role Value (1–5) *</label>
                      <input type="number" value={formData.roleValue} onChange={(e) => setFormData({ ...formData, roleValue: e.target.value })} className={inputCls} placeholder="1" min="1" max="5" />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Department *</label>
                      <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className={selectCls}>
                        <option value="">Select department</option>
                        {departments.map((dept) => (
                          <option key={dept._id || dept.name} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Profile Image */}
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Profile Image</label>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg cursor-pointer transition-colors border border-blue-500/30 text-sm text-slate-200">
                          <ImageIcon size={16} className="sm:w-5 sm:h-5" />
                          {imageUploading ? "Uploading..." : "Upload Image"}
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={imageUploading} />
                        </label>
                        {imageUploading && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-500" />}
                      </div>
                      <input type="text" value={formData.profileImage} onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })} className={inputCls} placeholder="Or enter image URL" />
                      {formData.profileImage && (
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <Image src={formData.profileImage} alt="Preview" width={48} height={48} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
                          <span className="text-xs sm:text-sm text-green-400">Image uploaded successfully</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Bio</label>
                    <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className={`${textareaCls} min-h-[80px] sm:min-h-[100px]`} placeholder="Brief bio about the team member" />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Location</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={inputCls} placeholder="City" />
                      <input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className={inputCls} placeholder="State" />
                      <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className={inputCls} placeholder="Country" />
                    </div>
                  </div>

                  {/* Joined Date + Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Joined Date</label>
                      <input
                        type="date"
                        value={formData.joinedDate}
                        onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
                        className={inputCls}
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Status</label>
                      <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={selectCls}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Skills</label>
                    <div className="space-y-2">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <input type="text" value={skill} onChange={(e) => updateSkill(index, e.target.value)} className={`${inputCls} flex-1`} placeholder="Enter skill" />
                          <button type="button" onClick={() => removeSkill(index)} className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 flex-shrink-0 transition-colors">
                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={addSkill} className="text-xs px-2 sm:px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 border border-blue-500/20 transition-colors">
                        + Add Skill
                      </button>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Social Links</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      <input type="url" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} className={inputCls} placeholder="GitHub URL" />
                      <input type="url" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className={inputCls} placeholder="LinkedIn URL" />
                      <input type="url" value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} className={inputCls} placeholder="Twitter URL" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
                    <button type="button" onClick={handleSave} disabled={loading} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base">
                      {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Save size={16} className="sm:w-5 sm:h-5" />}
                      Save
                    </button>
                    <button type="button" onClick={closeFormModal} disabled={loading} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base">
                      <X size={16} className="sm:w-5 sm:h-5" /> Cancel
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
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Confirm Delete</h3>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to delete{" "}
                <span className="text-white font-semibold">&quot;{deleteModal.memberName}&quot;</span>? This action cannot be undone.
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button onClick={() => handleDelete(deleteModal.memberId)} disabled={loading} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />} Delete
                </button>
                <button onClick={() => setDeleteModal({ show: false, memberId: "", memberName: "" })} disabled={loading} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base">
                  <X size={16} /> Cancel
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

        {/* ══════════ ERROR TOAST ══════════ */}
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[min(90vw,360px)]">
            <div className="bg-[#0a0f23]/95 backdrop-blur-xl border border-red-500/30 rounded-2xl px-4 py-3.5 shadow-[0_0_20px_rgba(239,68,68,0.15)] flex items-center gap-3">
              <X className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Error!</p>
                <p className="text-red-400 text-xs">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="p-1 hover:bg-red-500/20 rounded transition-colors"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}