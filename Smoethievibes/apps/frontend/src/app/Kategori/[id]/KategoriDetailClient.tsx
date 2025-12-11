'use client';

import React, { useEffect, useState } from 'react';
import { GET_ALL_PRODUCTS, GET_PRODUCTS_BY_CATEGORY_SLUG } from '@/lib/graphql/queries';
import client from '@/lib/apollo-client';
// Query configurations removed - using default cache-first policy
import ProductCard from '../ProductCard';
import { getImageUrl as getProductImageUrl } from '../utils';

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
    image?: string;
  };
}

// Interface untuk data produk dari API yang mungkin memiliki field tambahan
interface ApiProduct extends Omit<ProductCardProduct, 'category'> {
  category?: {
    id: string;
    name: string;
    slug: string;
    image?: string;
  };
  categoryName?: string; // Field tambahan dari analytics queries
  categorySlug?: string; // Field tambahan dari analytics queries
}

// Tipe Product sudah diimpor dari types.ts

interface KategoriDetailClientProps {
  categoryId: string;
}

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
        let data;
        
        // Data sementara sebagai fallback
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
        
        if (categoryId === 'semua') {
          try {
            const result = await client.query({
              query: GET_ALL_PRODUCTS,
              variables: { skip: 0, take: 100 },
              // Use cache-first for product listings (default policy)
            });
            data = result.data.products.map((apiProduct: ApiProduct): ProductCardProduct => ({
              ...apiProduct,
              stock: apiProduct.stock ?? 0,
              categoryId: apiProduct.categoryId || apiProduct.category?.id || '1',
              category: apiProduct.category || {
                id: apiProduct.categoryId || '1',
                name: apiProduct.categoryName || 'Default',
                slug: apiProduct.categorySlug || 'default'
              }
            }));
            console.log('All products from API:', data);
          } catch (error) {
            console.warn('API error for all products, using fallback', error);
            data = fallbackProducts;
          }
        } else {
          // Gunakan query baru berdasarkan slug kategori
          try {
            const result = await client.query({
              query: GET_PRODUCTS_BY_CATEGORY_SLUG,
              variables: { categorySlug: categoryId },
              // Use cache-first for product listings (default policy)
            });
            data = result.data.productsByCategorySlug.map((apiProduct: ApiProduct): ProductCardProduct => ({
              ...apiProduct,
              stock: apiProduct.stock ?? 0,
              categoryId: apiProduct.categoryId || apiProduct.category?.id || '1',
              category: apiProduct.category || {
                id: apiProduct.categoryId || '1',
                name: apiProduct.categoryName || 'Default',
                slug: apiProduct.categorySlug || 'default'
              }
            }));
            console.log(`Products for category ${categoryId} from API:`, data);
            
            // Jika tidak ada produk untuk kategori tertentu, filter dari fallback
            if (!data || data.length === 0) {
              const categoryProducts = fallbackProducts.filter(product => 
                product.category && (
                  product.category.slug === categoryId || 
                  product.category.name.toLowerCase().includes(categoryId) ||
                  categoryId.includes(product.category.name.toLowerCase())
                )
              );
              data = categoryProducts.length > 0 ? categoryProducts : fallbackProducts;
              console.log('Using filtered fallback products:', data);
            }
          } catch (error) {
            console.warn('API error for category products, using fallback', error);
            // Filter fallback data berdasarkan kategori
            const categoryProducts = fallbackProducts.filter(product => 
              product.category && (
                product.category.slug === categoryId || 
                product.category.name.toLowerCase().includes(categoryId) ||
                categoryId.includes(product.category.name.toLowerCase())
              )
            );
            data = categoryProducts.length > 0 ? categoryProducts : fallbackProducts;
            console.log('Using fallback products:', data);
          }
        }
        
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Gagal memuat produk. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  // Gunakan utility function untuk produk
  const getImageUrl = getProductImageUrl;
    
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