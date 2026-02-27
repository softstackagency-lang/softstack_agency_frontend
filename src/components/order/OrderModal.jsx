"use client";

import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle, AlertCircle, User, Mail, Phone, MapPin, CreditCard, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomAuth } from "@/hooks/useCustomAuth";

export default function OrderModal({ isOpen, onClose, plan, currency }) {
  const { user } = useCustomAuth();
  const [step, setStep] = useState(1); // 1: User Info, 2: Payment Method, 3: Transaction
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    // User Information
    name: user?.displayName || user?.name || "",
    email: user?.email || "",
    phone: user?.phone || user?.phoneNumber || "",
    address: user?.address || "",
    
    // Order Details
    planId: plan?._id || "",
    planName: plan?.name || "",
    price: plan?.price?.[currency] || 0,
    currency: currency,
    
    // Payment Information
    paymentMethod: "bkash", // bkash, nagad, rocket, card
    receiverNumber: user?.phone || user?.phoneNumber || "", // Number sending money from
    transactionId: "",
    notes: "",
  });

  // Pre-fill and log user data when modal opens or user changes
  useEffect(() => {
    if (user && isOpen) {
      
      const phoneNumber = user.phone || user.phoneNumber || "";
      
      setFormData(prev => {
        const updated = {
          ...prev,
          name: user.displayName || user.name || prev.name || "",
          email: user.email || prev.email || "",
          phone: user.phone || user.phoneNumber || prev.phone || "",
          address: user.address || prev.address || "",
          receiverNumber: phoneNumber,
        };
        return updated;
      });
    }
  }, [user, isOpen]);

  // Update plan details when plan changes
  useEffect(() => {
    if (plan) {
      setFormData(prev => ({
        ...prev,
        planId: plan._id || "",
        planName: plan.name || "",
        price: plan.price?.[currency] || 0,
        currency: currency,
      }));
    }
  }, [plan, currency]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
      
      // Validate required fields
      if (!formData.price || formData.price <= 0) {
        throw new Error('Invalid price information. Please try again.');
      }

      if (!formData.currency) {
        throw new Error('Currency information is missing.');
      }

      if (!formData.receiverNumber) {
        throw new Error('Please provide your payment number (number you are sending money from).');
      }

      // Use the simplified format that the backend expects
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || ""
        },
        planName: formData.planName,
        planPrice: `${formData.currency === "USD" ? "$" : "৳"}${formData.price}`,
        paymentMethod: formData.paymentMethod,
        receiverNumber: formData.receiverNumber || formData.phone, // Fallback to phone if not provided
        transactionId: formData.transactionId,
        notes: formData.notes || ""
      };


      // Try to use orderApi if user is authenticated, otherwise use fetch
      let result;
      try {
        // Import orderApi dynamically
        const { orderApi } = await import('@/lib/api');
        result = await orderApi.createOrder(orderData);
      } catch (apiError) {
        // If API call fails (not authenticated), fall back to direct fetch
        const response = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
        cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create order');
        }

        result = await response.json();
      }


      if (result.success) {
        setOrderSuccess(true);
        setOrderNumber(result.data.orderNumber);
        // Reset form after 3 seconds and close
        setTimeout(() => {
          onClose();
          resetForm();
        }, 3000);
      } else {
        throw new Error(result.message || 'Failed to create order');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setOrderSuccess(false);
    setOrderNumber(null);
    setError(null);
    setFormData({
      name: user?.displayName || user?.name || "",
      email: user?.email || "",
      phone: user?.phone || user?.phoneNumber || "",
      address: "",
      planId: "",
      planName: "",
      price: 0,
      currency: "USD",
      paymentMethod: "bkash",
      receiverNumber: user?.phone || user?.phoneNumber || "",
      transactionId: "",
      notes: "",
    });
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setTimeout(resetForm, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] my-auto overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-white/10 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={loading}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors disabled:opacity-50 shadow-lg"
              aria-label="Close modal"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Success State */}
            {orderSuccess ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Order Placed Successfully!</h3>
                <p className="text-gray-400 mb-4">Your order number is: <span className="text-cyan-400 font-semibold">{orderNumber}</span></p>
                <p className="text-sm text-gray-500">Well review your payment and get back to you soon.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-4 sm:p-5 md:p-6 z-10">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Complete Your Order</h2>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {plan?.name} - {currency === "USD" ? "$" : "৳"}{plan?.price?.[currency]?.toLocaleString()}
                  </p>
                  
                  {/* Progress Steps */}
                  <div className="flex items-center gap-2 mt-4">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex items-center flex-1">
                        <div className={`w-full h-1 rounded-full transition-colors ${s <= step ? 'bg-cyan-400' : 'bg-white/10'}`} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span className={step >= 1 ? 'text-cyan-400' : ''}>Info</span>
                    <span className={step >= 2 ? 'text-cyan-400' : ''}>Payment</span>
                    <span className={step >= 3 ? 'text-cyan-400' : ''}>Confirm</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-5 md:p-6 space-y-5 sm:space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                      <AlertCircle size={20} />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  {/* Step 1: User Information */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <User size={20} className="text-cyan-400" />
                        Contact Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Full Name * <span className="text-xs text-cyan-400">(Cannot be changed)</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            required
                            disabled={true}
                            className="w-full px-4 py-3 border rounded-lg text-white focus:outline-none transition bg-white/5 border-white/20 cursor-not-allowed opacity-75"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Email * <span className="text-xs text-cyan-400">(Cannot be changed)</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            required
                            disabled={true}
                            className="w-full px-4 py-3 border rounded-lg text-white focus:outline-none transition bg-white/5 border-white/20 cursor-not-allowed opacity-75"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Phone * <span className="text-xs text-cyan-400">(Cannot be changed)</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleInputChange}
                            required
                            disabled={true}
                            className="w-full px-4 py-3 border rounded-lg text-white focus:outline-none transition bg-white/5 border-white/20 cursor-not-allowed opacity-75"
                            placeholder="+880 1XXX-XXXXXX"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-400 mb-2">
                            Address <span className="text-xs text-cyan-400">(Cannot be changed)</span>
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleInputChange}
                            disabled={true}
                            className="w-full px-4 py-3 border rounded-lg text-white focus:outline-none transition bg-white/5 border-white/20 cursor-not-allowed opacity-75"
                            placeholder="City, Country"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition"
                      >
                        Continue to Payment
                      </button>
                    </motion.div>
                  )}

                  {/* Step 2: Payment Method */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <CreditCard size={20} className="text-cyan-400" />
                        Payment Method
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                        {['bkash', 'nagad', 'rocket', 'card'].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                            className={`p-3 sm:p-4 border rounded-lg text-center font-medium capitalize transition text-sm sm:text-base ${
                              formData.paymentMethod === method
                                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>

                      {/* Payment Number */}
                      <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl">
                        <div className="text-center">
                          <p className="text-sm text-gray-300 mb-2">Send money to this number:</p>
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <Phone className="w-5 h-5 text-cyan-400" />
                            <p className="text-3xl font-bold text-white tracking-wide">01626420774</p>
                          </div>
                          <p className="text-xs text-cyan-400 font-medium uppercase tracking-wider">
                            For {formData.paymentMethod.toUpperCase()} Payment
                          </p>
                        </div>
                      </div>

                      {/* Payment Instructions */}
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">Payment Instructions:</h4>
                        <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                          <li>Send {currency === "USD" ? "$" : "৳"}{plan?.price?.[currency]?.toLocaleString()} to <span className="font-semibold text-white">01626420774</span> via {formData.paymentMethod.toUpperCase()}</li>
                          <li>Note the transaction ID from your payment confirmation</li>
                          <li>Enter the transaction ID in the next step</li>
                          <li>Well verify and activate your plan within 24 hours</li>
                        </ol>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition"
                        >
                          Continue
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Transaction Details */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <FileText size={20} className="text-cyan-400" />
                        Transaction Details
                      </h3>

                      {/* Receiver Number (Number sending money from) */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Your Payment Number * <span className="text-xs text-cyan-400">(Number you are sending money from)</span>
                        </label>
                        <input
                          type="tel"
                          name="receiverNumber"
                          value={formData.receiverNumber || ""}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition"
                          placeholder="+880 1XXX-XXXXXX"
                        />
                        <p className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Please provide the phone number you are using to send the money
                        </p>
                      </div>

                      {/* Transaction ID */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Transaction ID / Reference Number *</label>
                        <input
                          type="text"
                          name="transactionId"
                          value={formData.transactionId}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition"
                          placeholder="Enter your transaction ID"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          This will be used to verify your payment
                        </p>
                      </div>

                      {/* Additional Notes */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Additional Notes (Optional)</label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition resize-none"
                          placeholder="Any special requirements or notes..."
                        />
                      </div>

                      {/* Order Summary */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-2">
                        <h4 className="font-semibold text-white mb-3">Order Summary</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Plan:</span>
                          <span className="text-white font-medium">{formData.planName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Payment Method:</span>
                          <span className="text-white font-medium capitalize">{formData.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Your Payment Number:</span>
                          <span className="text-white font-medium">{formData.receiverNumber || 'Not provided'}</span>
                        </div>
                        <div className="border-t border-white/10 my-2 pt-2 flex justify-between">
                          <span className="text-white font-semibold">Total:</span>
                          <span className="text-cyan-400 font-bold text-lg">
                            {currency === "USD" ? "$" : "৳"}{formData.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          disabled={loading}
                          className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition disabled:opacity-50"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading || !formData.transactionId || !formData.receiverNumber}
                          className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Place Order'
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
