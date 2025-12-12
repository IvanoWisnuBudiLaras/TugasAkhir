"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  BarChart3,
  Tag,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user, authLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      // Wait for auth loading to complete
      if (authLoading) return;
      
      // If not authenticated or not admin, redirect to login
      if (!isAuthenticated || user?.role !== 'ADMIN') {
        router.push("/Auth?redirect=/admin");
        return;
      }
      
      // User is authenticated and is admin
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, user, authLoading, router]);

  // Show loading state while checking authentication
  if (authLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render the admin layout if user is not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col shadow-sm">
        <h1 className="text-2xl font-bold mb-8 tracking-tight">
          Admin Panel
        </h1>

        <nav className="space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition mb-4 border border-gray-200"
          >
            <span>← Back to Home</span>
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
          >
            <Users size={18} />
            <span>Users</span>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
          >
            <Tag size={18} />
            <span>Categories</span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
          >
            <Package size={18} />
            <span>Products</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
          >
            <ShoppingCart size={18} />
            <span>Orders</span>
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}