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

  // Fetch all users data
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

  // Use authUser directly from useCustomAuth - no need to fetch again!
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const uploadResult = await uploadImageToImgBB(file);

      if (uploadResult.success) {
        // Update form with new image URL
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
        // Show success modal
        setShowSuccessModal(true)
        setIsEditing(false)
        
        // Hide modal after 1 second
        setTimeout(() => {
          setShowSuccessModal(false)
          // Reload to fetch updated data
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
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

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
              <a
                href="/signin"
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium"
              >
                Sign In
              </a>
              <Link
                href="/"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium inline-block"
              >
                Go Home
              </Link>
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
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium"
              >
                Retry
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium inline-block"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen p-6 overflow-auto text-slate-200">
      {/* Animated Background - Similar to OverviewComponent */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 -z-10" />
      
      <div className="max-w-6xl mx-auto mt-20">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Profile</h1>
          <p className="text-gray-400">Manage your personal information and account settings</p>
        </div>

        {/* Profile Header Card */}
        <div className="relative mb-8">
          <div className="bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5" />
            
            {/* Content */}
            <div className="relative p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                
                {/* Profile Image */}
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500 p-1 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0f23] flex items-center justify-center">
                        {previewImage ? (
                          <Image
                            src={previewImage}
                            alt={authUser.displayName || 'User'}
                            width={120}
                            height={120}
                            unoptimized
                            className="object-cover rounded-full"
                            onError={() => {
                              const imgElement = document.querySelector('#profile-fallback');
                              if (imgElement) {
                                imgElement.style.display = 'flex';
                              }
                            }}
                          />
                        ) : (
                          <User className="text-white w-12 h-12" />
                        )}
                        <div id="profile-fallback" className="absolute inset-0 hidden items-center justify-center bg-[#0a0f23] rounded-full">
                          <User className="text-white w-12 h-12" />
                        </div>
                      </div>
                    </div>

                    {/* Upload Button - Show only in edit mode */}
                    {isEditing && (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="absolute bottom-0 right-0 p-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#0a0f23]"
                          title="Upload profile picture"
                        >
                          {uploadingImage ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Camera size={20} />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Role Badge - Positioned to the right of image */}
                  <div className="flex items-center">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg ${
                      authUser.role === 'admin'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}>
                      <Shield size={14} />
                      {(authUser.role || 'user').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {authUser.displayName || 'User'}
                  </h1>
                  <p className="text-lg text-blue-300 mb-6">{authUser.email}</p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">
                        {authUser.role === 'admin' ? 'Full' : 'Limited'}
                      </div>
                      <div className="text-sm text-gray-400">Access Level</div>
                    </div>
                    <div className="w-px h-12 bg-blue-500/30"></div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">Active</div>
                      <div className="text-sm text-gray-400">Status</div>
                    </div>
                    {authUser.createdAt && (
                      <>
                        <div className="w-px h-12 bg-blue-500/30"></div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-purple-400">
                            {new Date(authUser.createdAt).getFullYear()}
                          </div>
                          <div className="text-sm text-gray-400">Member Since</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <div className="lg:ml-8">
                  <button
                    onClick={() => {
                      if (isEditing) {
                        setEditForm(authUser);
                        setPreviewImage(authUser.photoURL || null);
                      }
                      setIsEditing(!isEditing);
                    }}
                    className="group px-6 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-md border border-blue-500/30 text-white transition-all duration-300 flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                  >
                    <Edit2 size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PROFILE DETAILS ================= */}
        <div className="grid lg:grid-cols-1 gap-6">
          
          {/* Profile Information Card */}
          <div className="bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            
            <div className="relative p-8">
              {!isEditing ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Personal Information</h2>
                      <p className="text-sm text-gray-400">Your profile details and contact information</p>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <TrendingUp size={20} />
                      <span className="text-sm font-semibold">Profile Complete</span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <InfoCard icon={Mail} label="Email Address" value={authUser.email} />
                    <InfoCard icon={Phone} label="Phone Number" value={authUser.phoneNumber || 'Not provided'} />
                    <InfoCard icon={MapPin} label="Location" value={authUser.address || 'Not provided'} />
                    <InfoCard icon={Calendar} label="Member Since" value={authUser.createdAt ? formatDate(authUser.createdAt) : 'Recently joined'} />
                    <InfoCard icon={Shield} label="Account Role" value={(authUser.role || 'user').toUpperCase()} />
                    <InfoCard icon={User} label="Full Name" value={authUser.displayName || 'Not set'} />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">Edit Profile</h2>
                    <p className="text-sm text-gray-400">Update your personal information</p>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {/* Image Upload Info */}
                    {uploadingImage && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-blue-300">Uploading image to Cloudinary...</p>
                      </div>
                    )}

                    {editForm.photoURL && editForm.photoURL !== authUser.photoURL && !uploadingImage && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                        <CheckCircle size={20} className="text-green-400" />
                        <p className="text-sm text-green-300">New profile picture uploaded! Click Save to update.</p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      <ModernInput label="Full Name" value={editForm.displayName} onChange={(v) => setEditForm({ ...editForm, displayName: v })} icon={User} />
                      <ModernInput label="Email Address" value={editForm.email} onChange={(v) => setEditForm({ ...editForm, email: v })} icon={Mail} disabled={true} />
                      <ModernInput label="Phone Number" value={editForm.phoneNumber} onChange={(v) => setEditForm({ ...editForm, phoneNumber: v })} icon={Phone} />
                      <ModernInput label="Location" value={editForm.address} onChange={(v) => setEditForm({ ...editForm, address: v })} icon={MapPin} />
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm(authUser);
                          setPreviewImage(authUser.photoURL || null);
                        }}
                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-blue-500/30 text-white font-semibold transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={updating}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                      >
                        {updating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
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

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="group relative p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.05)] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
          <Icon size={20} className="text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">{label}</p>
          <p className="text-white font-semibold break-words">{value}</p>
        </div>
      </div>
    </div>
  )
}

function ModernInput({ label, value, onChange, icon: Icon, disabled = false }) {
  return (
    <div className="space-y-2">
      <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
        <Icon size={16} className="text-blue-400" />
        {label}
        {disabled && <span className="text-xs text-gray-500">(Read-only)</span>}
      </label>
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl bg-white/5 border border-blue-500/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 ${
          disabled ? 'opacity-50 cursor-not-allowed bg-white/5' : 'hover:border-blue-500/30'
        }`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  )
}
