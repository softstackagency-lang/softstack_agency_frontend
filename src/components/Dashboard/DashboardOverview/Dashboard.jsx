"use client";
import { useLayout } from "@/context/LayoutContext";
import React, { useEffect, useState } from "react";
import {
  Folder,
  Users,
  ClipboardList,
  DollarSign,
  Bell,
  Calendar,
  CheckCircle2,
  AlertCircle,
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
  Cell,
} from "recharts";

const chartData = [
  { name: "Jan", design: 20, dev: 15 },
  { name: "Feb", design: 25, dev: 22 },
  { name: "Mar", design: 18, dev: 28 },
  { name: "Apr", design: 30, dev: 24 },
  { name: "May", design: 25, dev: 35 },
  { name: "Jun", design: 35, dev: 30 },
];

const invoiceData = [
  { name: "Paid", value: 80, fill: "#3b82f6" },
  { name: "Pending", value: 45, fill: "#a855f7" },
  { name: "Overdue", value: 25, fill: "#f43f5e" },
];

export default function Dashboard() {
  const { setShowHeader, setShowFooter } = useLayout();
  const [isVisible, setIsVisible] = useState(false);

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

  const cardStyle =
    "bg-[#0a0f23]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500";

  return (
    <div className="relative min-h-screen p-6 overflow-hidden text-slate-200">
      <div
        className={`relative z-10 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={<Folder className="text-blue-400" />}
            title="Active Projects"
            value="14"
          />
          <StatCard
            icon={<Users className="text-purple-400" />}
            title="New Clients"
            value="4"
            sub="+2 today"
          />
          <StatCard
            icon={<ClipboardList className="text-orange-400" />}
            title="Pending Tasks"
            value="6"
          />
          <StatCard
            icon={<DollarSign className="text-green-400" />}
            title="Monthly Revenue"
            value="$27,500"
            sub="+18%"
            color="text-green-400"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Overview Chart - Fixed with Recharts */}
          <div className={`${cardStyle} lg:col-span-2 min-h-88`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-blue-100">Project Overview</h3>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Design
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div> Development
                </span>
              </div>
            </div>

            <div className="h-63 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorDesign" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #3b82f6",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ fontSize: "12px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="design"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorDesign)"
                  />
                  <Area
                    type="monotone"
                    dataKey="dev"
                    stroke="#a855f7"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorDev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Status - Circular Progress */}
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold mb-8 text-center">Task Status</h3>
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-blue-500/10"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * 35) / 100}
                  className="text-blue-500 stroke-round transition-all duration-1000 shadow-[0_0_15px_#3b82f6]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">35%</span>
                <span className="text-xs text-blue-300">In Progress</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <div className="text-blue-400 font-bold">35</div>
                <div className="text-[10px] opacity-60">In Progress</div>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <div className="text-green-400 font-bold">45</div>
                <div className="text-[10px] opacity-60">Completed</div>
              </div>
            </div>
          </div>

          {/* Recent Clients */}
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold mb-4">Recent Clients</h3>
            <div className="space-y-4">
              <ClientRow name="Acme Corp" status="New Project" color="from-blue-500 to-cyan-400" />
              <ClientRow name="Bright Media" status="Ongoing" color="from-purple-500 to-pink-500" />
              <ClientRow
                name="Global Solutions"
                status="Proposal"
                color="from-orange-500 to-yellow-500"
              />
            </div>
          </div>

          {/* Invoices Status Bar Chart with Recharts */}
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold mb-4 text-center">Invoices Status</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={invoiceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #3b82f6",
                      borderRadius: "8px",
                      padding: "6px 10px",
                    }}
                    labelStyle={{ color: "#94a3b8", fontSize: 11 }}
                    itemStyle={{ color: "#ffffff", fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={35}>
                    {invoiceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-4 mt-2">
              {invoiceData.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  <span className="text-[10px] text-slate-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className={cardStyle}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Live Updates</h3>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full animate-pulse">
                Live
              </span>
            </div>
            <div className="space-y-4">
              <NotificationItem
                icon={<AlertCircle className="text-red-400" size={16} />}
                text="Invoice #1245 is overdue!"
                time="20 min ago"
              />
              <NotificationItem
                icon={<CheckCircle2 className="text-green-400" size={16} />}
                text="Task 'Homepage' completed"
                time="1 hour ago"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function StatCard({ icon, title, value, sub, color = "text-white" }) {
  return (
    <div className="bg-[#0a0f23]/60 backdrop-blur-md border border-blue-500/20 p-5 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all group">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[10px] uppercase tracking-[2px] text-slate-400 font-medium">
          {title}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {sub && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 ${color}`}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

function ClientRow({ name, status, color }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full bg-linear-to-br ${color} flex items-center justify-center text-sm font-bold shadow-lg`}
        >
          {name[0]}
        </div>
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-[10px] text-blue-400/70">Partner</div>
        </div>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md border border-white/10">
        {status}
      </span>
    </div>
  );
}

function NotificationItem({ icon, text, time }) {
  return (
    <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-white/5 transition-colors">
      <div className="mt-1">{icon}</div>
      <div>
        <div className="text-xs font-medium text-slate-200">{text}</div>
        <div className="text-[9px] text-slate-500 mt-1">{time}</div>
      </div>
    </div>
  );
}
