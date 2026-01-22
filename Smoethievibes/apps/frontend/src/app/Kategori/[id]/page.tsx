import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { CartButton } from '@/components/CartButton';

// 1. Tipe Data disesuaikan dengan JSON API
interface Product {
  id: string | number;
  name: string;
  kategori: string;
  price: number;
  img: string;     // Hasil mapping dari field 'image'
  rating: number;
  stock: number;
}

// Data Lokal (Fallback) tetap menggunakan struktur yang sama
const fullMenuData: Product[] = [
  { id: 1, name: "Salad Sayur Super", kategori: "makanan", price: 35000, img: "/Menu/salad sayur.png", rating: 4.6, stock: 10 },
  { id: 2, name: "Strawberry Matcha Yogurt", kategori: "smoothie", price: 32000, img: "/Menu/strawberry matcha yogurt.jpg", rating: 5.0, stock: 5 },
  // ... data lainnya
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// 2. Fungsi Fetch dengan Mapping Properti API
// ... (bagian import dan interface tetap sama)

async function getProducts(categoryId: string): Promise<Product[]> {
  try {
    const cleanCategory = categoryId.trim().toLowerCase();
    
    // 1. Fetch data dari API
    const url = cleanCategory === 'semua' 
      ? `${API_URL}/products` 
      : `${API_URL}/products`; // Kita ambil semua dulu untuk divalidasi di frontend

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    // Menambahkan casting agar TypeScript tidak komplain soal 'next'
    next: { revalidate: 60 } 
  } as RequestInit);

    if (!res.ok) throw new Error("Gagal fetch");

    const rawData = await res.json();

    // 2. MAPPING & VALIDASI KETAT
    const validatedProducts = rawData
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        // Ambil nama kategori dari object 'category'
        kategori: item.category?.name.toLowerCase() || "lainnya",
        price: item.price,
        img: item.image, // Sinkronisasi Cloudinary
        rating: item.rating || 4.7,
        stock: item.stock
      }))
      .filter((product: Product) => {
        // VALIDASI: Hanya masukkan produk jika kategorinya cocok dengan URL
        // Jika URL 'semua', masukkan semua. Jika tidak, harus sama persis.
        if (cleanCategory === 'semua') return true;
        return product.kategori === cleanCategory;
      });

    // 3. Jika hasil filter API kosong, baru gunakan data lokal sebagai cadangan
    if (validatedProducts.length === 0) {
      return fullMenuData.filter(item => 
        cleanCategory === 'semua' || item.kategori.toLowerCase() === cleanCategory
      );
    }

    return validatedProducts;

  } catch (error) {
    console.error("Fetch Error, menggunakan data lokal:", error);
    return fullMenuData.filter(item => 
      categoryId === 'semua' || item.kategori.toLowerCase() === categoryId
    );
  }
}

export default async function KategoriDetailPage({ params }: { params: { id: string } }) {
  const categoryId = params.id.toLowerCase();
  const products = await getProducts(categoryId);

  // Formatting Judul (Makanan -> Makanan, Smoothie -> Smoothie)
  const kategoriTitle = categoryId === 'semua' 
    ? 'Semua Menu' 
    : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Menu {kategoriTitle}
          </h1>
          <p className="text-lg text-gray-600">
            Daftar menu {kategoriTitle.toLowerCase()} terbaik untuk Anda.
          </p>
        </header>

        {/* Grid Daftar Menu */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="h-40 w-full relative bg-gray-200">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  unoptimized={item.img.includes('cloudinary')}
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-gray-900 truncate">{item.name}</h3>
                
                <div className="flex items-center justify-between mt-1 mb-3">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold">{item.rating}</span>
                  </div>
                  <span className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold uppercase">
                    {item.kategori}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t mt-auto">
                  <p className="text-lg font-extrabold text-orange-500">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                  <CartButton 
                    productId={item.id} 
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

        {products.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <p className="text-gray-500">😔 Tidak ada produk di kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}