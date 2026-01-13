'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Ganti URL dengan endpoint REST API Anda
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('REST Error, using fallback:', error);
        setCategories([
          { id: '1', name: 'Makanan', slug: 'makanan', description: 'Menu makanan sehat' },
          { id: '2', name: 'Smoothie', slug: 'smoothie', description: 'Minuman buah segar' },
          { id: '3', name: 'Minuman', slug: 'minuman', description: 'Minuman sehat lainnya' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="p-10 text-center">Memuat Kategori...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pilih Kategori</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tombol "Semua Menu" Spesial */}
        <Link href="/Kategori/semua" className="bg-green-600 text-white p-6 rounded-xl shadow-lg hover:bg-green-700 transition">
          <h3 className="text-xl font-bold">Semua Menu</h3>
          <p className="text-green-100 text-sm">Lihat seluruh daftar menu kami</p>
        </Link>

        {categories.map((cat) => (
          <Link key={cat.id} href={`/Kategori/${cat.slug}`} className="bg-white p-6 rounded-xl shadow-md border hover:shadow-xl transition group">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600">{cat.name}</h3>
            <p className="text-gray-500 text-sm">{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}