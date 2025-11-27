"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3001";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/Auth");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight">Products</h2>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white border rounded-xl shadow-sm p-4 hover:shadow-md transition"
            >
              <img
                src={p.image || "/placeholder.png"}
                alt={p.name}
                className="rounded-lg h-40 w-full object-cover mb-4"
              />

              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-gray-500 text-sm">Rp {p.price.toLocaleString()}</p>

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
      )}
    </div>
  );
}
