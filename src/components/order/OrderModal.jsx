"use client";

import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle, AlertCircle, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomAuth } from "@/hooks/useCustomAuth";

export default function OrderModal({ isOpen, onClose, plan, currency }) {
  const { user } = useCustomAuth();
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
    categoryName: plan?.categoryName || "",
    planDescription: plan?.description || "",
    price: plan?.price?.[currency] || 0,
    currency: currency,
    notes: "",
  });

  // Pre-fill and log user data when modal opens or user changes
  useEffect(() => {
    if (user && isOpen) {
      setFormData(prev => {
        const updated = {
          ...prev,
          name: user.displayName || user.name || prev.name || "",
          email: user.email || prev.email || "",
          phone: user.phone || user.phoneNumber || prev.phone || "",
          address: user.address || prev.address || "",
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
        categoryName: plan.categoryName || "",
        planDescription: plan.description || "",
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

      // Use the simplified format that the backend expects
      const itemDescription =
        (formData.planDescription && formData.planDescription.trim()) ||
        `Pricing plan: ${formData.planName}`;

      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || ""
        },
        items: [
          {
            name: formData.categoryName || "Pricing",
            description: itemDescription,
            quantity: 1,
            unitPrice: Number(formData.price) || 0,
            totalPrice: Number(formData.price) || 0,
            productId: null,
            serviceId: null,
          },
        ],
        planName: formData.planName,
        planPrice: `${formData.currency === "USD" ? "$" : "৳"}${formData.price}`,
        paymentMethod: "not_required",
        receiverNumber: "",
        transactionId: "",
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
      categoryName: "",
      planDescription: "",
      price: 0,
      currency: "USD",
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
            className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] my-auto overflow-y-auto bg-linear-to-br from-slate-900 to-slate-950 rounded-2xl border border-white/10 shadow-2xl"
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
                {orderNumber && (
                  <p className="text-gray-400 mb-4">Your order number is: <span className="text-cyan-400 font-semibold">{orderNumber}</span></p>
                )}
                <p className="text-sm text-gray-300">Thank you! You will be contacted soon.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-4 sm:p-5 md:p-6 z-10">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Place Your Order</h2>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {plan?.name} - {currency === "USD" ? "$" : "৳"}{plan?.price?.[currency]?.toLocaleString()}
                  </p>
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
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg text-white focus:outline-none transition bg-white/5 border-white/20"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg text-white focus:outline-none transition bg-white/5 border-white/20"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg text-white focus:outline-none transition bg-white/5 border-white/20"
                            placeholder="+880 1XXX-XXXXXX"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-400 mb-2">
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border rounded-lg text-white focus:outline-none transition bg-white/5 border-white/20"
                            placeholder="City, Country"
                          />
                        </div>
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
                        <div className="border-t border-white/10 my-2 pt-2 flex justify-between">
                          <span className="text-white font-semibold">Total:</span>
                          <span className="text-cyan-400 font-bold text-lg">
                            {currency === "USD" ? "$" : "৳"}{formData.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !formData.name || !formData.email || !formData.phone}
                        className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
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
                  </motion.div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
