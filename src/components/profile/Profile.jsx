'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit2,
  Save,
  CheckCircle,
  TrendingUp,
  Camera,
  Upload
} from 'lucide-react'
import { updateUserProfile } from '../../controllers/userController'
import { useCustomAuth } from '../../hooks/useCustomAuth'
import { uploadImageToImgBB } from '../../lib/imgbb-upload'
import { userApi } from '../../lib/api'

export default function Profile() {
  const { user: authUser, loading: authLoading } = useCustomAuth();
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [updating, setUpdating] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const users = await userApi.getAllUsers();
        setAllUsers(users);
        console.log('=== All Users Data ===');
        console.log('Total Users:', users.length);
        console.log('All Users:', users);
        console.log('=====================');
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };
    if (authUser) {
      fetchAllUsers();
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      console.log('=== Profile User Data ===');
      console.log('Full User Object:', authUser);
      console.log('User Role:', authUser.role);
      console.log('User Email:', authUser.email);
      console.log('User UID:', authUser.uid);
      console.log('User Name:', authUser.name || authUser.displayName);
      console.log('User Photo:', authUser.photoURL || authUser.image);
      console.log('User Status:', authUser.status);
      console.log('Created At:', authUser.createdAt);
      console.log('========================');
      setEditForm(authUser);
      setPreviewImage(authUser.photoURL || null);
    }
  }, [authUser]);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Image size should be less than 5MB'); return; }
    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = () => { setPreviewImage(reader.result); };
      reader.readAsDataURL(file);
      const uploadResult = await uploadImageToImgBB(file);
      if (uploadResult.success) {
        setEditForm({ ...editForm, photoURL: uploadResult.imageUrl });
      } else {
        alert('Failed to upload image: ' + uploadResult.error);
        setPreviewImage(authUser.photoURL || null);
      }
    } catch (error) {
      alert('Failed to upload image');
      setPreviewImage(authUser.photoURL || null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      setUpdating(true)
      const result = await updateUserProfile(authUser, editForm)
      if (result.success) {
        setShowSuccessModal(true)
        setIsEditing(false)
        setTimeout(() => {
          setShowSuccessModal(false)
          window.location.reload()
        }, 1000)
      } else {
        setError(result.error || 'Update failed')
      }
    } catch (error) {
      setError('Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-20 w-20 border-4 border-cyan-400 border-t-transparent rounded-full" />
          <p className="text-cyan-300 text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05060a] p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-red-400 mb-2">Please Sign In</h2>
                <p className="text-red-300/80 text-sm">You need to be logged in to view your profile</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <a href="/signin" className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium">Sign In</a>
              <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium inline-block">Go Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05060a] p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-red-400 mb-2">{error}</h2>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium">Retry</button>
              <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium inline-block">Go Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen text-slate-200 overflow-auto">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 -z-10" />
      {/* Subtle grid overlay */}
      <div className="fixed inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">

        {/* ── Page Title ── */}
        <div className="flex items-end justify-between mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-blue-400 uppercase mb-1">Account</p>
            <h1 className="text-4xl font-bold text-white tracking-tight">Profile</h1>
          </div>
          <button
            onClick={() => {
              if (isEditing) { setEditForm(authUser); setPreviewImage(authUser.photoURL || null); }
              setIsEditing(!isEditing);
            }}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <Edit2 size={15} className="group-hover:rotate-12 transition-transform duration-200" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ─── LEFT SIDEBAR ─── */}
          <div className="lg:w-72 flex-shrink-0 space-y-5">

            {/* Avatar card */}
            <div className="relative bg-[#0a0f23]/70 backdrop-blur-xl border border-blue-500/25 rounded-2xl p-6 flex flex-col items-center text-center overflow-hidden">
              {/* decorative glow blob */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] shadow-[0_0_30px_rgba(99,102,241,0.35)]">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-[#0a0f23] flex items-center justify-center">
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt={authUser.displayName || 'User'}
                        width={112}
                        height={112}
                        unoptimized
                        className="object-cover w-full h-full"
                        onError={() => {
                          const imgElement = document.querySelector('#profile-fallback');
                          if (imgElement) imgElement.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <User className="text-white w-10 h-10" />
                    )}
                    <div id="profile-fallback" className="absolute inset-0 hidden items-center justify-center bg-[#0a0f23] rounded-2xl">
                      <User className="text-white w-10 h-10" />
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      title="Upload profile picture"
                      className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg transition-all duration-200 disabled:opacity-50 border-2 border-[#0a0f23]"
                    >
                      {uploadingImage
                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <Camera size={16} />}
                    </button>
                  </>
                )}
              </div>

              <h2 className="text-xl font-bold text-white leading-tight">{authUser.displayName || 'User'}</h2>
              <p className="text-sm text-blue-300/80 mt-1 break-all">{authUser.email}</p>

              {/* Role badge */}
              <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${authUser.role === 'admin'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                <Shield size={11} />
                {(authUser.role || 'user').toUpperCase()}
              </div>
            </div>

            {/* Quick stats card */}
            <div className="bg-[#0a0f23]/70 backdrop-blur-xl border border-blue-500/25 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-blue-500/15">
                <p className="text-xs font-semibold tracking-widest text-blue-400/70 uppercase">Account Stats</p>
              </div>
              <div className="divide-y divide-blue-500/10">
                <StatRow label="Access Level" value={authUser.role === 'admin' ? 'Full' : 'Limited'} color="text-blue-400" />
                <StatRow label="Status" value="Active" color="text-green-400" />
                {authUser.createdAt && (
                  <StatRow label="Member Since" value={new Date(authUser.createdAt).getFullYear()} color="text-purple-400" />
                )}
              </div>
            </div>
          </div>

          {/* ─── RIGHT MAIN PANEL ─── */}
          <div className="flex-1">
            <div className="bg-[#0a0f23]/70 backdrop-blur-xl border border-blue-500/25 rounded-2xl overflow-hidden">

              {/* Panel header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-blue-500/15">
                <div>
                  <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Information' : 'Personal Information'}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{isEditing ? 'Update your personal details below' : 'Your profile details and contact information'}</p>
                </div>
                {!isEditing && (
                  <div className="flex items-center gap-1.5 text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-lg">
                    <TrendingUp size={14} />
                    <span className="text-xs font-semibold">Complete</span>
                  </div>
                )}
              </div>

              {/* Panel body */}
              <div className="p-8">
                {!isEditing ? (
                  <div className="space-y-3">
                    {/* Two-row grid of info items */}
                    <InfoRow icon={User} label="Full Name" value={authUser.displayName || 'Not set'} />
                    <InfoRow icon={Mail} label="Email Address" value={authUser.email} />
                    <InfoRow icon={Phone} label="Phone Number" value={authUser.phoneNumber || 'Not provided'} />
                    <InfoRow icon={MapPin} label="Location" value={authUser.address || 'Not provided'} />
                    <InfoRow icon={Calendar} label="Member Since" value={authUser.createdAt ? formatDate(authUser.createdAt) : 'Recently joined'} />
                    <InfoRow icon={Shield} label="Account Role" value={(authUser.role || 'user').toUpperCase()} />
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    {uploadingImage && (
                      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                        <p className="text-sm text-blue-300">Uploading image...</p>
                      </div>
                    )}
                    {editForm.photoURL && editForm.photoURL !== authUser.photoURL && !uploadingImage && (
                      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-green-500/10 border border-green-500/30">
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                        <p className="text-sm text-green-300">New profile picture uploaded! Click Save to update.</p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-5">
                      <ModernInput label="Full Name" value={editForm.displayName} onChange={(v) => setEditForm({ ...editForm, displayName: v })} icon={User} />
                      <ModernInput label="Email Address" value={editForm.email} onChange={(v) => setEditForm({ ...editForm, email: v })} icon={Mail} disabled={true} />
                      <ModernInput label="Phone Number" value={editForm.phoneNumber} onChange={(v) => setEditForm({ ...editForm, phoneNumber: v })} icon={Phone} />
                      <ModernInput label="Location" value={editForm.address} onChange={(v) => setEditForm({ ...editForm, address: v })} icon={MapPin} />
                    </div>

                    <div className="flex gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); setEditForm(authUser); setPreviewImage(authUser.photoURL || null); }}
                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-blue-500/25 text-slate-300 font-medium text-sm transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={updating}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                      >
                        {updating ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                        ) : (
                          <><Save size={16} />Save Changes</>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-[#0a0f23]/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 mx-4 max-w-md w-full shadow-[0_0_50px_rgba(59,130,246,0.3)]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Profile Updated!</h3>
              <p className="text-gray-400">Your profile has been successfully updated.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Subcomponents ── */

function StatRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-sm font-semibold ${color}`}>{value}</span>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-blue-500/15 transition-all duration-200 group">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-blue-500/20 flex items-center justify-center">
        <Icon size={16} className="text-blue-400" />
      </div>
      <div className="flex-1 flex items-center justify-between min-w-0">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider w-32 flex-shrink-0">{label}</span>
        <span className="text-sm text-white font-medium text-right truncate">{value}</span>
      </div>
    </div>
  )
}

function ModernInput({ label, value, onChange, icon: Icon, disabled = false }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <Icon size={13} className="text-blue-400" />
        {label}
        {disabled && <span className="text-gray-600 normal-case tracking-normal font-normal">(read-only)</span>}
      </label>
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200 ${disabled
          ? 'opacity-40 cursor-not-allowed border-blue-500/10'
          : 'border-blue-500/20 hover:border-blue-500/35'
          }`}
      />
    </div>
  )
}