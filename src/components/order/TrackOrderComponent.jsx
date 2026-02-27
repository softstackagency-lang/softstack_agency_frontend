"use client";

import React, { useState, useEffect } from "react";
import { orderApi } from "@/lib/api";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { Loader2, Package, CheckCircle, Clock, AlertCircle, Mail, Phone, DollarSign, CreditCard, Calendar } from "lucide-react";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";

export default function TrackOrderComponent() {
  // Restart animations when component mounts
  useRestartAnimations();

  const { user, loading: authLoading } = useCustomAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderApi.trackOrderByEmail(user.email);
        setOrders(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to track orders");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user?.email) {
      fetchOrders();
    } else if (!authLoading && !user) {
      setError("Please sign in to track your orders");
      setLoading(false);
    }
  }, [user, authLoading]);

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "refunded":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "failed":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden p-6">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative max-w-md w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center backdrop-blur-sm">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/40 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/35 rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float-reverse"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-[50px]">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse pt-[10px]"></div>
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">Order Tracking</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 pt-[10px]">
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Track Your Orders</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {user?.email && (
              <span className="flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                {user.email}
              </span>
            )}
          </p>
         
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/30">
            <Package className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Found</h2>
            <p className="text-gray-400">You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-blue-500/20">
            <table className="w-full text-sm">
              <thead className="bg-[#0a0f23]/80 border-b border-blue-500/20">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Order #</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Customer</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Amount</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Payment Method</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Payment Status</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Order Date</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Paid At</th>
                </tr>
              </thead>
              <tbody className="bg-[#0a0f23]/40">
                {orders.map((order) => (
                  <tr key={order.orderId} className="border-b border-blue-500/10 hover:bg-[#0a0f23]/60 transition">
                    <td className="px-4 py-3 text-white font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{order.name}</div>
                      <div className="text-gray-400 text-xs">{order.email}</div>
                      <div className="text-gray-500 text-xs">{order.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white font-bold">
                        {order.currency === "USD" ? "$" : "৳"}
                        {order.amount?.toLocaleString() || "0"}
                      </div>
                      <div className="text-xs text-gray-500">{order.currency}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-medium capitalize">{order.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(order.orderDate).toLocaleDateString()}
                      <div className="text-gray-600 text-xs">
                        {new Date(order.orderDate).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {order.paidAt ? (
                        <>
                          {new Date(order.paidAt).toLocaleDateString()}
                          <div className="text-green-400 text-xs">
                            {new Date(order.paidAt).toLocaleTimeString()}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-600">Not paid yet</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
