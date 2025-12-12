'use client';

import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '@/lib/graphql/queries';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export default function CategorySection() {
  const { data, loading, error, refetch } = useQuery(GET_CATEGORIES, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  });

  if (loading && !data) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Kategori Produk
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && !data) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Kategori Produk
          </h2>
          <p className="text-red-500 mb-4">Gagal memuat kategori</p>
          <button
            onClick={() => refetch()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </section>
    );
  }

  const categories = data?.categories || [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Kategori Produk
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Jelajahi berbagai kategori produk kami yang berkualitas tinggi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category: Category) => (
            <Link
              key={category.id}
              href={`/Kategori/${category.name.toLowerCase()}`}
              className="group block"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-green-600 text-6xl font-bold opacity-20">
                        {category.name.charAt(0)}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-4">
                    <span className="text-green-600 font-medium group-hover:underline">
                      Lihat Produk →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/Kategori"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Lihat Semua Kategori
          </Link>
        </div>
      </div>
    </section>
  );
}