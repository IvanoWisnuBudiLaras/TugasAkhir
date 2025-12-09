// components/MenuRekomendasi.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react"; 
import { CartButton } from "./CartButton"; // Import CartButton

// Data Produk (Hanya 3 item teratas)
const menuRekomendasi = [
    { id: 1, name: "Strawberry Matcha Yogurt", kategori: "makanan", price: 25000, img: "/Landing/strawberry matcha yogurt.jpg", rating: 4.8, stock: 10 },
    { id: 2, name: "Roasted Chicken UP", kategori: "smoothie", price: 30000, img: "/Landing/Roasted chiken Up with mashed potato.png", rating: 4.7, stock: 15 },
    { id: 3, name: "Crispy Chicken UP", kategori: "makanan", price: 28000, img: "/Landing/Crispy Chiken UP.png", rating: 4.9, stock: 12 },
];

export function Rekomendasi() {
  return (
    <section className="py-16 px-6 bg-gray-50"> 
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-2">
          Pilihan Terbaik Kami
        </h2>
        
        <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Cicipi menu terlaris dan paling dicintai oleh pelanggan SmoethieVibe!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {menuRekomendasi.map((item) => (
            <div
              key={item.id}
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
            </div>
          ))}
        </div>
        
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