"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3001";

interface UserData {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  product: {
    name: string;
    category: string;
  };
  quantity: number;
  price: number;
}

export function Sectionone({ user }: { user: UserData | null }) {
  return (
    <div className="flex flex-col items-center mb-6 animate-fadeIn">
      <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 mb-3 bg-gray-100">
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt="Profile"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-200 text-green-700 font-bold text-3xl">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        )}
      </div>
      <h1 className="text-xl font-semibold text-gray-800">{user?.name || "Loading..."}</h1>
      <p className="text-sm text-gray-500">{user?.email}</p>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"history" | "customize" | "">("");
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Form states untuk edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/Auth");
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch user");

      const userData = await response.json();
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });

      // Fetch orders
      const ordersResponse = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      alert("Profil berhasil diperbarui!");
      setEditing(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-32 pb-10">
      <Sectionone user={user} />

      <div className="w-full max-w-lg mx-auto space-y-8 px-4">
        {/* Account Information */}
        <div className="w-full p-8 border border-green-400 rounded-3xl shadow-sm bg-white">
          <h2 className="text-lg font-semibold text-green-700 mb-2">Informasi Akun</h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Nama</p>
              <p className="font-medium text-gray-800">{user?.name}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Nomor Telepon</p>
              <p className="font-medium text-gray-800">{user?.phone || "-"}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Alamat</p>
              <p className="font-medium text-gray-800">{user?.address || "-"}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full p-6 border border-gray-300 rounded-3xl flex flex-col gap-3 bg-white">
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-3 rounded-lg font-medium transition ${
              activeTab === "history"
                ? "bg-green-600 text-white"
                : "bg-green-400 text-white hover:bg-green-500"
            }`}
          >
            Riwayat Pembelian
          </button>

          <button
            onClick={() => setActiveTab("customize")}
            className={`px-4 py-3 rounded-lg font-medium transition ${
              activeTab === "customize"
                ? "bg-green-600 text-white"
                : "bg-green-400 text-white hover:bg-green-500"
            }`}
          >
            Edit Profil
          </button>
        </div>

        {/* Purchase History */}
        {activeTab === "history" && (
          <div className="w-full p-8 border border-green-400 rounded-3xl shadow-sm bg-white animate-fadeIn">
            <h3 className="font-semibold text-green-700 mb-4">Riwayat Pembelian</h3>

            {orders.length === 0 ? (
              <p className="text-gray-600 text-sm">Belum ada riwayat pembelian</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-800">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      {order.items.map((item) => (
                        <p key={item.id} className="text-sm text-gray-700">
                          {item.product.name} ({item.product.category}) x{item.quantity} - Rp{item.price.toLocaleString("id-ID")}
                        </p>
                      ))}
                    </div>

                    <div className="border-t pt-2">
                      <p className="font-semibold text-gray-800">
                        Total: Rp{order.total.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit Profile */}
        {activeTab === "customize" && (
          <div className="w-full p-8 border border-green-400 rounded-3xl shadow-sm bg-white animate-fadeIn">
            <h3 className="font-semibold text-green-700 mb-4">Edit Profil</h3>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateProfile}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition font-medium"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">Nama:</span> {formData.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {formData.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Nomor Telepon:</span> {formData.phone || "-"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Alamat:</span> {formData.address || "-"}
                </p>

                <button
                  onClick={() => setEditing(true)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium mt-4"
                >
                  Edit Profil
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
