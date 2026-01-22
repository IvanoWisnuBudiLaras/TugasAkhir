"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  image?: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onProductUpdated: () => void;
}

const API_URL = "http://localhost:3001";

export default function EditProductModal({ isOpen, onClose, product, onProductUpdated }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        categoryId: product.categoryId || product.categoryId || "",
        image: product.image || "",
      });
      setImagePreview(product.image || "");
    }
  }, [product]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/categories`, { headers });
      if (res.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth-change'));
        setCategoriesError('Unauthorized');
        setCategories([]);
        return;
      }
      if (res.ok) {
        const json = await res.json();
        const raw = Array.isArray(json) ? json : (json.data || json.categories || []);
        setCategories(Array.isArray(raw) ? (raw as Category[]) : []);
      } else if (res.status === 404) {
        setCategoriesError('No categories found');
        setCategories([]);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      console.error('Error fetching categories', err);
      setCategoriesError('Failed to load categories');
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setImagePreview(data.url);
      setFormData(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error('Image upload error', err);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          stock: parseInt(formData.stock) || 0,
          categoryId: formData.categoryId || undefined,
          image: formData.image || undefined,
        }),
      });

      if (res.ok) {
        alert('Product updated successfully');
        onProductUpdated();
        onClose();
      } else if (res.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth-change'));
        alert('Unauthorized. Please login again.');
      } else {
        const err = await res.json().catch(() => ({ message: 'Unknown error' }));
        alert(err.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product', err);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
            <input name="slug" value={formData.slug} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              {categoriesLoading ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">Loading categories...</div>
              ) : categoriesError ? (
                <div className="space-y-2">
                  <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">No categories available</option>
                  </select>
                  <p className="text-sm text-red-600">{categoriesError}</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="space-y-2">
                  <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">No categories available</option>
                  </select>
                  <p className="text-sm text-yellow-600">No categories found. Please add categories first.</p>
                </div>
              ) : (
                <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (IDR) *</label>
              <input name="price" type="number" value={formData.price} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
              <input name="stock" type="number" value={formData.stock} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
              <div className="flex items-center gap-3">
                <input id="edit-image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                <label htmlFor="edit-image-upload" className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer inline-flex items-center gap-2">
                  <Upload /> {isUploading ? 'Uploading...' : 'Upload Image'}
                </label>
                {imagePreview && (
                  <div className="h-16 w-16 rounded overflow-hidden border">
                    <Image src={imagePreview} alt="preview" width={64} height={64} className="object-cover" unoptimized />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50" disabled={loading}>Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" disabled={loading}>{loading ? 'Updating...' : 'Update Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
