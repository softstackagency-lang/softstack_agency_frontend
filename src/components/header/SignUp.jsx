"use client";

import { useLayout } from "@/context/LayoutContext";
import Lottie from "lottie-react";
import { Eye, EyeOff, ChevronRight, Camera, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { authApi } from "@/lib/api";
import { formatErrorMessage } from "@/lib/error-handler";
import { uploadImageToImgBB } from "@/lib/imgbb-upload";

import signup from "../../../public/Sign up.json";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { setShowHeader, setShowFooter } = useLayout();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    image: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowHeader(false);
    setShowFooter(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 0);

    return () => {
      clearTimeout(timer);
      setShowHeader(true);
      setShowFooter(true);
    };
  }, [setShowHeader, setShowFooter]);

  const formatPhoneNumber = (phone) => {
    if (!phone || phone.trim() === '') {
      return ''; // Return empty if no phone number
    }

    // Remove all non-digit characters
    let digits = phone.replace(/\D/g, '');

    // If it starts with 880, it already has country code
    if (digits.startsWith('880')) {
      return '+' + digits;
    }

    // If it starts with 0, remove it (local format)
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }

    // Add Bangladesh country code +880
    return '+880' + digits;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (JPG, PNG, GIF, or WebP)");
        // Reset the input
        e.target.value = '';
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        // Reset the input
        e.target.value = '';
        return;
      }

      setError('');
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        setError("Failed to read image file");
        setImageFile(null);
        setImagePreview(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      ...formData,
      image: "",
    });
    // Reset the file input
    const fileInput = document.getElementById('profile-image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      setError('Please accept the Terms & Conditions');
      return;
    }

    // Validate phone number if provided
    if (formData.phone && formData.phone.trim() !== '') {
      const digits = formData.phone.replace(/\D/g, '');
      // Bangladesh mobile numbers are 11 digits (starting with 0) or 10 digits (without 0)
      if (digits.length < 10 || digits.length > 11) {
        setError('Please enter a valid phone number (10-11 digits). Example: 01712345678');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      let imageUrl = '';

      // Upload image if provided
      if (imageFile) {
        setUploadingImage(true);
        
        const uploadResult = await uploadImageToImgBB(imageFile);
        
        if (uploadResult.success) {
          imageUrl = uploadResult.imageUrl;
        } else {
          setError(`Failed to upload image: ${uploadResult.error || 'Unknown error'}`);
          setLoading(false);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      // Format phone number with +880 country code
      const formattedPhone = formData.phone ? formatPhoneNumber(formData.phone) : '';

      const signUpData = {
        ...formData,
        phone: formattedPhone,
        image: imageUrl,
      };

      const response = await authApi.registerWithEmail(signUpData);

      if (response.success) {
        setShowSuccessModal(true);
        // Redirect to signin after 2 seconds
        setTimeout(() => {
          router.push('/signin?message=Account created successfully');
        }, 2000);
      } else {
        setError(response.message || 'Sign up failed');
      }
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');

    try {
      // Firebase Google sign-in
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Send token to backend
      const response = await authApi.registerWithGoogle(idToken);

      if (response.success) {
        setShowSuccessModal(true);
        // Redirect to home after showing success modal
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError(response.message || 'Google sign up failed');
      }
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 md:p-6 bg-[#0b1220] overflow-hidden">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-8 max-w-md mx-4 shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-slideUp">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Registration Successful!</h3>
              <p className="text-gray-300">Your account has been created successfully.</p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CARD */}
      <div className="relative flex w-full max-w-7xl h-full md:h-[90vh] md:max-w-6xl rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(56,189,248,0.15)] border border-cyan-500/10">
        {/* GLOW */}
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-blue-500/5 to-transparent pointer-events-none" />

        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 relative p-6 lg:p-8 flex-col bg-[#0f172a] overflow-hidden min-h-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/35 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-700" />

          {/* TOP */}
          <div className="relative z-10 flex justify-between items-center shrink-0 mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-linear-to-br from-cyan-400 to-blue-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <Link href="/" className="text-md font-bold">
                  <span className="text-white">SoftStack </span>
                  <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Agency
                  </span>
                </Link>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-cyan-200 hover:text-white transition bg-gray-700 py-2 px-3 rounded-full"
            >
              Back to website <ChevronRight size={14} />
            </Link>
          </div>

          {/* MIDDLE CONTENT */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-6 px-4">
            <div className="w-full max-w-sm h-52 flex items-center justify-center">
              <div className="w-full h-full">
                <Lottie
                  key="signup-lottie"
                  animationData={signup}
                  loop={true}
                  autoplay={true}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>

            <div className="text-center max-w-sm mx-auto">
              <h2 className="text-2xl lg:text-3xl font-semibold text-white leading-tight mb-4">
                Build Fast. <br />
                <span className="text-cyan-400">Launch Smarter.</span>
              </h2>
              <p className="text-cyan-200/70 text-sm leading-relaxed">
                Create your account and start building modern solutions today.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex items-start justify-center bg-[#020617] overflow-hidden">
          <div className="w-full h-full overflow-y-auto px-6 md:px-12 py-8 signup-scroll">
            <div className="w-full max-w-md mx-auto space-y-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                  Create an account
                </h2>
                <p className="text-gray-400 mb-6 text-sm">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-cyan-400 hover:text-cyan-300 underline">
                    Sign in
                  </Link>
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 shrink-0">⚠️</span>
                    <div className="whitespace-pre-line">{error}</div>
                  </div>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleEmailSignUp}>
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative group">
                    {imagePreview ? (
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                          <img
                            src={imagePreview} 
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition shadow-lg hover:scale-110"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-dashed border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400/50 transition-all">
                        <Camera className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                  </div>
                  <label className="mt-3 cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <div className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40">
                      <Upload size={16} />
                      {imagePreview ? "Change Photo" : "Upload Photo"}
                    </div>
                  </label>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    JPG, PNG, GIF or WebP • Max 5MB
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#0f1629] border border-cyan-500/20 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email address *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#0f1629] border border-cyan-500/20 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number (Optional)"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#0f1629] border border-cyan-500/20 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1 px-1">Format: 01XXXXXXXXX (Will be saved as +880XXXXXXXXX)</p>
                  </div>

                  <input
                    type="text"
                    name="address"
                    placeholder="Address (Optional)"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-[#0f1629] border border-cyan-500/20 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password *"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0f1629] border border-cyan-500/20 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-300 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-400 mt-4">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="accent-cyan-500"
                  />
                  I agree to the Terms & Conditions
                </label>

                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="w-full py-2.5 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4 relative overflow-hidden"
                >
                  {uploadingImage ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading Image...
                    </span>
                  ) : loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              <div className="my-4 flex items-center">
                <div className="flex-1 border-t border-cyan-500/20"></div>
                <span className="px-4 text-gray-400 text-xs">or</span>
                <div className="flex-1 border-t border-cyan-500/20"></div>
              </div>

              <button
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full py-2.5 rounded-lg border border-cyan-500/20 text-white font-medium hover:bg-cyan-500/10 transition flex items-center justify-center gap-3 text-sm mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}