"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Users, Package, ShoppingCart, Banknote, Clock, ArrowUpRight, Wallet } from "lucide-react";

const API_URL = "http://localhost:3001";

const DashboardGraph = dynamic(() => import("./DashboardGraph"), { ssr: false });

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
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      if (!token) {
        router.push("/Auth");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
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
    <div className="p-6 space-y-8 bg-[#f8fafc] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Admin Executive Dashboard
        </h2>
        <p className="text-slate-500 text-sm font-medium italic">
          Monitoring performa bisnis Smoethievibes secara real-time.
        </p>
      </div>

      {/* KPI CARDS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users className="w-6 h-6 text-blue-600" />} 
          color="bg-blue-50" 
          loading={loading}
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={<Package className="w-6 h-6 text-orange-600" />} 
          color="bg-orange-50" 
          loading={loading}
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={<ShoppingCart className="w-6 h-6 text-purple-600" />} 
          color="bg-purple-50" 
          loading={loading}
        />
        <StatCard 
          title="Total Revenue" 
          value={`Rp ${stats.totalRevenue.toLocaleString()}`} 
          icon={<Banknote className="w-6 h-6 text-emerald-600" />} 
          color="bg-emerald-50" 
          loading={loading}
        />
      </div>

      {/* MAIN CONTENT SECTION - REDESIGN GRID 70/30 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* REVENUE FOCUS (70% - lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group min-h-[400px]">
            {/* Dekorasi Latar Belakang */}
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-200">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-700 text-xl italic underline decoration-emerald-200 decoration-4 underline-offset-4">Revenue Focus</h3>
                </div>
                
                <div className="mt-8 flex flex-col md:flex-row md:items-end gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Accumulated Earnings</p>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
                       Rp {stats.totalRevenue.toLocaleString()}
                    </h1>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-sm mb-2">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Live Tracking</span>
                  </div>
                </div>
              </div>

              {/* Visual Bars yang Lebih Besar & Estetik */}
              <div className="mt-12 h-40 flex items-end gap-4 w-full px-4">
                {[45, 70, 55, 90, 65, 80, 100].map((height, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-emerald-500 rounded-t-2xl transition-all duration-500 ease-out hover:bg-emerald-400 group/bar relative"
                    style={{ height: `${height}%`, opacity: (i + 1) / 7 }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      Period {i+1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Aktivitas Terakhir ditaruh di bawah Revenue pada kolom 70% agar area kiri tidak kosong */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">System Log</h4>
                  <p className="text-sm text-slate-500">Update terakhir: Baru saja selesai sinkronisasi otomatis.</p>
                </div>
             </div>
             <button className="text-sm font-bold text-emerald-600 hover:underline">Lihat Semua</button>
          </div>
        </div>

        {/* PLATFORM GROWTH (30% - lg:col-span-3) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col">
          <div className="mb-8">
            <h3 className="font-bold text-slate-700 text-lg">Platform Growth</h3>
            <p className="text-xs text-slate-400">Distribusi User, Produk & Order</p>
          </div>
          
          <div className="flex-grow min-h-[300px] w-full">
             <DashboardGraph data={[
                { name: 'Users', value: stats.totalUsers },
                { name: 'Products', value: stats.totalProducts },
                { name: 'Orders', value: stats.totalOrders },
              ]} />
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-2xl space-y-3">
             <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Data Integrity</span>
                <span className="text-emerald-600 font-bold text-xs uppercase">Verified</span>
             </div>
             <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%] rounded-full"></div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Tipe Data Props
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}

// Sub-komponen Card KPI
function StatCard({ title, value, icon, color, loading }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-between group">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
        <p className="text-2xl font-black text-slate-900">
          {loading ? (
            <span className="inline-block w-16 h-7 bg-slate-100 animate-pulse rounded-md"></span>
          ) : (
            value
          )}
        </p>
      </div>
      <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${color}`}>
        {icon}
      </div>
    </div>
  );
}