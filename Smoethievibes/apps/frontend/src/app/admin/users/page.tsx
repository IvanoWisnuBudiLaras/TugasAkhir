"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3001";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Auth");
      return;
    }

    console.log("Token found:", token ? "Yes" : "No");
    console.log("Fetching users from:", `${API_URL}/users`);

    fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Response status:", res.status);
        console.log("Response ok:", res.ok);
        if (!res.ok) {
          return res.text().then(text => {
            try {
              const errData = JSON.parse(text);
              console.error("Server error response:", errData);
              throw new Error(errData.message || `HTTP ${res.status}: Failed to fetch users`);
            } catch {
              console.error("Server error response (raw):", text);
              throw new Error(`HTTP ${res.status}: Failed to fetch users - ${text}`);
            }
          }).catch((parseError) => {
            console.error("Error parsing error response:", parseError);
            throw new Error(`HTTP ${res.status}: Failed to fetch users`);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Users data received:", data);
        if (!Array.isArray(data)) {
          console.error("Expected array but got:", typeof data, data);
          throw new Error("Invalid response format: expected array of users");
        }
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to load users. Please try again.");
        setLoading(false);
      });
  }, [router]);

  const handleRoleEdit = (user: User) => {
    setEditingUser(user.id);
    setEditRole(user.role);
  };

  const handleRoleUpdate = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: editRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: editRole } : user
      ));
      setEditingUser(null);
      
      alert("User role updated successfully!");
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role");
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      // Update local state
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      ));
      
      alert(`User ${user.isActive ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MANAGER":
        return "bg-purple-100 text-purple-800";
      case "STAFF":
        return "bg-blue-100 text-blue-800";
      case "CUSTOMER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h2>
          <p className="text-gray-500">There are no users in the system yet.</p>
        </div>
      </div>
    );
  }

  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(u => u.isActive).length;
    const byRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<UserRole, number>);

    return { total, active, byRole };
  };

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold tracking-tight">User Management</h2>
        <div className="text-sm text-gray-500">
          Total: {stats.total} users • Active: {stats.active}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(Object.keys(stats.byRole) as UserRole[]).map(role => (
          <div key={role} className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-500">{role}</div>
            <div className="text-2xl font-bold">{stats.byRole[role]}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-none">
                <td className="py-3">{u.name || "No Name"}</td>
                <td>{u.email}</td>
                <td>
                  {editingUser === u.id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as UserRole)}
                        className="text-sm px-2 py-1 border rounded"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="STAFF">STAFF</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                      </select>
                      <button
                        onClick={() => handleRoleUpdate(u.id)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:underline text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className={`text-sm px-3 py-1 rounded-lg ${getRoleBadgeColor(u.role)}`}>
                      {u.role}
                    </span>
                  )}
                 </td>
                 <td>
                   <span className={`text-sm px-3 py-1 rounded-lg ${
                     u.isActive 
                       ? "bg-green-100 text-green-800" 
                       : "bg-red-100 text-red-800"
                   }`}>
                     {u.isActive ? "Active" : "Inactive"}
                   </span>
                 </td>
                 <td className="text-right">
                   {editingUser !== u.id && (
                     <div className="flex justify-end space-x-2">
                       <button
                         onClick={() => handleRoleEdit(u)}
                         className="text-blue-600 hover:underline text-sm"
                       >
                         Edit Role
                       </button>
                       <button
                         onClick={() => handleToggleStatus(u)}
                         className={`text-sm hover:underline ${
                           u.isActive 
                             ? "text-red-600 hover:text-red-800" 
                             : "text-green-600 hover:text-green-800"
                         }`}
                       >
                         {u.isActive ? "Deactivate" : "Activate"}
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