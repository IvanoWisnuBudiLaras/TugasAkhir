"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2 } from "lucide-react";
import AddCategoryModal from "@/components/admin/AddCategoryModal";
import EditCategoryModal from "@/components/admin/EditCategoryModal";

const API_URL = "http://localhost:3001";

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Auth");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const text = await response.text();
        if (!text) {
          console.warn("Empty response received");
          setCategories([]);
          return;
        }
        try {
          const data = JSON.parse(text);
          // Validasi struktur data kategori
          if (Array.isArray(data)) {
            const validCategories = data.map((cat: unknown) => {
              const category = cat as Record<string, unknown>;
              return {
                id: (category.id || category._id || '') as string,
                name: (category.name || 'Unnamed Category') as string,
                description: (category.description || '') as string,
                createdAt: (category.createdAt || category.created_at || null) as string | null
              };
            }).filter((cat) => cat.id && cat.name);
            setCategories(validCategories);
          } else {
            console.warn("Invalid data format: expected array");
            setCategories([]);
          }
        } catch (parseError) {
          console.error("Failed to parse JSON response:", text);
          console.error("Parse error details:", parseError);
          setCategories([]);
        }
      } else if (response.status === 403) {
        console.error("Access denied: Insufficient permissions to view categories");
        router.push("/unauthorized");
      } else if (response.status === 401) {
        console.error("Authentication required: Token may be expired");
        localStorage.removeItem("token");
        router.push("/Auth");
      } else {
        console.error(`Failed to fetch categories: HTTP ${response.status} - ${response.statusText}`);
        let errorData = { message: 'Unknown error' };
        let errorText = '';
        try {
          errorText = await response.text();
          if (errorText) {
            errorData = JSON.parse(errorText);
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          errorData = { message: errorText || 'Failed to fetch categories' };
        }
        console.error('Error details:', errorData);
        setCategories([]);
      }
    } catch (error) {
      console.error("Network error fetching categories:", error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error("Possible CORS or network connectivity issue");
      }
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

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
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/products/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Category deleted successfully!");
        fetchCategories();
      } else {
        let errorMessage = "Failed to delete category";
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
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold tracking-tight">Categories</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                          : "Not available"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
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