"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { Plus } from "lucide-react";
import AddProductModal from "@/components/admin/AddProductModal";

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        } else if (response.status === 403) {
          console.error("Access denied: Insufficient permissions to view products");
          router.push("/unauthorized");
        } else if (response.status === 401) {
          console.error("Authentication required: Token may be expired");
          localStorage.removeItem("token");
          router.push("/Auth");
        } else {
          console.error(`Failed to fetch products: HTTP ${response.status} - ${response.statusText}`);
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          console.error('Error details:', errorData);
        }
      } catch (error) {
        console.error("Network error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold tracking-tight">Products</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

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
              <div className="rounded-lg h-40 w-full overflow-hidden mb-4">
                <Image
                  src={p.image || '/placeholder.png'}
                  alt={p.name}
                  width={400}
                  height={160}
                  className="object-cover w-full h-full"
                  unoptimized={true}
                />
              </div>

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

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={() => window.location.reload()}
      />
    </div>
  );
}