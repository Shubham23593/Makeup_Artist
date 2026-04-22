"use client";
import React, { useEffect, useState } from "react";
import { Users, CalendarCheck, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    monthlyRevenue: 0,
    popularService: "N/A"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats conceptually from API
    async function fetchStats() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (data.success) {
          const bookings = data.bookings;
          const pending = bookings.filter(b => b.status === "Pending").length;
          
          // Count services for popularity
          const serviceCounts = {};
          bookings.forEach(b => {
             serviceCounts[b.service] = (serviceCounts[b.service] || 0) + 1;
          });
          const popular = Object.keys(serviceCounts).sort((a,b) => serviceCounts[b] - serviceCounts[a])[0] || "N/A";

          setStats({
            totalBookings: bookings.length,
            pendingBookings: pending,
            monthlyRevenue: bookings.length * 150, // Conceptual pricing
            popularService: popular
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading Analytics...</div>;

  const statCards = [
    { label: "Total Bookings", value: stats.totalBookings, icon: Users, color: "text-blue-500" },
    { label: "Pending Approvals", value: stats.pendingBookings, icon: AlertCircle, color: "text-amber-500" },
    { label: "Est. Revenue", value: `$${stats.monthlyRevenue}`, icon: TrendingUp, color: "text-green-500" },
    { label: "Top Service", value: stats.popularService, icon: CalendarCheck, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-[#2A2522]">Analytics Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back to the Deepali Makeup Artist control center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-6">
            <div className={`p-4 bg-gray-50 rounded-full ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-medium mb-1">{stat.label}</p>
              <h2 className="text-3xl font-serif font-semibold">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Chart container dummy placeholder */}
      <div className="bg-white p-6 shadow-sm border border-gray-100 mt-8 h-96 flex items-center justify-center">
        <p className="text-gray-400 font-serif text-xl italic">Growth Chart & Interactive Graphs Coming Soon</p>
      </div>
    </div>
  );
}
