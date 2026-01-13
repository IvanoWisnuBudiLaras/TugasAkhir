"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, CheckCircle, AlertCircle, MapPin, Utensils, ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/Context/CartContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const { items: cartItems, removeItem, updateQuantity, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    
    const [isLoading, setIsLoading] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

    // --- State Baru untuk Sinkronisasi OrderType ---
    const [orderType, setOrderType] = useState<'TAKEAWAY' | 'DINE_IN' | 'DELIVERY'>('TAKEAWAY');
    const [tableNumber, setTableNumber] = useState('');

    const API_URL = "http://localhost:3001";
    const whatsappNumber = '6285749252364'; 

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const handleCheckout = async () => {
        // 1. Validasi Auth
        if (!isAuthenticated) {
            setCheckoutMessage({ text: "Silakan login terlebih dahulu.", type: 'error' });
            setTimeout(() => router.push('/Auth'), 2000);
            return;
        }

        // 2. Validasi Input Meja jika Dine In
        if (orderType === 'DINE_IN' && !tableNumber) {
            setCheckoutMessage({ text: "Mohon isi nomor meja Anda.", type: 'error' });
            return;
        }

        if (cartItems.length === 0) return;

        setIsLoading(true);
        const token = localStorage.getItem('access_token');

        try {
            // 3. Persiapkan Payload sesuai Schema Backend
            const payload = {
                orderItems: cartItems.map(item => ({
                    productId: isNaN(Number(item.id)) ? item.id : Number(item.id),
                    quantity: Number(item.quantity),
                    price: Number(item.price)
                })),
                status: "PENDING",
                orderType: orderType, // Mengirim pilihan user (DINE_IN/TAKEAWAY/DELIVERY)
                tableNumber: orderType === 'DINE_IN' ? Number(tableNumber) : null, // Kirim meja hanya jika Dine In
                userId: user?.id 
            };

            // 4. Hit API Backend
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal menyimpan pesanan.");
            }

            // 5. Format Pesanan untuk WhatsApp (Lebih Detail)
            const detailMeja = orderType === 'DINE_IN' ? `\nNomor Meja: *${tableNumber}*` : '';
            const message = `Halo Admin, saya *${user?.name}*.\n\n` + 
                `Saya ingin konfirmasi pesanan *${orderType}*.\n` +
                `Order ID: #${result.id.slice(-6).toUpperCase()}` +
                `${detailMeja}\n\n` +
                `*Detail Menu:*\n` + 
                cartItems.map(i => `- ${i.name} (${i.quantity}x)`).join("\n") + 
                `\n\nTotal Bayar: *Rp ${cartTotal.toLocaleString('id-ID')}*`;
            
            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
            
            // 6. Feedback & Cleanup
            setCheckoutMessage({ text: "Pesanan Berhasil! Menuju Profil...", type: 'success' });

            setTimeout(() => {
                clearCart();
                setCheckoutMessage(null);
                router.push('/Profile'); 
            }, 2500);

        } catch (error: any) {
            setCheckoutMessage({ text: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    if (cartItems.length === 0 && !checkoutMessage) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-gray-50 px-4">
                <ShoppingCart size={80} className="text-gray-200 mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
                <Link href="/Kategori" className="bg-green-600 text-white px-10 py-3 rounded-full font-bold hover:bg-green-700 transition">Mulai Belanja</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-12 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                {checkoutMessage && (
                    <div className={`fixed top-24 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-10 ${checkoutMessage.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {checkoutMessage.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        <p className="font-bold">{checkoutMessage.text}</p>
                    </div>
                )}

                <h1 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight">Keranjang Belanja</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Daftar Item */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-3xl flex items-center shadow-sm border border-gray-100">
                                <div className="w-20 h-20 relative rounded-2xl overflow-hidden bg-gray-100">
                                    <Image src={item.img || '/placeholder-food.jpg'} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="ml-4 flex-grow">
                                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                                    <p className="text-green-600 font-black text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:text-red-500" disabled={item.quantity <= 1}><Minus size={14}/></button>
                                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:text-green-600"><Plus size={14}/></button>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={20}/></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar Checkout */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* --- Selector Order Type --- */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">Metode Pesanan</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'DINE_IN', label: 'Makan', icon: <Utensils size={14}/> },
                                    { id: 'TAKEAWAY', label: 'Bawa', icon: <ShoppingBag size={14}/> },
                                    { id: 'DELIVERY', label: 'Antar', icon: <MapPin size={14}/> }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setOrderType(type.id as any)}
                                        className={`flex flex-col items-center gap-1 py-3 rounded-2xl text-[10px] font-bold transition-all border-2 ${orderType === type.id ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-100' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-white hover:border-green-200'}`}
                                    >
                                        {type.icon}
                                        {type.label}
                                    </button>
                                ))}
                            </div>

                            {/* Input Nomor Meja Khusus Dine In */}
                            <AnimatePresence>
                                {orderType === 'DINE_IN' && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 pt-4 border-t border-dashed">
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nomor Meja</label>
                                        <input 
                                            type="number" 
                                            placeholder="Contoh: 08" 
                                            value={tableNumber}
                                            onChange={(e) => setTableNumber(e.target.value)}
                                            className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 outline-none text-sm font-black"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Ringkasan Total */}
                        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-32">
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Ringkasan</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between font-black text-xl pt-4 border-t">
                                    <span className="text-gray-800">Total</span>
                                    <span className="text-green-600">Rp {cartTotal.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <button onClick={handleCheckout} disabled={isLoading} className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 text-white transition-all active:scale-95 ${isLoading ? 'bg-gray-300' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'}`}>
                                {isLoading ? <span className="animate-pulse">Memproses...</span> : <>Konfirmasi Pesanan <ArrowRight size={20}/></>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}