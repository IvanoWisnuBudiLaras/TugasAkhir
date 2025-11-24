export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight">
        Dashboard Overview
      </h2>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-semibold mt-1">1,240</p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-semibold mt-1">340</p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-semibold mt-1">892</p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">Revenue Today</p>
          <p className="text-2xl font-semibold mt-1">$4,950</p>
        </div>
      </div>

      {/* CONTENT ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6 shadow-sm h-64">
          <h3 className="font-semibold mb-2">Recent Orders</h3>
          <p className="text-sm text-gray-500">Coming soon...</p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm h-64">
          <h3 className="font-semibold mb-2">Sales Chart</h3>
          <p className="text-sm text-gray-500">Chart will be added here.</p>
        </div>
      </div>
    </div>
  );
}
