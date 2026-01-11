"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { ShieldAlert, UserCheck, UserX, Users } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type UserRole = "ADMIN" | "CUSTOMER" | "STAFF" | "MANAGER";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>("CUSTOMER");

  const fetchUsers = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const headers = authAPI.getAuthHeaders();
    
    // 1. Check if token exists locally first
    if (!headers || !headers.Authorization) {
      console.warn("No token found, redirecting...");
      router.push("/Auth");
      return;
    }

    const res = await fetch(`${API_URL}/users`, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    // 2. Handle 401 IMMEDIATELY
    if (res.status === 401) {
      localStorage.removeItem("access_token");
      router.replace("/Auth"); // Use replace to prevent back-button loops
      return;
    }

    // 3. Handle 403
    if (res.status === 403) {
      throw new Error("Akses Ditolak: Anda bukan Admin.");
    }

    // 4. Handle other errors (This is where your code was crashing)
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Error ${res.status}: Gagal mengambil data.`);
    }

    // 5. Success
    const data = await res.json();
    const finalData = Array.isArray(data) ? data : (data.data || []);
    setUsers(finalData);

  } catch (err: any) {
    console.error("User Fetch Error:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
  }, [router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleUpdate = useCallback(async (userId: string) => {
    const headers = authAPI.getAuthHeaders();
    if (!headers.Authorization) {
      localStorage.removeItem("access_token");
      router.push("/Auth");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ role: editRole }),
      });

      if (res.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/Auth");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Gagal mengubah role (status ${res.status})`);
      }

      const updated = await res.json();
      // update lokal
      setUsers((prev) => prev.map(u => u.id === userId ? { ...u, role: updated.role || editRole } : u));
      setEditingUser(null);
    } catch (err: any) {
      console.error("Update Role Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [editRole, router]);

  const handleToggleStatus = useCallback(async (userId: string, current: boolean) => {
    const headers = authAPI.getAuthHeaders();
    if (!headers.Authorization) {
      localStorage.removeItem("access_token");
      router.push("/Auth");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ isActive: !current }),
      });

      if (res.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/Auth");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Gagal mengubah status (status ${res.status})`);
      }

      const updated = await res.json();
      setUsers((prev) => prev.map(u => u.id === userId ? { ...u, isActive: updated.isActive ?? !current } : u));
    } catch (err: any) {
      console.error("Toggle Status Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
      <p className="text-gray-500">Memuat daftar user...</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 p-8 rounded-xl text-center">
      <ShieldAlert className="mx-auto text-red-500 mb-4" size={48} />
      <h3 className="text-lg font-bold text-red-800">Akses Dibatasi</h3>
      <p className="text-red-600 mb-4">{error}</p>
      <button 
        onClick={() => router.push('/')}
        className="bg-gray-800 text-white px-6 py-2 rounded-lg"
      >
        Kembali ke Home
      </button>
    </div>
  );

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="text-green-600" /> Manajemen User
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-gray-500 text-sm">Total User</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm text-green-600">
          <p className="text-gray-500 text-sm">User Aktif</p>
          <p className="text-2xl font-bold">{users.filter(u => u.isActive).length}</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">User</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{u.name || "N/A"}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {u.isActive ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm"><UserCheck size={14}/> Aktif</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-sm"><UserX size={14}/> Nonaktif</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingUser === u.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as UserRole)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="STAFF">STAFF</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                      </select>
                      <button
                        onClick={() => handleRoleUpdate(u.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() => { setEditingUser(u.id); setEditRole(u.role); }}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Edit Role
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u.id, u.isActive)}
                        className={`text-sm px-3 py-1 rounded ${u.isActive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}