"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Trash2 } from "lucide-react";

const API_URL = "http://localhost:3001";

const ORDER_STATUSES = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
];

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user?: { name: string; email: string; };
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    if (!token) return router.push("/Auth");

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // FUNGSI BARU: Hapus Pesanan
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) return;
    
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setOrders(orders.filter(o => o.id !== orderId));
      }
    } catch (error) {
      alert("Gagal menghapus pesanan");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "DELIVERED": return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      case "PROCESSING": return "bg-orange-100 text-orange-700 border-orange-200";
      case "SHIPPED": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Pesanan</h1>
            <p className="text-gray-500">Total: {orders.length} pesanan tercatat</p>
          </div>
          <button onClick={fetchOrders} className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50 transition">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-50 border-b">
                <th className="p-4 font-semibold text-gray-600 text-sm">ID</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Pelanggan</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Total</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-gray-400 italic">Menyinkronkan data...</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-mono text-xs text-blue-600">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{order.user?.name || "Guest"}</div>
                    <div className="text-xs text-gray-500">{order.user?.email}</div>
                  </td>
                  <td className="p-4 font-bold">Rp {order.total.toLocaleString("id-ID")}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none ${getStatusStyle(order.status)}`}
                    >
                      {ORDER_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      {/* Tombol Delete (Guna Baru) */}
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus Pesanan"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}