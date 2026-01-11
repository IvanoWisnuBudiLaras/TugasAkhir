"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react"; // Tambah AlertCircle
import AddCategoryModal from "@/components/admin/AddCategoryModal";
import EditCategoryModal from "@/components/admin/EditCategoryModal";

// Pastikan API_URL benar. Jika menggunakan proxy atau route group, sesuaikan path-nya.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string | null;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // State untuk pesan error di UI
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    // Gunakan "access_token" sesuai dengan yang ada di AuthContext Anda
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    
    if (!token) {
      router.push("/Auth");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      // PERBAIKAN: Cek apakah backend Anda pakai prefix /api atau tidak. 
      // Jika 404, kemungkinan besar harusnya `${API_URL}/categories`
      const response = await fetch(`${API_URL}/categories`, { 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle jika data dibungkus dalam properti .data (seperti standar API kamu sebelumnya)
        const rawData = Array.isArray(data) ? data : (data.data || []);

        if (Array.isArray(rawData)) {
          const mappedData = rawData.map((item: any) => ({
            id: item.id || item._id,
            name: item.name || "Tanpa Nama",
            description: item.description || "-",
            createdAt: item.createdAt || item.created_at || null,
          }));
          setCategories(mappedData);
        }
      } else {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error("Fetch Error:", error);
      setErrorMsg(error.message === "Failed to fetch" 
        ? "Tidak dapat terhubung ke server. Pastikan Backend menyala." 
        : error.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handler Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kategori ini?")) return;
    
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
      } else {
        alert("Gagal menghapus kategori");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Kategori</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
        >
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      {/* ERROR MESSAGE UI */}
      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p>{errorMsg}</p>
          <button onClick={() => fetchCategories()} className="underline ml-auto font-bold">Coba Lagi</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed">
          <p className="text-gray-500">Belum ada kategori tersedia.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Nama Kategori</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4">Dibuat Pada</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]">{category.description}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {category.createdAt ? new Date(category.createdAt).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => { setSelectedCategory(category); setIsEditModalOpen(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal tetap sama */}
      <AddCategoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onCategoryAdded={fetchCategories} />
      {selectedCategory && (
        <EditCategoryModal 
          isOpen={isEditModalOpen} 
          onClose={() => { setIsEditModalOpen(false); setSelectedCategory(null); }} 
          category={selectedCategory} 
          onCategoryUpdated={fetchCategories} 
        />
      )}
    </div>
  );
}