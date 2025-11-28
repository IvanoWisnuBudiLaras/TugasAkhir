// Kategori/[id]/page.tsx (Contoh simulasi struktur file)

"use client";

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { CartButton } from '@/components/CartButton'; // Asumsikan lokasi CartButton

// Data Produk (Disesuaikan agar merepresentasikan daftar menu di halaman kategori)
const fullMenuData = [
    { id: 10, name: "Salad Sayur Super", kategori: "makanan", price: 35000, img: "/Menu/salad sayur.png", rating: 4.6 },
    { id: 11, name: "Strawberry Matcha Yogurt", kategori: "smoothie", price: 32000, img: "/Menu/strawberry matcha yogurt.jpg", rating: 5.0 },
    { id: 12, name: "Roasted Chicken (Mashed Potato)", kategori: "makanan", price: 45000, img: "/Menu/Roasted Chiken UP (roasted potato).png", rating: 4.8 },
    // ... data menu lainnya
];

export default function KategoriDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const kategoriTitle = id.charAt(0).toUpperCase() + id.slice(1);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
                    Menu Kategori: {kategoriTitle}
                </h1>
                <p className="text-center text-lg text-gray-600 mb-12">
                    Jelajahi semua {kategoriTitle} favorit Anda di SmoethieVibe.
                </p>

                {/* Grid Daftar Menu */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {fullMenuData.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gray-50 rounded-xl shadow-lg overflow-hidden transition-shadow duration-300"
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
                                    <p className="text-sm flex items-center gap-1 text-yellow-600">
                                        <Star size={14} fill="yellow" className="text-yellow-500" />
                                        <span>{item.rating}</span>
                                    </p>
                                    <span className="text-xs text-gray-500 font-medium capitalize">
                                        {item.kategori}
                                    </span>
                                </div>

                                {/* Harga dan Tombol Keranjang BARU */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <p className="text-xl font-extrabold text-orange-500">
                                        Rp {item.price.toLocaleString("id-ID")}
                                    </p>
                                    {/* Menerapkan CartButton baru */}
                                    <CartButton productId={item.id} productName={item.name} productPrice={item.price} productImg={item.img} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}