"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col shadow-sm">
        <h1 className="text-2xl font-bold mb-8 tracking-tight">
          Admin Panel
        </h1>

        <nav className="space-y-1">
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
