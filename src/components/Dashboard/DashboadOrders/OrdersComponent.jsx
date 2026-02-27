"use client";

import React, { useState, useEffect } from "react";
import { orderApi } from "@/lib/api";
import { Loader2, Package, DollarSign, Clock, CheckCircle, Eye, RefreshCw, Search, X, Trash2, Edit } from "lucide-react";

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
    } catch (err) {
    }
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

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" || order.orderStatus === filterStatus;
    const matchesSearch = searchTerm === "" || 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.phone?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "processing":
        return "bg-blue-500/20 text-blue-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      case "on-hold":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const paymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      case "refunded":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders Management</h1>
          <p className="text-gray-400 text-sm">
            Manage all customer orders and payments
          </p>
        </div>
        <button
          onClick={() => { fetchOrders(); fetchStats(); }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl bg-[#0a0f23]/60 backdrop-blur-md border border-blue-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <h2 className="text-xl font-semibold text-white mt-1">
                {stats?.totalOrders || orders.length}
              </h2>
            </div>
            <Package className="text-cyan-400" size={24} />
          </div>
        </div>

        <div className="rounded-xl bg-[#0a0f23]/60 backdrop-blur-md border border-green-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <h2 className="text-xl font-semibold text-white mt-1">
                {stats?.completedOrders || orders.filter(o => o.orderStatus === 'completed').length}
              </h2>
            </div>
            <CheckCircle className="text-green-400" size={24} />
          </div>
        </div>

        <div className="rounded-xl bg-[#0a0f23]/60 backdrop-blur-md border border-yellow-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <h2 className="text-xl font-semibold text-white mt-1">
                {stats?.pendingOrders || orders.filter(o => o.orderStatus === 'pending').length}
              </h2>
            </div>
            <Clock className="text-yellow-400" size={24} />
          </div>
        </div>

        <div className="rounded-xl bg-[#0a0f23]/60 backdrop-blur-md border border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <h2 className="text-xl font-semibold text-white mt-1">
                ${stats?.totalRevenue?.toLocaleString() || "0"}
              </h2>
            </div>
            <DollarSign className="text-purple-400" size={24} />
          </div>
        </div>

        <div className="rounded-xl bg-[#0a0f23]/60 backdrop-blur-md border border-blue-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Order Value</p>
              <h2 className="text-xl font-semibold text-white mt-1">
                ${stats?.averageOrderValue?.toFixed(2) || "0"}
              </h2>
            </div>
            <DollarSign className="text-blue-400" size={24} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by order number, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0a0f23]/60 border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
        
        <div className="flex gap-2">
          {["all", "pending", "processing", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
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

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-[#0a0f23]/60 rounded-xl border border-blue-500/20">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No orders found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-blue-500/20">
          <table className="w-full text-sm">
            <thead className="bg-[#0a0f23]/80 border-b border-blue-500/20">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Order #</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Customer</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Items</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Amount</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Receiver Number</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Payment Status</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Date</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#0a0f23]/40">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b border-blue-500/10 hover:bg-[#0a0f23]/60 transition">
                  <td className="px-4 py-3 text-white font-medium">{order.orderNumber}</td>
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
                    <div className="text-white font-bold">
                      {order.pricing?.currency === "USD" ? "$" : "৳"}
                      {order.pricing?.grandTotal?.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Subtotal: {order.pricing?.currency === "USD" ? "$" : "৳"}
                      {order.pricing?.subtotal}
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
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                    <div className="text-gray-600 text-xs">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded transition"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, orderId: order._id })}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded transition"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-white/10 shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, orderId: null })}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-white/10 shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Order Details</h2>
            
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-gray-400 text-sm">Order Number</p>
                  <p className="text-white font-semibold text-lg">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Order Status</p>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${statusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="text-white font-medium">{selectedOrder.customer?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{selectedOrder.customer?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">{selectedOrder.customer?.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white">{selectedOrder.customer?.address || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          Unit Price: ${item.unitPrice} × Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-400 font-bold text-lg">${item.totalPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Pricing Summary</h3>
                <div className="space-y-2 p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>{selectedOrder.pricing?.currency === "USD" ? "$" : "৳"}{selectedOrder.pricing?.subtotal}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold text-lg">
                    <span>Grand Total:</span>
                    <span className="text-cyan-400">
                      {selectedOrder.pricing?.currency === "USD" ? "$" : "৳"}{selectedOrder.pricing?.grandTotal}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    Currency: {selectedOrder.pricing?.currency}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-gray-400 text-sm">Payment Method</p>
                    <p className="text-white capitalize font-medium">{selectedOrder.payment?.method || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payment Status</p>
                    <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${paymentStatusColor(selectedOrder.payment?.status)}`}>
                      {selectedOrder.payment?.status}
                    </span>
                  </div>
                  {selectedOrder.payment?.transactionId && (
                    <div className="col-span-2">
                      <p className="text-gray-400 text-sm">Transaction ID</p>
                      <p className="text-cyan-400 font-mono">{selectedOrder.payment.transactionId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Order Notes</h3>
                  <p className="text-gray-300 p-3 bg-white/5 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t border-white/10 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Created At</p>
                    <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedOrder.updatedAt && (
                    <div>
                      <p className="text-gray-400">Last Updated</p>
                      <p className="text-white">{new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cancellation Info */}
              {selectedOrder.cancellation?.isCancelled && (
                <div className="border-t border-white/10 pt-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h3 className="text-red-400 font-semibold mb-2">⚠️ Order Cancelled</h3>
                    {selectedOrder.cancellation.reason && (
                      <p className="text-gray-300 text-sm">Reason: {selectedOrder.cancellation.reason}</p>
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
