"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

const API_URL = "http://localhost:3001";

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
  role: string;
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
  const { isAuthenticated, user, authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('products');
  
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary[]>([]);

  useEffect(() => {
    // Don't fetch analytics if user is not authenticated or not admin
    if (authLoading) return;
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push("/Auth?redirect=/admin/analytics");
      return;
    }

    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/Auth");
        return;
      }

      try {
        // Fetch popular products
        const productsResponse = await fetch(`${API_URL}/analytics/popular-products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setPopularProducts(productsData);
        } else if (productsResponse.status === 401) {
          // Token invalid, redirect to login
          router.push("/Auth?redirect=/admin/analytics");
          return;
        }

        // Fetch customer analytics
        const customersResponse = await fetch(`${API_URL}/analytics/customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          setCustomers(customersData);
        } else if (customersResponse.status === 401) {
          router.push("/Auth?redirect=/admin/analytics");
          return;
        }

        // Fetch inventory alerts
        const inventoryResponse = await fetch(`${API_URL}/analytics/inventory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (inventoryResponse.ok) {
          const inventoryData = await inventoryResponse.json();
          setInventoryAlerts(inventoryData);
        } else if (inventoryResponse.status === 401) {
          router.push("/Auth?redirect=/admin/analytics");
          return;
        }

        // Fetch daily summary
        const dailyResponse = await fetch(`${API_URL}/analytics/daily-summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (dailyResponse.ok) {
          const dailyData = await dailyResponse.json();
          setDailySummary(dailyData);
        } else if (dailyResponse.status === 401) {
          router.push("/Auth?redirect=/admin/analytics");
          return;
        }

      } catch (error) {
        console.error("Error fetching analytics:", error);
        if (error instanceof Error && error.message.includes('401')) {
          router.push("/Auth?redirect=/admin/analytics");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [router, isAuthenticated, user, authLoading]);

  const handleExportExcel = async (type: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/analytics/export-excel?type=${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${type}-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Gagal mengunduh file Excel');
      }
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Terjadi kesalahan saat mengunduh file');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OUT_OF_STOCK':
        return 'text-red-600 bg-red-100';
      case 'LOW_STOCK':
        return 'text-orange-600 bg-orange-100';
      case 'MEDIUM_STOCK':
        return 'text-yellow-600 bg-yellow-100';
      case 'GOOD_STOCK':
        return 'text-green-600 bg-green-100';
      case 'ACTIVE':
        return 'text-green-600 bg-green-100';
      case 'REGULAR':
        return 'text-blue-600 bg-blue-100';
      case 'INACTIVE':
        return 'text-gray-600 bg-gray-100';
      case 'NEW':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Analytics Dashboard
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleExportExcel('popular-products')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Export Products
          </button>
          <button
            onClick={() => handleExportExcel('customers')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export Customers
          </button>
          <button
            onClick={() => handleExportExcel('inventory')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Export Inventory
          </button>
          <button
            onClick={() => handleExportExcel('daily-summary')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Export Daily Summary
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {([
            { key: 'products' as TabType, label: 'Popular Products' },
            { key: 'customers' as TabType, label: 'Customer Analytics' },
            { key: 'inventory' as TabType, label: 'Inventory Alerts' },
            { key: 'daily' as TabType, label: 'Daily Summary' },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'products' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Popular Products</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {popularProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.totalSold}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {product.totalRevenue.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {product.averagePrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Analytics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.customerStatus)}`}>
                          {customer.customerStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.totalOrders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {customer.totalSpent.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {customer.avgOrderValue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Inventory Alerts</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold (30d)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventoryAlerts.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.categoryName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.stockStatus)}`}>
                          {item.stockStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalSoldLast30Days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'daily' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Summary (Last 30 Days)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Order Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Customers</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dailySummary.map((item) => (
                    <tr key={item.date}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalOrders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {item.totalRevenue.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {item.averageOrderValue.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.uniqueCustomers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}