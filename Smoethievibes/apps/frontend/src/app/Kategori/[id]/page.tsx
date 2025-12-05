
import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { CartButton } from '@/components/CartButton'; 

// Data Produk (Disesuaikan agar merepresentasikan daftar menu di halaman kategori)
const fullMenuData = [
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

export default async function KategoriDetailPage({ params }: { params: { id: string } }) {
    const categoryId = params.id.toLowerCase(); 

    // 🌟 LOGIKA PERBAIKAN: Menentukan judul berdasarkan ID.
    let kategoriTitle;
    if (categoryId === 'semua') {
        kategoriTitle = 'Semua Menu';
    } else {
        kategoriTitle = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    }
    
    // 🌟 LOGIKA PERBAIKAN: Menentukan data yang akan ditampilkan.
    const filteredMenuData = fullMenuData.filter(
        (item) => categoryId === 'semua' || item.kategori.toLowerCase() === categoryId
    );

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
                    {filteredMenuData.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gray-50 rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl"
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
                                
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <p className="text-xl font-extrabold text-orange-500">
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
                    {filteredMenuData.length === 0 && (
                        <div className="col-span-2 md:col-span-4 text-center py-10">
                            <p className="text-xl text-gray-500">
                                😔 Belum ada menu untuk kategori **{kategoriTitle}**.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}