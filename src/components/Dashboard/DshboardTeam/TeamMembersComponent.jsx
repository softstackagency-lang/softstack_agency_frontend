"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, X, Upload, Loader2, Users } from "lucide-react";
import { uploadImageToImgBB } from "@/lib/imgbb-upload";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export default function TeamMembersComponent() {
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, memberId: "", memberName: "" });
  const [showFormModal, setShowFormModal] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", role: "", roleValue: 1, department: "", profileImage: "",
    bio: "", city: "", state: "", country: "", joinedDate: "",
    skills: [""], github: "", linkedin: "", twitter: "", status: "active",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMembers();
    fetchDepartments();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/team`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch team members');
      const result = await response.json();
      setMembers(result.success && Array.isArray(result.data) ? result.data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/departments`, { credentials: 'include' });
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) setDepartments(result.data);
      }
    } catch (err) { }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "", role: "", roleValue: 1, department: "", profileImage: "",
      bio: "", city: "", state: "", country: "", joinedDate: "",
      skills: [""], github: "", linkedin: "", twitter: "", status: "active",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills.map(s => s.trim()).filter(s => s !== "");
      const payload = {
        name: formData.name, role: formData.role,
        roleValue: parseInt(formData.roleValue) || 1,
        department: formData.department,
        profileImage: formData.profileImage || undefined,
        bio: formData.bio || undefined,
        location: { city: formData.city || undefined, state: formData.state || undefined, country: formData.country || undefined },
        joinedDate: formData.joinedDate || undefined,
        skills: skillsArray.length > 0 ? skillsArray : undefined,
        socialLinks: { github: formData.github || undefined, linkedin: formData.linkedin || undefined, twitter: formData.twitter || undefined },
        status: formData.status,
      };

      const url = isEditing ? `${API_BASE_URL}/team/${editId}` : `${API_BASE_URL}/team`;
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} team member`);

      await fetchMembers();
      setSuccessMessage(`Team member ${isEditing ? 'updated' : 'added'} successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      resetForm();
      setIsEditing(false);
      setEditId(null);
      setShowFormModal(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (member) => {
    let formattedDate = "";
    if (member.joinedDate) formattedDate = new Date(member.joinedDate).toISOString().split('T')[0];
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
    setIsEditing(true);
    setEditId(member._id);
    setShowFormModal(true);
  };

  const handleDelete = async (memberId) => {
    setDeleteModal({ show: false, memberId: "", memberName: "" });
    try {
      const response = await fetch(`${API_BASE_URL}/team/${memberId}`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) throw new Error('Failed to delete team member');
      await fetchMembers();
      setSuccessMessage("Team member deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
    setEditId(null);
    setShowFormModal(false);
  };

  const addSkill = () => setFormData({ ...formData, skills: [...formData.skills, ""] });
  const updateSkill = (index, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData({ ...formData, skills: newSkills });
  };
  const removeSkill = (index) => setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select a valid image file'); setTimeout(() => setError(null), 3000); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image size should be less than 5MB'); setTimeout(() => setError(null), 3000); return; }
    try {
      setImageUploading(true);
      const result = await uploadImageToImgBB(file);
      if (result.success) {
        setFormData({ ...formData, profileImage: result.imageUrl });
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

  const inputClass = "w-full px-3 py-2.5 text-sm bg-slate-900/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors";
  const labelClass = "block text-gray-300 text-sm mb-1.5 font-medium";

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-5 sm:mb-6 mt-12 md:mt-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-white">Team Members</h1>
        </div>
        <button
          onClick={() => setShowFormModal(true)}
          className="px-3 py-2 sm:px-5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors flex items-center gap-1.5 text-sm sm:text-base font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Success Toast - top center */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[min(90vw,360px)]">
          <div className="bg-gradient-to-r from-green-900/95 to-emerald-900/95 border border-green-500/40 rounded-xl px-4 py-3.5 shadow-2xl backdrop-blur-md flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Success!</p>
              <p className="text-green-300 text-xs">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal - bottom sheet on mobile, centered on desktop */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:w-auto sm:max-w-md bg-slate-900 border-t sm:border border-slate-700 sm:border-red-500/30 rounded-t-2xl sm:rounded-xl p-5 sm:p-6 shadow-2xl">
            {/* Drag handle for mobile */}
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-500/15 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-1">Delete Member</h3>
                <p className="text-gray-400 text-sm mb-5">
                  Are you sure you want to delete <span className="font-semibold text-white">&quot;{deleteModal.memberName}&quot;</span>? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteModal({ show: false, memberId: "", memberName: "" })}
                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => handleDelete(deleteModal.memberId)}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal - bottom sheet on mobile, centered modal on desktop */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full sm:w-[min(100vw-2rem,672px)] max-h-[92dvh] sm:max-h-[88vh] bg-slate-900 border-t sm:border border-slate-700 sm:border-blue-500/25 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col">

            {/* Drag handle (mobile only) */}
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700/80 shrink-0">
              <h2 className="text-base sm:text-lg font-semibold text-white">
                {isEditing ? "Edit Member" : "Add New Member"}
              </h2>
              <button onClick={handleCancel}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 overscroll-contain">
              <form id="memberForm" onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 space-y-4">

                {/* Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className={inputClass} placeholder="Enter member name" />
                  </div>
                  <div>
                    <label className={labelClass}>Role *</label>
                    <input type="text" name="role" value={formData.role} onChange={handleInputChange} required className={inputClass} placeholder="e.g., Backend Engineer" />
                  </div>
                </div>

                {/* Role Value & Department */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Role Value (1–5) *</label>
                    <input type="number" name="roleValue" value={formData.roleValue} onChange={handleInputChange} required min="1" max="5" className={inputClass} placeholder="1-5" />
                  </div>
                  <div>
                    <label className={labelClass}>Department *</label>
                    <select name="department" value={formData.department} onChange={handleInputChange} required className={inputClass}>
                      <option value="">Select</option>
                      {departments.map((dept) => (
                        <option key={dept._id || dept.name} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Profile Image */}
                <div>
                  <label className={labelClass}>Profile Image</label>
                  {formData.profileImage && (
                    <div className="mb-2 relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-blue-500/30">
                      <Image src={formData.profileImage} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                  <input type="url" name="profileImage" value={formData.profileImage} onChange={handleInputChange} className={`${inputClass} mb-2`} placeholder="https://example.com/image.jpg" />
                  <label className="block cursor-pointer">
                    <div className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed transition-colors ${imageUploading ? 'border-blue-500/40 bg-blue-500/5 cursor-not-allowed' : 'border-blue-500/25 hover:border-blue-500/50 hover:bg-blue-500/5 active:bg-blue-500/10'}`}>
                      {imageUploading
                        ? <><Loader2 className="w-4 h-4 animate-spin text-blue-400" /><span className="text-sm text-gray-400">Uploading...</span></>
                        : <><Upload className="w-4 h-4 text-blue-400" /><span className="text-sm text-gray-300">Upload Image</span></>}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-600 mt-1">Max 5MB</p>
                </div>

                {/* Bio */}
                <div>
                  <label className={labelClass}>Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3" className={inputClass} placeholder="Brief bio about the team member" />
                </div>

                {/* Location */}
                <div>
                  <label className={labelClass}>Location</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={inputClass} placeholder="City" />
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} className={inputClass} placeholder="State" />
                    <input type="text" name="country" value={formData.country} onChange={handleInputChange} className={inputClass} placeholder="Country" />
                  </div>
                </div>

                {/* Date & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Joined Date</label>
                    <input type="date" name="joinedDate" value={formData.joinedDate} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className={inputClass}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className={labelClass}>Skills</label>
                  <div className="space-y-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={skill} onChange={(e) => updateSkill(index, e.target.value)} className={`${inputClass} flex-1`} placeholder="Enter skill" />
                        <button type="button" onClick={() => removeSkill(index)}
                          className="w-10 h-10 flex items-center justify-center bg-red-500/15 hover:bg-red-500/25 active:bg-red-500/35 rounded-lg transition-colors shrink-0">
                          <X size={15} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={addSkill}
                      className="flex items-center gap-1.5 px-3 py-2 bg-blue-500/15 hover:bg-blue-500/25 rounded-lg text-sm text-blue-300 font-medium transition-colors">
                      <Plus size={14} /> Add Skill
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <label className={labelClass}>Social Links</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input type="url" name="github" value={formData.github} onChange={handleInputChange} className={inputClass} placeholder="GitHub URL" />
                    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className={inputClass} placeholder="LinkedIn URL" />
                    <input type="url" name="twitter" value={formData.twitter} onChange={handleInputChange} className={inputClass} placeholder="Twitter URL" />
                  </div>
                </div>

                {/* Bottom padding for sticky footer clearance */}
                <div className="h-2" />
              </form>
            </div>

            {/* Sticky Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-700/80 shrink-0 bg-slate-900">
              {error && (
                <div className="bg-red-500/15 border border-red-500/40 text-red-300 px-3 py-2 rounded-lg mb-3 text-xs sm:text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={handleCancel}
                  className="flex-1 sm:flex-none sm:w-28 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" form="memberForm"
                  className="flex-1 sm:flex-none sm:w-36 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">
                  {isEditing ? "Update Member" : "Add Member"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top-level error (outside modal) */}
      {error && !showFormModal && (
        <div className="bg-red-500/15 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-gray-400 text-sm">Loading team members...</span>
        </div>
      ) : (
        <>
          {members.length > 0 && (
            <p className="text-gray-600 text-xs mb-4">{members.length} member{members.length !== 1 ? 's' : ''}</p>
          )}

          {/* Members Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {members.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-14 h-14 bg-blue-600/10 rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7 text-blue-600/40" />
                </div>
                <p className="text-gray-500 text-sm">No team members yet.</p>
                <button onClick={() => setShowFormModal(true)} className="text-blue-400 text-sm hover:text-blue-300 underline underline-offset-2">
                  Add your first member
                </button>
              </div>
            ) : (
              members.map((member) => (
                <div key={member._id}
                  className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-4 hover:border-blue-500/40 transition-all">

                  {/* Avatar + Info */}
                  <div className="flex items-start gap-3 mb-3">
                    {member.profileImage ? (
                      <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden relative shrink-0 border border-blue-500/20">
                        <Image src={member.profileImage} alt={member.name} width={52} height={52} className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 bg-blue-600/30 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{member.name}</h3>
                      <p className="text-blue-400 text-xs truncate">{member.role}</p>
                      {member.location?.city && (
                        <p className="text-gray-500 text-xs truncate mt-0.5">
                          {[member.location.city, member.location.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{member.bio}</p>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-0.5 bg-purple-600/25 text-purple-300 rounded-full text-xs">{member.department}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${member.status === 'active' ? 'bg-green-600/25 text-green-300' : 'bg-gray-600/25 text-gray-400'}`}>
                      {member.status}
                    </span>
                  </div>

                  {/* Skills */}
                  {member.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {member.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="text-xs bg-blue-600/15 text-blue-300 px-2 py-0.5 rounded">{skill}</span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="text-xs text-gray-500 self-center">+{member.skills.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(member)}
                      className="flex-1 py-2 bg-blue-600/70 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors">
                      Edit
                    </button>
                    <button onClick={() => setDeleteModal({ show: true, memberId: member._id, memberName: member.name })}
                      className="flex-1 py-2 bg-red-600/70 hover:bg-red-600 active:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors">
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