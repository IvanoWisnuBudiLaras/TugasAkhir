export default function UsersPage() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Customer" },
    { id: 2, name: "Sarah Lee", email: "sarah@example.com", role: "Admin" },
    { id: 3, name: "Michael Chen", email: "michael@example.com", role: "Customer" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight">Users</h2>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Role</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-none">
                <td className="py-3">{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="text-sm px-3 py-1 bg-gray-100 rounded-lg">
                    {u.role}
                  </span>
                </td>
                <td className="text-right">
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
