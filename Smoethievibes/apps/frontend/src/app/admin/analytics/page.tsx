"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// --- Interfaces ---
interface PopularProduct {
  id: string;
  name: string;
  totalSold: number;
  totalRevenue: number;
  averagePrice: number;
}

interface Customer {
  id: string;
  email: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  customerStatus: string;
}

interface InventoryAlert {
  id: string;
  name: string;
  stock: number;
  categoryName: string;
  stockStatus: string;
  totalSoldLast30Days: number;
}

interface DailySummary {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  uniqueCustomers: number;
}

type TabType = 'products' | 'customers' | 'inventory' | 'daily';

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('products');
  
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary[]>([]);

  const fetchAnalytics = useCallback(async () => {
    const headers = authAPI.getAuthHeaders();
    if (!headers.Authorization) {
      router.push("/Auth");
      return;
    }

    setLoading(true);
    try {
      // Menggunakan Promise.allSettled agar jika salah satu endpoint mati, yang lain tetap jalan
      const results = await Promise.allSettled([
        fetch(`${API_URL}/analytics/popular-products`, { headers }).then(res => res.json()),
        fetch(`${API_URL}/analytics/customers`, { headers }).then(res => res.json()),
        fetch(`${API_URL}/analytics/inventory-alerts`, { headers }).then(res => res.json()),
        fetch(`${API_URL}/analytics/daily-summary`, { headers }).then(res => res.json())
      ]);

      if (results[0].status === 'fulfilled') setPopularProducts(Array.isArray(results[0].value) ? results[0].value : []);
      if (results[1].status === 'fulfilled') setCustomers(Array.isArray(results[1].value) ? results[1].value : []);
      if (results[2].status === 'fulfilled') setInventoryAlerts(Array.isArray(results[2].value) ? results[2].value : []);
      if (results[3].status === 'fulfilled') setDailySummary(Array.isArray(results[3].value) ? results[3].value : []);

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportExcel = async (type: string) => {
    const headers = authAPI.getAuthHeaders();
    if (!headers.Authorization) return;

    try {
      const response = await fetch(`${API_URL}/analytics/export-excel?type=${type}`, { headers });
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.body.appendChild(document.createElement('a'));
      a.href = url;
      a.download = `report-${type}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Gagal mengekspor data: ' + error);
    }
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      OUT_OF_STOCK: 'text-red-700 bg-red-100',
      LOW_STOCK: 'text-orange-700 bg-orange-100',
      GOOD_STOCK: 'text-green-700 bg-green-100',
      ACTIVE: 'text-green-700 bg-green-100',
      REGULAR: 'text-blue-700 bg-blue-100',
      NEW: 'text-purple-700 bg-purple-100',
    };
    return map[status] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 animate-pulse">Menghitung data analitik...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
          <p className="text-gray-500">Pantau performa bisnis dan stok inventaris Anda.</p>
        </div>
        <div className="grid grid-cols-2 lg:flex gap-2 w-full md:w-auto">
          <button onClick={() => handleExportExcel('popular-products')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Export Products</button>
          <button onClick={() => handleExportExcel('customers')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Export Customers</button>
          <button onClick={() => handleExportExcel('inventory')} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">Export Inventory</button>
          <button onClick={() => handleExportExcel('daily-summary')} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">Export Daily</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto no-scrollbar space-x-8">
          {[
            { key: 'products', label: 'Produk Terlaris' },
            { key: 'customers', label: 'Analitik Pelanggan' },
            { key: 'inventory', label: 'Alert Inventaris' },
            { key: 'daily', label: 'Ringkasan Harian' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`pb-4 px-1 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {activeTab === 'products' && (
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Total Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Avg Price</th>
                </tr>
              )}
              {activeTab === 'customers' && (
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Total Spent</th>
                </tr>
              )}
              {activeTab === 'inventory' && (
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">30d Sales</th>
                </tr>
              )}
              {activeTab === 'daily' && (
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Unique Cust</th>
                </tr>
              )}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTab === 'products' && popularProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.totalSold} pcs</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold">Rp {p.totalRevenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Rp {p.averagePrice.toLocaleString()}</td>
                </tr>
              ))}
              
              {activeTab === 'customers' && customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${getStatusColor(c.customerStatus)}`}>
                      {c.customerStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.totalOrders}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold">Rp {c.totalSpent.toLocaleString()}</td>
                </tr>
              ))}

              {activeTab === 'inventory' && inventoryAlerts.map((i) => (
                <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{i.name}</div>
                    <div className="text-xs text-gray-400">{i.categoryName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">{i.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${getStatusColor(i.stockStatus)}`}>
                      {i.stockStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{i.totalSoldLast30Days}</td>
                </tr>
              ))}

              {activeTab === 'daily' && dailySummary.map((d) => (
                <tr key={d.date} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{new Date(d.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{d.totalOrders}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-bold">Rp {d.totalRevenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{d.uniqueCustomers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {(activeTab === 'products' ? popularProducts : activeTab === 'customers' ? customers : activeTab === 'inventory' ? inventoryAlerts : dailySummary).length === 0 && (
          <div className="p-12 text-center text-gray-400 italic">
            Tidak ada data tersedia untuk periode ini.
          </div>
        )}
      </div>
    </div>
  );
}