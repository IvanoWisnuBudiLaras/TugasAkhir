// components/MenuRekomendasi.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react"; 
import { CartButton } from "./CartButton"; // Import CartButton
import { AnimatedHeading, AnimatedParagraph, ScrollText } from "./animations";

interface Product {
  id: number;
  name: string;
  kategori: string;
  price: number;
  img: string;
  rating: number;
  stock: number;
}

const fallbackMenuRekomendasi = [
    { id: 1, name: "Avocado Salad", kategori: "makanan", price: 25000, img: "/Menu/avocado salad.png", rating: 4.8, stock: 10 },
    { id: 2, name: "Cocoa Peanut Butter", kategori: "smoothie", price: 30000, img: "/Menu/Cocoa Peanut Butter.jpg", rating: 4.7, stock: 15 },
    { id: 3, name: "Crispy Chicken UP", kategori: "makanan", price: 28000, img: "/Menu/Crispy Chiken UP.png", rating: 4.9, stock: 12 },
];

export function Rekomendasi() {
  const [menuRekomendasi, setMenuRekomendasi] = useState<Product[]>(fallbackMenuRekomendasi);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendedProducts();
  }, []);

  const fetchRecommendedProducts = async () => {
    try {
      setLoading(true);
      
      // Coba fetch dari API
      const response = await fetch('http://localhost:3001/products');
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          // Ambil 3 produk teratas berdasarkan rating atau random
          const topProducts = data
            .sort((a: { rating?: number }, b: { rating?: number }) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3)
            .map((product: { 
              id: string; 
              name: string; 
              category?: { name?: string }; 
              price: number; 
              image?: string; 
              rating?: number; 
              stock?: number; 
            }) => ({
              id: product.id,
              name: product.name,
              kategori: product.category?.name || 'makanan',
              price: product.price,
              img: product.image || `https://res.cloudinary.com/dogx3ps3r/image/upload/v1765320860/default_product.png`,
              rating: product.rating || 4.5,
              stock: product.stock || 10
            }));
          setMenuRekomendasi(topProducts);
        } else {
          // Jika tidak ada data, gunakan fallback
          setMenuRekomendasi(fallbackMenuRekomendasi);
        }
      } else {
        // Jika API error, gunakan fallback
        console.warn('API error, using fallback recommended products');
        setMenuRekomendasi(fallbackMenuRekomendasi);
      }
    } catch (error) {
      console.error('Error fetching recommended products:', error);
      // Jika network error, gunakan fallback
      setMenuRekomendasi(fallbackMenuRekomendasi);
    } finally {
      setLoading(false);
    }
  };
  return (
      <section className="py-16 px-6 bg-gray-50"> 
        <div className="max-w-6xl mx-auto">
          <AnimatedHeading 
            level={2}
            className="text-4xl font-extrabold text-center text-gray-900 mb-2"
            delay={0.2}
          >
            Pilihan Terbaik Kami
          </AnimatedHeading>
          
          <AnimatedParagraph 
            className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
            delay={0.4}
          >
            Cicipi menu terlaris dan paling dicintai oleh pelanggan SmoethieVibe!
          </AnimatedParagraph>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-xl overflow-hidden animate-pulse">
                  <div className="h-56 w-full bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="flex items-center justify-between mt-1 mb-3">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {menuRekomendasi.map((item, index) => (
                <ScrollText
                  key={item.id}
                  delay={0.6 + (index * 0.2)}
                  className="bg-white rounded-xl shadow-xl overflow-hidden 
                             hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer"
                >
                  <div className="h-56 w-full relative">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-xl text-gray-900 leading-tight">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-1 mb-3">
                        <span className="text-sm text-green-600 font-medium capitalize">
                          {item.kategori}
                        </span>
                        <p className="text-sm flex items-center gap-1 text-yellow-600">
                            <Star size={16} fill="yellow" className="text-yellow-500" />
                            <span className="font-semibold">{item.rating}</span>
                        </p>
                    </div>
                    
                    {/* Harga dan Tombol Keranjang BARU */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <p className="text-2xl font-extrabold text-orange-500">
                            Rp {item.price.toLocaleString("id-ID")}
                        </p>
                        {/* CartButton */}
                        <CartButton productId={item.id} productName={item.name} productPrice={item.price} productImg={item.img} productStock={item.stock || 0} />
                    </div>
                  </div>
                </ScrollText>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
              <Link 
                  href="/Kategori"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-semibold rounded-full shadow-lg text-green-600 bg-white border-green-600 hover:bg-gray-100 transition"
              >
                  Lihat Semua Menu
              </Link>
          </div>
          
        </div>
      </section>
    );
}