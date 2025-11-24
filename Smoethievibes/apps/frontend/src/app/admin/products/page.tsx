export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "Classic Hoodie",
      price: "$49.90",
      stock: 120,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    },
    {
      id: 2,
      name: "White Sneakers",
      price: "$89.00",
      stock: 45,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight">Products</h2>

      {/* CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white border rounded-xl shadow-sm p-4 hover:shadow-md transition"
          >
            <img
              src={p.image}
              alt={p.name}
              className="rounded-lg h-40 w-full object-cover mb-4"
            />

            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-gray-500 text-sm">{p.price}</p>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">
                Stock: <strong>{p.stock}</strong>
              </span>
              <button className="text-blue-600 hover:underline text-sm">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
