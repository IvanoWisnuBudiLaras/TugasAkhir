"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3001";
import DashboardGraph from "./DashboardGraph";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/Auth");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error("Failed to fetch stats");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight">
        Dashboard Overview
      </h2>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-semibold mt-1">
            {loading ? "..." : stats.totalUsers}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-semibold mt-1">
            {loading ? "..." : stats.totalProducts}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-semibold mt-1">
            {loading ? "..." : stats.totalOrders}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-semibold mt-1">
            {loading ? "..." : `Rp ${stats.totalRevenue.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* CONTENT ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6 shadow-sm h-64">
          <h3 className="font-semibold mb-2">Recent Orders</h3>
          <p className="text-sm text-gray-500">Coming soon...</p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm h-64">
          <DashboardGraph data={[
            { name: 'Users', value: stats.totalUsers },
            { name: 'Products', value: stats.totalProducts },
            { name: 'Orders', value: stats.totalOrders },
            { name: 'Revenue', value: stats.totalRevenue },
          ]} />
        </div>
      </div>
    </div>
  );
}
