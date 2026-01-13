'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { GET_ALL_PRODUCTS, GET_PRODUCTS_BY_CATEGORY_SLUG } from '@/lib/graphql/queries';
import client from '@/lib/apollo-client';
import { CartButton } from '@/components/CartButton';

// Interface disesuaikan dengan kebutuhan UI
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  rating?: number;
  category: {
    name: string;
    slug: string;
  };
}

export default function KategoriDetailClient({ categoryId }: { categoryId: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const kategoriTitle = categoryId === 'semua' 
    ? 'Semua Menu' 
    : categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' ');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        
        if (categoryId === 'semua') {
          const result = await client.query({
            query: GET_ALL_PRODUCTS,
            variables: { skip: 0, take: 100 },
          });
          data = result.data.products;
        } else {
          const result = await client.query({
            query: GET_PRODUCTS_BY_CATEGORY_SLUG,
            variables: { categorySlug: categoryId },
          });
          data = result.data.productsByCategorySlug;
        }

        // Mapping data agar aman digunakan di UI
        const mappedData = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image || '/Menu/default_product.png',
          stock: p.stock || 0,
          rating: p.rating || 4.5, // Fallback rating jika tidak ada di DB
          category: {
            name: p.category?.name || 'Menu',
            slug: p.category?.slug || 'default'
          }
        }));

        setProducts(mappedData);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Gagal memuat produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) return <div className="text-center pt-40">Memuat Menu...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
          Menu Kategori: {kategoriTitle}
        </h1>
        <p className="text-center text-lg text-gray-600 mb-12">
          Jelajahi semua {kategoriTitle.toLowerCase()} favorit Anda di SmoethieVibe.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
              <div className="h-40 w-full relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 truncate">{item.name}</h3>
                
                <div className="flex items-center justify-between mt-1 mb-3">
                  <p className="text-sm flex items-center gap-1 text-yellow-600">
                    <Star size={14} fill="yellow" className="text-yellow-500" />
                    <span>{item.rating}</span>
                  </p>
                  <span className="text-xs text-gray-500 font-medium capitalize">
                    {item.category.name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <p className="text-xl font-extrabold text-orange-500">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                  <CartButton 
                    productId={Number(item.id)} 
                    productName={item.name} 
                    productPrice={item.price} 
                    productImg={item.image} 
                    productStock={item.stock} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">😔 Belum ada menu untuk kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}