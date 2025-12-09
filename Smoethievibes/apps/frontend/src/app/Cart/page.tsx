"use client";
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, CheckCircle } from 'lucide-react';
import { useCart } from '@/app/Context/CartContext';

export default function CartPage() {
    const { items: cartItems, removeItem, updateQuantity } = useCart();
    
    // State untuk notifikasi setelah checkout (mengganti alert)
    const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

    // Total Harga Otomatis
    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    // Handler Checkout (Simulasi, tanpa alert)
    const handleCheckout = () => {
        if (cartItems.length > 0) {
            // Mengganti alert dengan pesan notifikasi di UI
            setCheckoutMessage(`Sukses! Total pesanan Rp ${cartTotal.toLocaleString('id-ID')} Anda akan diproses. Terima kasih!`);
            
            // Di lingkungan nyata, di sini Anda akan memanggil fungsi clearCart()
        } else {
            setCheckoutMessage("Keranjang Anda kosong. Silakan tambahkan menu terlebih dahulu.");
        }
        
        // Atur agar notifikasi hilang setelah beberapa detik
        setTimeout(() => setCheckoutMessage(null), 5000);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-gray-50">
                <ShoppingCart size={64} className="text-gray-400 mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Keranjang Anda Kosong</h1>
                <p className="text-gray-600 mb-8">Saatnya mengisi keranjang dengan menu sehat!</p>
                <Link
                    href="/Kategori"
                    className="flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition shadow-lg"
                >
                    Lihat Semua Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Custom Notifikasi (Menggantikan alert) */}
                {checkoutMessage && (
                    <div className={`p-4 mb-6 rounded-lg shadow-md flex items-center gap-3 
                                     ${checkoutMessage.startsWith('Sukses') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <CheckCircle size={20} />
                        <p className="font-medium">{checkoutMessage}</p>
                    </div>
                )}

                <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-b pb-4">
                    Keranjang Belanja Anda ({cartItems.length} Item)
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Kolom Kiri: Daftar Item */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div 
                                key={item.id} 
                                className="flex items-center bg-white p-4 rounded-xl shadow-md justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Gambar Produk (Menggunakan <img> standar) */}
                                    <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.img || '/placeholder.png'}
                                            alt={item.name}
                                            width={64}
                                            height={64}
                                            className="object-cover w-full h-full"
                                            unoptimized={true}
                                        />
                                    </div>
                                    
                                    {/* Detail Produk */}
                                    <div>
                                        <h2 className="font-bold text-lg text-gray-900">{item.name}</h2>
                                        <p className="text-sm text-orange-500 font-semibold">
                                            Rp {item.price.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Kontrol Kuantitas */}
                                    <div className="flex items-center border border-gray-300 rounded-full">
                                        <button 
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-full disabled:opacity-50"
                                            aria-label="Kurangi kuantitas"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="px-3 font-semibold text-gray-800">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-full"
                                            aria-label="Tambah kuantitas"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>

                                    {/* Total Harga Per Item */}
                                    <p className="font-bold text-lg w-20 text-right text-gray-900 hidden sm:block">
                                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                    </p>

                                    {/* Tombol Hapus */}
                                    <button 
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                        aria-label="Hapus item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Kolom Kanan: Ringkasan & Checkout */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl sticky top-28 h-fit">
                        <h2 className="text-2xl font-bold text-gray-900 mb-5 border-b pb-3">
                            Ringkasan Pesanan
                        </h2>
                        
                        {/* Detail Biaya */}
                        <div className="space-y-3 text-gray-700 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal ({cartItems.length} jenis item)</span>
                                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Biaya Pengiriman</span>
                                <span className="text-green-600 font-semibold">Gratis</span> 
                            </div>
                            <div className="flex justify-between pt-3 border-t-2 border-green-100">
                                <span className="text-xl font-bold">Total Pembayaran</span>
                                <span className="text-2xl font-extrabold text-orange-500">
                                    Rp {cartTotal.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        {/* Tombol Checkout */}
                        <button 
                            onClick={handleCheckout}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-lg text-lg mb-3"
                        >
                            Lanjutkan Checkout
                            <ArrowRight size={20} />
                        </button>

                        {/* WhatsApp Payment */}
                        <button
                            onClick={() => {
                                // Build message
                                const lines = cartItems.map(it => `${it.quantity}x ${it.name} - Rp ${(it.price * it.quantity).toLocaleString('id-ID')}`);
                                const totalLine = `Total: Rp ${cartTotal.toLocaleString('id-ID')}`;
                                const msg = encodeURIComponent(`Halo SmoethieVibe,%0ASaya ingin memesan:%0A${lines.join('%0A')}%0A%0A${totalLine}%0A%0ASilakan hubungi saya untuk konfirmasi.`);
                                const waUrl = `https://wa.me/?text=${msg}`;
                                window.open(waUrl, '_blank');
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-green-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-900 transition shadow-lg text-lg"
                        >
                            Bayar via WhatsApp
                        </button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            Biaya akan dihitung final di halaman pembayaran. Pilih WhatsApp untuk memesan via chat.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}