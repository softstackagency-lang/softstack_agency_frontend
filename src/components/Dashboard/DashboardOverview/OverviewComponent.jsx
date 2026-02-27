"use client";
import React, { useEffect, useState } from "react";
import {
  Folder,
  Users,
  ClipboardList,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Package,
  Activity,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { dashboardApi } from "@/lib/api";

export default function OverviewComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 0);

    fetchDashboardData();

    return () => clearTimeout(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getDashboardStats();
      if (response.success) {
        setDashboardData(response);
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle =
    "bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500";

  // Prepare chart data
  const revenueData = dashboardData?.revenueOverview ? 
    dashboardData.revenueOverview.months.map((month, index) => ({
      name: month,
      revenue: dashboardData.revenueOverview.values[index]
    })) : [];

  const ordersData = dashboardData?.ordersOverview ?
    dashboardData.ordersOverview.months.map((month, index) => ({
      name: month,
      orders: dashboardData.ordersOverview.orders[index]
    })) : [];

  const productDistribution = dashboardData?.productDistribution ?
    dashboardData.productDistribution.map((item, index) => ({
      name: item.category,
      value: item.percentage,
      fill: index === 0 ? "#3b82f6" : index === 1 ? "#8b5cf6" : "#10b981"
    })) : [];

  return (
    <div className="relative min-h-screen p-6 overflow-auto text-slate-200">
      <div
        className={`relative z-10 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back! Heres whats happening with your business today.</p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<DollarSign className="text-green-400" size={24} />}
            title="Total Revenue"
            value={`$${dashboardData?.stats?.totalRevenue?.toLocaleString() || 0}`}
            change={dashboardData?.stats?.growth || "+0%"}
            changeType="positive"
            bgGradient="from-green-500/20 to-emerald-500/10"
          />
          <StatCard
            icon={<ShoppingCart className="text-blue-400" size={24} />}
            title="Total Orders"
            value={dashboardData?.stats?.totalOrders?.toString() || "0"}
            change={dashboardData?.paidOrders ? `${dashboardData.paidOrders.count} paid` : "0 paid"}
            changeType="positive"
            bgGradient="from-blue-500/20 to-cyan-500/10"
          />
          <StatCard
            icon={<Users className="text-purple-400" size={24} />}
            title="Total Users"
            value={dashboardData?.stats?.totalUsers?.toLocaleString() || "0"}
            change="+8.3%"
            changeType="positive"
            bgGradient="from-purple-500/20 to-pink-500/10"
          />
          <StatCard
            icon={<Package className="text-orange-400" size={24} />}
            title="Active Products"
            value={dashboardData?.stats?.activeProducts?.toString() || "0"}
            change="+4.2%"
            changeType="positive"
            bgGradient="from-orange-500/20 to-yellow-500/10"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className={`${cardStyle} lg:col-span-2`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Revenue Overview</h3>
                <p className="text-sm text-gray-400">Monthly revenue trends</p>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp size={20} />
                <span className="text-sm font-semibold">+12.5%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0f23",
                    border: "1px solid #3b82f6",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Product Distribution */}
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold text-white mb-1">Product Distribution</h3>
            <p className="text-sm text-gray-400 mb-6">By category</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={productDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    const percentage = (percent * 100).toFixed(0);
                    return percentage > 0 ? `${percentage}%` : '';
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0f23",
                    border: "1px solid #3b82f6",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {productDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0`} style={{ backgroundColor: item.fill }}></div>
                    <span className="text-gray-300 truncate">{item.name}</span>
                  </div>
                  <span className="text-gray-400 ml-2 flex-shrink-0">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="grid grid-cols-1 gap-6">
          <div className={cardStyle}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Orders Overview</h3>
                <p className="text-sm text-gray-400">Monthly order trends</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0f23",
                    border: "1px solid #3b82f6",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ icon, title, value, change, changeType, bgGradient }) {
  return (
    <div
      className={`bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500 relative overflow-hidden`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-10`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/5 rounded-xl backdrop-blur-sm">{icon}</div>
          {change && (
            <span
              className={`text-sm font-semibold flex items-center gap-1 ${
                changeType === "positive" ? "text-green-400" : "text-red-400"
              }`}
            >
              <TrendingUp size={16} />
              {change}
            </span>
          )}
        </div>
        <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}

// QuickStatCard Component
function QuickStatCard({ title, value, icon }) {
  return (
    <div className="bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-2 bg-white/5 rounded-lg backdrop-blur-sm">{icon}</div>
      </div>
    </div>
  );
}
