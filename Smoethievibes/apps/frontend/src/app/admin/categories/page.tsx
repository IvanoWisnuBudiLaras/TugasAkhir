"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import AddCategoryModal from "@/components/admin/AddCategoryModal";
import EditCategoryModal from "@/components/admin/EditCategoryModal";

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

interface ApiCategory {
  id?: string;
  _id?: string;
  name?: string;
  description?: string;
  createdAt?: string;
  created_at?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token tidak ditemukan. Silakan login ulang.");
      router.push("/Auth");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setError("Sesi telah berakhir. Silakan login ulang.");
        localStorage.removeItem("token");
        router.push("/Auth");
        return;
      }

      if (response.status === 403) {
        setError("Anda tidak memiliki izin untuk mengakses halaman ini.");
        router.push("/unauthorized");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validasi data yang diterima
      if (!Array.isArray(data)) {
        throw new Error("Format data tidak valid");
      }
      
      // Validasi struktur data kategori
      const validCategories = data.map((cat: ApiCategory) => ({
        id: cat.id || cat._id || '',
        name: cat.name || 'Unnamed Category',
        description: cat.description || '',
        createdAt: cat.createdAt || cat.created_at || null,
        isActive: cat.isActive ?? true,
        sortOrder: cat.sortOrder || 0,
      })).filter((cat) => cat.id && cat.name);
      
      setCategories(validCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Gagal memuat kategori. Silakan coba lagi.");
      
      // Fallback: set kategori kosong jika error
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [router, API_URL]);

  useEffect(() => {
    fetchCategories();
  }, [router, fetchCategories]);

  const handleCategoryAdded = () => {
    fetchCategories();
  };

  const handleCategoryUpdated = () => {
    fetchCategories();
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      router.push("/Auth");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Kategori berhasil dihapus!");
        fetchCategories();
      } else if (response.status === 403) {
        alert("Anda tidak memiliki izin untuk menghapus kategori ini.");
      } else if (response.status === 401) {
        alert("Sesi telah berakhir. Silakan login ulang.");
        localStorage.removeItem("token");
        router.push("/Auth");
      } else {
        let errorMessage = "Gagal menghapus kategori";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          console.error("Delete error response:", errorText);
        }
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Terjadi kesalahan jaringan. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-semibold tracking-tight">Kategori</h2>
          <button
            onClick={fetchCategories}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kategori
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-800">
              <p className="font-medium">Terjadi kesalahan</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={fetchCategories}
              className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Memuat kategori...</p>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">Belum ada kategori yang tersedia.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Tambah kategori pertama
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Dibuat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {category.description || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {category.createdAt 
                          ? new Date(category.createdAt).toLocaleDateString()
                          : "Tidak tersedia"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Ubah
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onCategoryUpdated={handleCategoryUpdated}
      />
    </div>
  );
}