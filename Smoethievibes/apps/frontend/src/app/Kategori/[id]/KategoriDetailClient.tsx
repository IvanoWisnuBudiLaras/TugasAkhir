'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '../ProductCard';
import { getImageUrl as getProductImageUrl } from '../utils';

interface ApiProduct {
  id?: string;
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  image?: string;
  images?: string[];
  stock?: number;
  categoryId?: string;
  category?: {
    id?: string;
    name?: string;
    slug?: string;
  };
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Type guard function untuk memastikan data produk valid
const isValidApiProduct = (item: unknown): item is ApiProduct => {
  return (
    typeof item === 'object' &&
    item !== null &&
    ('id' in item || '_id' in item) &&
    'name' in item
  );
};

interface ProductCardProduct {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  image?: string;
  images?: string[];
  stock: number;
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface KategoriDetailClientProps {
  categoryId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function KategoriDetailClient({ categoryId }: KategoriDetailClientProps) {
  const [products, setProducts] = useState<ProductCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🌟 LOGIKA PERBAIKAN: Menentukan judul berdasarkan ID.
  let kategoriTitle;
  if (categoryId === 'semua') {
    kategoriTitle = 'Semua Menu';
  } else {
    kategoriTitle = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        setLoading(true);
        
        let data: ProductCardProduct[] = [];
        
        if (categoryId === 'semua') {
          // Ambil semua produk
          const response = await fetch(`${API_URL}/products`);
          if (!response.ok) throw new Error('Gagal memuat produk');
          
          const productsData = await response.json();
          // Validasi dan transformasi data
          const validatedProducts = Array.isArray(productsData) ? productsData.filter(isValidApiProduct) : [];
          data = validatedProducts.map((product) => {
            // Pastikan category.id selalu ada
            const categoryId = product.category?.id || product.categoryId || '1';
            const categoryName = product.category?.name || 'Default';
            const categorySlug = product.category?.slug || 'default';
            return {
              id: product.id || product._id || '',
              name: product.name || '',
              slug: product.slug || (product.name || '').toLowerCase().replace(/\s+/g, '-'),
              description: product.description,
              price: product.price || 0,
              image: product.image || product.images?.[0],
              images: product.images,
              stock: product.stock || 0,
              categoryId: categoryId,
              isActive: product.isActive ?? true,
              isFeatured: product.isFeatured,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              category: {
                id: categoryId,
                name: categoryName,
                slug: categorySlug
              }
            };
          });
        } else {
          // Ambil produk berdasarkan kategori slug
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          const response = await fetch(`${API_URL}/products/category/${categoryId}`, {
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) throw new Error('Gagal memuat produk untuk kategori ini');
          
          const productsData = await response.json();
          // Validasi dan transformasi data
          const validatedProducts = Array.isArray(productsData) ? productsData.filter(isValidApiProduct) : [];
          data = validatedProducts.map((product) => {
            // Pastikan category.id selalu ada
            const categoryId = product.category?.id || product.categoryId || '1';
            const categoryName = product.category?.name || 'Default';
            const categorySlug = product.category?.slug || 'default';
            return {
              id: product.id || product._id || '',
              name: product.name || '',
              slug: product.slug || (product.name || '').toLowerCase().replace(/\s+/g, '-'),
              description: product.description,
              price: product.price || 0,
              image: product.image || product.images?.[0],
              images: product.images,
              stock: product.stock || 0,
              categoryId: categoryId,
              isActive: product.isActive ?? true,
              isFeatured: product.isFeatured,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              category: {
                id: categoryId,
                name: categoryName,
                slug: categorySlug
              }
            };
          });
        }
        
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        let errorMessage = 'Gagal memuat produk. Silakan coba lagi.';
        
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
        
        // Fallback data
        const fallbackProducts: ProductCardProduct[] = [
          {
            id: '1',
            name: 'Avocado Salad',
            slug: 'avocado-salad',
            description: 'Fresh avocado with mixed vegetables',
            price: 25000,
            image: 'https://res.cloudinary.com/dogx3ps3r/image/upload/v1765320860/avocado_salad.png',
            stock: 10,
            categoryId: '1',
            category: {
              id: '1',
              name: 'Healthy Food',
              slug: 'healthy-food'
            }
          },
          {
            id: '2',
            name: 'Cocoa Peanut Butter',
            slug: 'cocoa-peanut-butter',
            description: 'Rich cocoa with peanut butter smoothie',
            price: 30000,
            image: 'https://res.cloudinary.com/dogx3ps3r/image/upload/v1765320861/Cocoa_Peanut_Butter.jpg',
            stock: 15,
            categoryId: '2',
            category: {
              id: '2',
              name: 'Smoothie',
              slug: 'smoothie'
            }
          },
          {
            id: '3',
            name: 'Crispy Chicken UP',
            slug: 'crispy-chicken-up',
            description: 'Crispy chicken with roasted potato',
            price: 28000,
            image: 'https://res.cloudinary.com/dogx3ps3r/image/upload/v1765321380/Roasted_Chiken_UP_roasted_potato.png',
            stock: 12,
            categoryId: '3',
            category: {
              id: '3',
              name: 'Main Course',
              slug: 'main-course'
            }
          }
        ];
        
        // Filter berdasarkan kategori jika bukan 'semua'
        if (categoryId !== 'semua') {
          const filteredProducts = fallbackProducts.filter(product => 
            product.category && (
              product.category.slug === categoryId || 
              product.category.name.toLowerCase().includes(categoryId) ||
              categoryId.includes(product.category.name.toLowerCase())
            )
          );
          setProducts(filteredProducts.length > 0 ? filteredProducts : fallbackProducts);
        } else {
          setProducts(fallbackProducts);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  // Gunakan utility function untuk produk
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '/placeholder-image.jpg';
    return getProductImageUrl(imagePath);
  };
    
  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Koneksi Database Bermasalah</h3>
                <p className="text-red-600 text-sm mb-4">Tidak dapat terhubung ke database. Menampilkan data produk sementara untuk kategori {kategoriTitle}.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} getImageUrl={getImageUrl} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
          Menu Kategori: {kategoriTitle}
        </h1>
        <p className="text-center text-lg text-gray-600 mb-12">
          Jelajahi semua {kategoriTitle.toLowerCase()} favorit Anda di SmoethieVibe.
        </p>

        {/* Grid Daftar Menu */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              getImageUrl={getImageUrl}
            />
          ))}
          {products.length === 0 && (
            <div className="col-span-2 md:col-span-4 text-center py-10">
              <p className="text-xl text-gray-500">
                😔 Belum ada menu untuk kategori <strong>{kategoriTitle}</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}