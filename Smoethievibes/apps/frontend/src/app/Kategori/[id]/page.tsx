import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { CartButton } from '@/components/CartButton';

// 1. Tipe Data untuk Produk
interface Product {
  id: number | string;
  name: string;
  kategori: string;
  price: number;
  img: string;
  rating: number;
  stock: number;
}

// 2. Data Statis (Fallback) - Mencegah "Failed to Fetch" membuat layar kosong
const fullMenuData: Product[] = [
  { id: 1, name: "Salad Sayur Super", kategori: "makanan", price: 35000, img: "/Menu/salad sayur.png", rating: 4.6, stock: 10 },
  { id: 2, name: "Strawberry Matcha Yogurt", kategori: "smoothie", price: 32000, img: "/Menu/strawberry matcha yogurt.jpg", rating: 5.0, stock: 5 },
  { id: 3, name: "Roasted Chicken (Mashed Potato)", kategori: "makanan", price: 45000, img: "/Menu/Roasted Chiken UP (roasted potato).png", rating: 4.8, stock: 0 },
  { id: 4, name: "Crispy Chicken Up", kategori: "makanan", price: 40000, img: "/Menu/Crispy Chiken Up.png", rating: 4.7, stock: 8 },
  { id: 5, name: "Roti Bakar Tropicana", kategori: "makanan", price: 25000, img: "/Menu/Roti bakar tropicana slim rasa crunchy chocolate.png", rating: 4.5, stock: 15 },
  { id: 6, name: "Avocado Salad", kategori: "makanan", price: 38000, img: "/Menu/avocado salad.png", rating: 4.9, stock: 3 },
  { id: 7, name: "Green Dream Smoothie", kategori: "smoothie", price: 30000, img: "/Menu/green dream.png", rating: 4.8, stock: 12 },
  { id: 8, name: "Manggo Matcha Yogurt", kategori: "smoothie", price: 33000, img: "/Menu/manggo matcha yogurt.jpg", rating: 4.9, stock: 0 },
  { id: 9, name: "Mega Manggo Smoothie", kategori: "smoothie", price: 34000, img: "/Menu/mega manggo.jpg", rating: 4.7, stock: 9 },
  { id: 10, name: "Mushroom Saose", kategori: "makanan", price: 42000, img: "/Menu/mushrum saose.jpg", rating: 4.6, stock: 7 },
  { id: 11, name: "Strawberry Dragon Smoothie", kategori: "smoothie", price: 31000, img: "/Menu/strawberry dragon.png", rating: 4.9, stock: 11 },
  { id: 12, name: "Sunrise Plate", kategori: "makanan", price: 48000, img: "/Menu/sunrise plate.png", rating: 4.8, stock: 4 },
  { id: 13, name: "Very Berry Smoothie", kategori: "smoothie", price: 29000, img: "/Menu/very berry smoethie.png", rating: 4.7, stock: 0 },
  { id: 14, name: "Cocoa Peanut Butter", kategori: "minuman", price: 28000, img: "/Menu/Cocoa Peanut Butter.jpg", rating: 4.9, stock: 14 },
  { id: 15, name: "Swedia Meetball", kategori: "makanan", price: 55000, img: "/Landing/Swedia Meetball.png", rating: 4.9, stock: 6 },
  { id: 16, name: "Roasted Chicken Up", kategori: "makanan", price: 52000, img: "/Landing/Roasted chiken Up with mashed potato.png", rating: 4.8, stock: 2 },
  { id: 17, name: "Crispy Chiken Up (Landing)", kategori: "makanan", price: 41000, img: "/Landing/Crispy Chiken Up.png", rating: 4.7, stock: 1 },
  { id: 18, name: "Strawberry Matcha (Landing)", kategori: "smoothie", price: 34000, img: "/Landing/strawberry matcha yogurt.jpg", rating: 5.0, stock: 10 },
];

// 3. Fungsi Fetch Data (REST API)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getProducts(categoryId: string): Promise<Product[]> {
  try {
    const url = categoryId === 'semua' 
      ? `${API_URL}/products` 
      : `${API_URL}/products?category=${categoryId}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 } // Fitur Cache Next.js
    } as any);

    if (!res.ok) throw new Error("Gagal mengambil data dari server");

    return await res.json();
  } catch (error) {
    console.error("Fetch Error, menggunakan data lokal:", error);
    // Filter data lokal berdasarkan kategori jika API gagal
    return fullMenuData.filter(
      (item) => categoryId === 'semua' || item.kategori.toLowerCase() === categoryId
    );
  }
}

// 4. Komponen Utama
export default async function KategoriDetailPage({ params }: { params: { id: string } }) {
  const categoryId = params.id.toLowerCase();
  const products = await getProducts(categoryId);

  // Formatting Judul
  const kategoriTitle = categoryId === 'semua' 
    ? 'Semua Menu' 
    : categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' ');

  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Menu Kategori: {kategoriTitle}
          </h1>
          <p className="text-lg text-gray-600">
            Jelajahi semua {kategoriTitle.toLowerCase()} favorit Anda di SmoethieVibe.
          </p>
        </header>

        {/* Grid Daftar Menu */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="h-40 w-full relative">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {item.name}
                </h3>
                
                <div className="flex items-center justify-between mt-1 mb-3">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star size={14} fill="currentColor" className="text-yellow-500" />
                    <span className="text-sm font-bold">{item.rating}</span>
                  </div>
                  <span className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold uppercase tracking-wider">
                    {item.kategori}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-400">Harga</p>
                    <p className="text-lg font-extrabold text-orange-500">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <CartButton 
                    productId={item.id} // CartButton sekarang fleksibel string | number
                    productName={item.name} 
                    productPrice={item.price} 
                    productImg={item.img} 
                    productStock={item.stock} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kondisi Jika Tidak Ada Data */}
        {products.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-xl text-gray-500 italic">😔 Belum ada menu untuk kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}