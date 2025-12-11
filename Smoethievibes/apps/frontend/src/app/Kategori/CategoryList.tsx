// app/Kategori/CategoryList.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '@/lib/graphql/queries';
import { Category } from './types';
// Query configurations removed - using default cache-first policy

interface GraphQLCategory {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Gunakan GraphQL untuk fetch kategori dengan cache-first policy
  const { data, loading: graphqlLoading, error: graphqlError } = useQuery(GET_CATEGORIES, {
    // Default cache-first policy for static data like categories
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Set loading state berdasarkan GraphQL loading
  useEffect(() => {
    setLoading(graphqlLoading);
  }, [graphqlLoading]);

  useEffect(() => {
    if (data?.categories) {
      // Transform GraphQL data ke format Category
      const transformedCategories: Category[] = data.categories.map((cat: GraphQLCategory) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.name.toLowerCase().replace(/\s+/g, '-'), // Generate slug dari name
        description: cat.description || '',
        productCount: 0, // Default 0 karena GraphQL tidak ada field ini
        createdAt: cat.createdAt ? new Date(cat.createdAt) : new Date(),
        updatedAt: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
        isActive: true, // Default true
        sortOrder: 0, // Default 0
      }));
      setCategories(transformedCategories);
      setLoading(false);
    } else if (graphqlError) {
      console.error('GraphQL error:', graphqlError);
      // Fallback jika GraphQL error
      const fallbackCategories: Category[] = [
        { id: '1', name: 'Smoothie Bowl', slug: 'smoothie-bowl', description: 'Healthy smoothie bowls', productCount: 12 },
        { id: '2', name: 'Fresh Juice', slug: 'fresh-juice', description: 'Fresh fruit juices', productCount: 8 },
        { id: '3', name: 'Healthy Snacks', slug: 'healthy-snacks', description: 'Nutritious snacks', productCount: 15 },
        { id: '4', name: 'Main Course', slug: 'main-course', description: 'Healthy main courses', productCount: 10 },
        { id: '5', name: 'Dessert', slug: 'dessert', description: 'Healthy desserts', productCount: 6 },
      ];
      setCategories(fallbackCategories);
      setLoading(false);
    }
  }, [data, graphqlError]);

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

  if (categories.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kategori Produk</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">Belum ada kategori yang tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Kategori Produk</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/Kategori/${category.slug}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
              )}
              {category.productCount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.productCount} produk
                  </span>
                  <span className="text-green-600 font-medium group-hover:translate-x-1 transition-transform">
                    Lihat →
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}