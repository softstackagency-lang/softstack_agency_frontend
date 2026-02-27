"use client";

import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle, Loader2, Calendar, User, Mail, Phone, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

// Static demo orders
const staticOrders = [
  {
    _id: "1",
    orderNumber: "ORD-123456",
    status: "completed",
    planName: "Professional Plan",
    planPrice: "$2,999",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+880 1234-567890",
      address: "Dhaka, Bangladesh"
    },
    paymentMethod: "bkash",
    transactionId: "BKH123456789",
    notes: "Website redesign project",
    createdAt: "2026-01-15T10:30:00Z"
  },
  {
    _id: "2",
    orderNumber: "ORD-123457",
    status: "pending",
    planName: "Enterprise Plan",
    planPrice: "$5,999",
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+880 1987-654321",
      address: "Chittagong, Bangladesh"
    },
    paymentMethod: "nagad",
    transactionId: "NGD987654321",
    notes: "E-commerce platform development",
    createdAt: "2026-01-28T14:20:00Z"
  },
  {
    _id: "3",
    orderNumber: "ORD-123458",
    status: "pending",
    planName: "Basic Plan",
    planPrice: "$999",
    customer: {
      name: "Michael Brown",
      email: "michael.b@example.com",
      phone: "+880 1555-444333",
      address: "Sylhet, Bangladesh"
    },
    paymentMethod: "rocket",
    transactionId: "RKT555444333",
    notes: "Landing page design",
    createdAt: "2026-02-01T09:15:00Z"
  },
  {
    _id: "4",
    orderNumber: "ORD-123459",
    status: "completed",
    planName: "Professional Plan",
    planPrice: "$2,999",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+880 1777-888999",
      address: "Rajshahi, Bangladesh"
    },
    paymentMethod: "card",
    transactionId: "CARD777888999",
    notes: "Mobile app UI/UX design",
    createdAt: "2026-01-10T11:45:00Z"
  },
  {
    _id: "5",
    orderNumber: "ORD-123460",
    status: "cancelled",
    planName: "Basic Plan",
    planPrice: "$999",
    customer: {
      name: "David Wilson",
      email: "david.w@example.com",
      phone: "+880 1666-777888",
      address: "Khulna, Bangladesh"
    },
    paymentMethod: "bkash",
    transactionId: "BKH666777888",
    notes: "Project cancelled by client",
    createdAt: "2026-01-20T16:30:00Z"
  },
  {
    _id: "6",
    orderNumber: "ORD-123461",
    status: "completed",
    planName: "Enterprise Plan",
    planPrice: "$5,999",
    customer: {
      name: "Emily Davis",
      email: "emily.d@example.com",
      phone: "+880 1888-999000",
      address: "Dhaka, Bangladesh"
    },
    paymentMethod: "nagad",
    transactionId: "NGD888999000",
    notes: "Corporate website with CMS",
    createdAt: "2026-01-05T08:00:00Z"
  }
];

export default function TrackOrder() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(staticOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);

  // Optionally fetch user's real orders if logged in
  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setLoadingUserOrders(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
      
      const response = await fetch(`${API_BASE_URL}/orders/user`, {
        credentials: 'include',
      }, { cache: 'no-store' });

      if (!response.ok) {
        // If API fails, keep static orders
        setLoadingUserOrders(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        // Use real orders if available
        setOrders(data.data);
      }
      // Otherwise keep static orders
    } catch (err) {
      // Keep static orders on error
    } finally {
      setLoadingUserOrders(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'cancelled':
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Package className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'approved':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'cancelled':
      case 'rejected':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Your Orders
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            View and track all your orders
          </p>
        </div>

        {/* Selected Order Details */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  <span className="font-semibold capitalize">{selectedOrder.status}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Order Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Package className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Order Number</p>
                      <p className="font-semibold text-white">{selectedOrder.orderNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Order Date</p>
                      <p className="font-semibold text-white">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <CreditCard className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Plan & Price</p>
                      <p className="font-semibold text-white">{selectedOrder.planName} - {selectedOrder.planPrice}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <User className="w-5 h-5 text-green-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Customer Name</p>
                      <p className="font-semibold text-white">{selectedOrder.customer?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Mail className="w-5 h-5 text-yellow-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="font-semibold text-white">{selectedOrder.customer?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Phone className="w-5 h-5 text-pink-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="font-semibold text-white">{selectedOrder.customer?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              {selectedOrder.paymentMethod && (
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Payment Method</p>
                      <p className="text-white font-medium capitalize">{selectedOrder.paymentMethod}</p>
                    </div>
                    {selectedOrder.transactionId && (
                      <div>
                        <p className="text-gray-400">Transaction ID</p>
                        <p className="text-white font-medium">{selectedOrder.transactionId}</p>
                      </div>
                    )}
                  </div>
                  {selectedOrder.notes && (
                    <div className="mt-3">
                      <p className="text-gray-400">Notes</p>
                      <p className="text-white">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* User's Orders List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Orders</h2>
          
          {loadingUserOrders ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : orders.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-cyan-400/50 transition cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(order);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full border text-sm flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="font-semibold capitalize">{order.status}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-400">Order Number</p>
                      <p className="font-semibold text-white">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Plan</p>
                      <p className="font-semibold text-white">{order.planName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Price</p>
                      <p className="font-semibold text-cyan-400">{order.planPrice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="text-sm text-white">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No orders found</p>
              <p className="text-gray-500 text-sm mt-2">Your order history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
