// app/Kategori/ProductList.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from './types';
import { getProductImageUrl } from '@/lib/imageUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface APIProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  stock?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

// Fetch all products using REST API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${API_URL}/products`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: APIProduct[] = await response.json();
        
        // Transform API data ke format Product
        const transformedProducts: Product[] = data.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          image: product.image || '',
          categoryId: product.categoryId,
          category: product.category ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          } : undefined,
          slug: product.name.toLowerCase().replace(/\s+/g, '-'),
          stock: product.stock || 0,
          isActive: product.isActive ?? true,
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || new Date().toISOString(),
        }));
        
        setProducts(transformedProducts);
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        let errorMessage = 'Gagal memuat produk';
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            errorMessage = 'Koneksi timeout. Server mungkin sedang sibuk.';
          } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Gagal terhubung ke server. Periksa koneksi internet Anda.';
          } else {
            errorMessage = error.message;
          }
        }
        
        setError(errorMessage);
        
        // Fallback jika API error
        const fallbackProducts: Product[] = [
          {
            id: '1',
            name: 'Acai Bowl',
            description: 'Healthy acai bowl with fresh fruits',
            price: 45000,
            image: '',
            categoryId: '1',
            slug: 'acai-bowl',
            stock: 20,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Green Smoothie',
            description: 'Fresh green smoothie with spinach and fruits',
            price: 35000,
            image: '',
            categoryId: '2',
            slug: 'green-smoothie',
            stock: 15,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Protein Bar',
            description: 'Healthy protein bar for energy',
            price: 25000,
            image: '',
            categoryId: '3',
            slug: 'protein-bar',
            stock: 30,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '4',
            name: 'Quinoa Salad',
            description: 'Fresh quinoa salad with vegetables',
            price: 55000,
            image: '',
            categoryId: '4',
            slug: 'quinoa-salad',
            stock: 12,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '5',
            name: 'Chia Pudding',
            description: 'Healthy chia seed pudding with fruits',
            price: 30000,
            image: '',
            categoryId: '5',
            slug: 'chia-pudding',
            stock: 18,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Semua Menu</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center mb-6">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Coba Lagi
          </button>
        </div>
        <p className="text-sm text-gray-500 text-center">
          Menampilkan data produk sementara karena koneksi database bermasalah.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Semua Menu</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">Belum ada menu yang tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Semua Menu</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-red-800">
              <p className="font-medium">Koneksi Database Bermasalah</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link 
            key={product.id}
            href={`/produk/${product.slug}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
          >
            <div className="relative h-48 w-full bg-gray-100">
              {product.image ? (
                <Image
                  src={getProductImageUrl(product.image)}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
                {product.category && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.category.name}
                  </span>
                )}
              </div>
              {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                <p className="text-xs text-orange-600 mt-2">
                  Tersisa {product.stock} stok
                </p>
              )}
              {product.stock === 0 && (
                <p className="text-xs text-red-600 mt-2">
                  Stok habis
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-gray-500 text-center mt-6">
          Menampilkan data produk sementara karena koneksi database bermasalah.
        </p>
      )}
    </div>
  );
}