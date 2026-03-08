"use client";

import React, { useState, useEffect } from "react";
import { orderApi } from "@/lib/api";
import {
  Loader2, Package, DollarSign, Clock, CheckCircle,
  Eye, RefreshCw, Search, X, Trash2,
} from "lucide-react";

export default function OrdersComponent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, orderId: null });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getAllOrders();
      setOrders(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await orderApi.getOrderStats();
      setStats(response.data || null);
    } catch (err) {}
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      await fetchStats();
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  const handlePaymentUpdate = async (orderId, newPaymentStatus) => {
    try {
      await orderApi.updatePaymentStatus(orderId, newPaymentStatus);
      await fetchOrders();
      await fetchStats();
    } catch (err) {
      alert("Failed to update payment status");
    }
  };

  const handleDeleteOrder = async () => {
    try {
      setLoading(true);
      await orderApi.deleteOrder(deleteModal.orderId);
      setDeleteModal({ isOpen: false, orderId: null });
      await fetchOrders();
      await fetchStats();
    } catch (err) {
      alert("Failed to delete order");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.orderStatus === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.phone?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":      return "bg-yellow-500/20 text-yellow-400";
      case "processing":   return "bg-blue-500/20 text-blue-400";
      case "completed":    return "bg-green-500/20 text-green-400";
      case "cancelled":    return "bg-red-500/20 text-red-400";
      case "on-hold":      return "bg-orange-500/20 text-orange-400";
      default:             return "bg-gray-500/20 text-gray-400";
    }
  };

  const paymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":      return "bg-green-500/20 text-green-400";
      case "pending":   return "bg-yellow-500/20 text-yellow-400";
      case "failed":    return "bg-red-500/20 text-red-400";
      case "refunded":  return "bg-purple-500/20 text-purple-400";
      default:          return "bg-gray-500/20 text-gray-400";
    }
  };

  const currencySymbol = (order) =>
    order.pricing?.currency === "USD" ? "$" : "৳";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">

      {/* ── Page Title ── */}
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Orders Management</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
            Manage all customer orders and payments
          </p>
        </div>
        <button
          onClick={() => { fetchOrders(); fetchStats(); }}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition text-sm"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          {
            label: "Total Orders",
            value: stats?.totalOrders || orders.length,
            icon: <Package className="text-cyan-400" size={20} />,
            border: "border-blue-500/20",
          },
          {
            label: "Completed",
            value: stats?.completedOrders || orders.filter((o) => o.orderStatus === "completed").length,
            icon: <CheckCircle className="text-green-400" size={20} />,
            border: "border-green-500/20",
          },
          {
            label: "Pending",
            value: stats?.pendingOrders || orders.filter((o) => o.orderStatus === "pending").length,
            icon: <Clock className="text-yellow-400" size={20} />,
            border: "border-yellow-500/20",
          },
          {
            label: "Total Revenue",
            value: `$${stats?.totalRevenue?.toLocaleString() || "0"}`,
            icon: <DollarSign className="text-purple-400" size={20} />,
            border: "border-purple-500/20",
          },
          {
            label: "Avg Order",
            value: `$${stats?.averageOrderValue?.toFixed(2) || "0"}`,
            icon: <DollarSign className="text-blue-400" size={20} />,
            border: "border-blue-500/20",
            // span full width on 2-col grid so it's centred on the last row
            extra: "col-span-2 sm:col-span-1",
          },
        ].map(({ label, value, icon, border, extra = "" }) => (
          <div
            key={label}
            className={`rounded-xl bg-[#0a0f23]/60 backdrop-blur-md border ${border} p-3 sm:p-4 ${extra}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">{label}</p>
                <h2 className="text-lg sm:text-xl font-semibold text-white mt-0.5">{value}</h2>
              </div>
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ── */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search order, name, email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0a0f23]/60 border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 text-sm"
          />
        </div>

        {/* Status filter — scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {["all", "pending", "processing", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition capitalize whitespace-nowrap flex-shrink-0 ${
                filterStatus === status
                  ? "bg-cyan-500 text-white"
                  : "bg-[#0a0f23]/60 text-gray-400 hover:text-white border border-blue-500/20"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty state ── */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 sm:py-12 bg-[#0a0f23]/60 rounded-xl border border-blue-500/20">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-400 text-sm sm:text-base">No orders found</p>
        </div>
      ) : (
        <>
          {/* ── DESKTOP TABLE (lg+) ── */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-blue-500/20">
            <table className="w-full text-sm">
              <thead className="bg-[#0a0f23]/80 border-b border-blue-500/20">
                <tr>
                  {["Order #", "Customer", "Items", "Amount", "Receiver Number", "Payment Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-gray-400 font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-[#0a0f23]/40">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-blue-500/10 hover:bg-[#0a0f23]/60 transition">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{order.customer?.name}</div>
                      <div className="text-gray-400 text-xs">{order.customer?.email}</div>
                      <div className="text-gray-500 text-xs">{order.customer?.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500"> x{item.quantity}</span>
                          <div className="text-gray-600">${item.unitPrice}</div>
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white font-bold whitespace-nowrap">
                        {currencySymbol(order)}{order.pricing?.grandTotal?.toLocaleString() || "0"}
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        Subtotal: {currencySymbol(order)}{order.pricing?.subtotal}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{order.payment?.receiverNumber || "N/A"}</div>
                      <div className="text-xs text-gray-500 capitalize mt-1">{order.payment?.method || "N/A"}</div>
                      {order.payment?.transactionId && (
                        <div className="text-xs text-cyan-400 mt-1">TXN: {order.payment.transactionId}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.payment?.status || "pending"}
                        onChange={(e) => handlePaymentUpdate(order._id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium ${paymentStatusColor(order.payment?.status)} border-none cursor-pointer`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                      <div className="text-gray-600">{new Date(order.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded transition" title="View Details">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => setDeleteModal({ isOpen: true, orderId: order._id })} className="p-2 text-red-400 hover:bg-red-400/10 rounded transition" title="Delete Order">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE / TABLET CARDS (below lg) ── */}
          <div className="lg:hidden space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-[#0a0f23]/60 border border-blue-500/20 rounded-xl p-4 space-y-3"
              >
                {/* Row 1: order number + date + actions */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-white font-semibold text-sm">{order.orderNumber}</span>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()}{" "}
                      <span className="text-gray-600">{new Date(order.createdAt).toLocaleTimeString()}</span>
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 text-cyan-400 hover:bg-cyan-400/10 rounded transition"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, orderId: order._id })}
                      className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Row 2: customer */}
                <div className="bg-white/5 rounded-lg px-3 py-2">
                  <p className="text-white font-medium text-sm">{order.customer?.name}</p>
                  <p className="text-gray-400 text-xs truncate">{order.customer?.email}</p>
                  {order.customer?.phone && (
                    <p className="text-gray-500 text-xs">{order.customer.phone}</p>
                  )}
                </div>

                {/* Row 3: items */}
                {order.items?.length > 0 && (
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-gray-300 font-medium truncate mr-2">{item.name} <span className="text-gray-500">×{item.quantity}</span></span>
                        <span className="text-gray-400 flex-shrink-0">${item.unitPrice}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Row 4: amount + payment status + receiver */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
                  {/* Grand total */}
                  <span className="text-white font-bold text-sm">
                    {currencySymbol(order)}{order.pricing?.grandTotal?.toLocaleString() || "0"}
                  </span>

                  {/* Payment status dropdown */}
                  <select
                    value={order.payment?.status || "pending"}
                    onChange={(e) => handlePaymentUpdate(order._id, e.target.value)}
                    className={`px-2 py-0.5 rounded text-xs font-medium ${paymentStatusColor(order.payment?.status)} border-none cursor-pointer`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>

                  {/* Payment method */}
                  {order.payment?.method && (
                    <span className="text-gray-500 text-xs capitalize">{order.payment.method}</span>
                  )}

                  {/* Receiver */}
                  {order.payment?.receiverNumber && (
                    <span className="text-gray-400 text-xs ml-auto">{order.payment.receiverNumber}</span>
                  )}
                </div>

                {/* TXN id if present */}
                {order.payment?.transactionId && (
                  <p className="text-cyan-400 text-xs">TXN: {order.payment.transactionId}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Delete Modal ── */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Confirm Delete</h3>
            <p className="text-gray-400 mb-5 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, orderId: null })}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Details Modal ── */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="relative w-full max-w-lg sm:max-w-2xl md:max-w-3xl max-h-[92vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-white/10 shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6 pr-8">Order Details</h2>

            <div className="space-y-4 sm:space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Order Number</p>
                  <p className="text-white font-semibold text-sm sm:text-lg">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Order Status</p>
                  <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium ${statusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Name</p>
                    <p className="text-white font-medium text-sm sm:text-base">{selectedOrder.customer?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Email</p>
                    <p className="text-white text-sm sm:text-base break-all">{selectedOrder.customer?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Phone</p>
                    <p className="text-white text-sm sm:text-base">{selectedOrder.customer?.phone}</p>
                  </div>
                  <div className="sm:col-span-1">
                    <p className="text-gray-400 text-xs sm:text-sm">Address</p>
                    <p className="text-white text-sm sm:text-base">{selectedOrder.customer?.address || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-3 p-2.5 sm:p-3 bg-white/5 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm sm:text-base">{item.name}</p>
                        {item.description && (
                          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{item.description}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          Unit Price: ${item.unitPrice} × Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-cyan-400 font-bold text-base sm:text-lg">${item.totalPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Pricing Summary</h3>
                <div className="space-y-2 p-3 sm:p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                    <span>Subtotal:</span>
                    <span>{currencySymbol(selectedOrder)}{selectedOrder.pricing?.subtotal}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold text-base sm:text-lg">
                    <span>Grand Total:</span>
                    <span className="text-cyan-400">
                      {currencySymbol(selectedOrder)}{selectedOrder.pricing?.grandTotal}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    Currency: {selectedOrder.pricing?.currency}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Payment Method</p>
                    <p className="text-white capitalize font-medium text-sm sm:text-base">
                      {selectedOrder.payment?.method || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Payment Status</p>
                    <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium ${paymentStatusColor(selectedOrder.payment?.status)}`}>
                      {selectedOrder.payment?.status}
                    </span>
                  </div>
                  {selectedOrder.payment?.transactionId && (
                    <div className="col-span-2">
                      <p className="text-gray-400 text-xs sm:text-sm">Transaction ID</p>
                      <p className="text-cyan-400 font-mono text-xs sm:text-sm break-all">
                        {selectedOrder.payment.transactionId}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Order Notes</h3>
                  <p className="text-gray-300 p-3 bg-white/5 rounded-lg text-sm sm:text-base">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t border-white/10 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Created At</p>
                    <p className="text-white text-xs sm:text-sm">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedOrder.updatedAt && (
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm">Last Updated</p>
                      <p className="text-white text-xs sm:text-sm">{new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cancellation Info */}
              {selectedOrder.cancellation?.isCancelled && (
                <div className="border-t border-white/10 pt-4">
                  <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h3 className="text-red-400 font-semibold mb-2 text-sm sm:text-base">⚠️ Order Cancelled</h3>
                    {selectedOrder.cancellation.reason && (
                      <p className="text-gray-300 text-xs sm:text-sm">Reason: {selectedOrder.cancellation.reason}</p>
                    )}
                    {selectedOrder.cancellation.cancelledAt && (
                      <p className="text-gray-400 text-xs mt-1">
                        Cancelled on: {new Date(selectedOrder.cancellation.cancelledAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}