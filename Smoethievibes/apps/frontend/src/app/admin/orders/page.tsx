"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3001";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/Auth");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight">Orders</h2>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Date</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b last:border-none">
                  <td className="py-3 text-sm font-mono">{order.id.slice(0, 8)}...</td>
                  <td>
                    <div className="text-sm font-medium">{order.user?.name || "Guest"}</div>
                    <div className="text-xs text-gray-500">{order.user?.email}</div>
                  </td>
                  <td>Rp {order.total.toLocaleString()}</td>
                  <td>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${order.status === "COMPLETED" || order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-right">
                    <button className="text-blue-600 hover:underline text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
