"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "@/lib/context/AuthContext";
import { 
    User as UserIcon, 
    ShoppingBag, 
    Package, 
    Truck, 
    CheckCircle, 
    Clock, 
    MessageCircle, 
    MapPin,
    Phone,
    RefreshCw // Icon untuk refresh
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type User = {
    id?: string;
    email?: string;
    name?: string | null;
    avatar?: string | null;
    phone?: string | null;
    address?: string | null;
};

type OrderItem = {
    id: string;
    quantity: number;
    price: number;
    product: { name: string };
};

type Order = {
    id: string;
    status: string;
    total: number;
    orderType: string;
    createdAt: string;
    orderItems: OrderItem[];
    tableNumber?: number;
};

export default function ProfilePage() {
    const router = useRouter();
    const { authLoading, isAuthenticated, checkAuthStatus } = useAuth();
    
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
    const [profile, setProfile] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false); // State khusus animasi refresh
    const [updating, setUpdating] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');

    const fetchData = useCallback(async (silent = false) => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        if (!token) return;

        if (!silent) setLoadingData(true);
        if (silent) setIsRefreshing(true); // Mulai animasi putar jika refresh manual/silent

        try {
            const [profileRes, ordersRes] = await Promise.all([
                fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_URL}/orders/my-orders`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (profileRes.ok) {
                const pData = await profileRes.json();
                setProfile(pData);
                setName(pData.name || '');
                setPhone(pData.phone || '');
                setAddress(pData.address || '');
                setAvatar(pData.avatar || '');
            }

            if (ordersRes.ok) {
                const oData = await ordersRes.json();
                setOrders(oData);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoadingData(false);
            setIsRefreshing(false); // Stop animasi putar
        }
    }, []);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/Auth');
            return;
        }
        if (isAuthenticated) {
            fetchData();
            // Polling status setiap 30 detik agar tidak berat ke server
            const interval = setInterval(() => fetchData(true), 30000);
            return () => clearInterval(interval);
        }
    }, [authLoading, isAuthenticated, router, fetchData]);

    const handleUpdateProfile = async () => {
        setUpdating(true);
        try {
            const token = localStorage.getItem('access_token') || localStorage.getItem('token');
            const res = await fetch(`${API_URL}/auth/update-profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, phone, address, avatar }),
            });
            if (res.ok) {
                alert('Profil berhasil diperbarui!');
                if (checkAuthStatus) await checkAuthStatus();
            }
        } catch (err) {
            alert('Gagal update profil');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusInfo = (status: string) => {
        const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        const currentIdx = steps.indexOf(status);
        
        const config: any = {
            PENDING: { color: 'text-yellow-600 bg-yellow-100', icon: <Clock size={14}/> },
            CONFIRMED: { color: 'text-blue-600 bg-blue-100', icon: <CheckCircle size={14}/> },
            PROCESSING: { color: 'text-orange-600 bg-orange-100', icon: <Package size={14}/> },
            SHIPPED: { color: 'text-purple-600 bg-purple-100', icon: <Truck size={14}/> },
            DELIVERED: { color: 'text-green-600 bg-green-100', icon: <CheckCircle size={14}/> },
            CANCELLED: { color: 'text-red-600 bg-red-100', icon: <MessageCircle size={14}/> },
        };
        return { steps, currentIdx, ...config[status] || config['PENDING'] };
    };

    if (authLoading || (loadingData && !profile)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                <p className="italic text-gray-400 animate-pulse">Memuat profil Anda...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 pt-10 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Profile Header Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-green-600 overflow-hidden border-4 border-white shadow-md">
                            {avatar ? (
                                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                                    {name ? name[0].toUpperCase() : 'U'}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800">{name || 'User'}</h2>
                            <p className="text-sm text-gray-500">{profile?.email}</p>
                        </div>
                    </div>
                    
                    {/* Tombol Refresh Manual */}
                    <button 
                        onClick={() => fetchData(true)}
                        disabled={isRefreshing}
                        className="p-3 bg-gray-50 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all active:scale-90"
                        title="Refresh Data"
                    >
                        <RefreshCw size={20} className={isRefreshing ? "animate-spin text-green-600" : ""} />
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="bg-gray-200/50 p-1 rounded-2xl flex mb-8">
                    <button onClick={() => setActiveTab('profile')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500'}`}>Profil</button>
                    <button onClick={() => setActiveTab('orders')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500'}`}>Pesanan Saya</button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'profile' ? (
                        <motion.div key="p" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nama Lengkap</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                                        <input value={name} onChange={e => setName(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 outline-none text-sm font-medium"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nomor WhatsApp</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                                        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="628..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 outline-none text-sm font-medium"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Alamat Pengiriman</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 text-gray-400" size={18}/>
                                        <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 outline-none text-sm font-medium"/>
                                    </div>
                                </div>
                                <button onClick={handleUpdateProfile} disabled={updating} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-green-700 transition shadow-lg shadow-green-200 active:scale-95 disabled:bg-gray-300">
                                    {updating ? 'Menyimpan...' : 'Update Profil'}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="o" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                                    <p className="text-gray-400 italic">Belum ada riwayat pesanan</p>
                                </div>
                            ) : (
                                orders.map((order) => {
                                    const status = getStatusInfo(order.status);
                                    return (
                                        <div key={order.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Order ID</span>
                                                    <p className="font-mono text-xs font-black text-gray-800">#{order.id.slice(-6).toUpperCase()}</p>
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${status.color}`}>
                                                    {status.icon} {order.status}
                                                </div>
                                            </div>

                                            {/* Stepper Status */}
                                            {order.status !== 'CANCELLED' && (
                                                <div className="flex justify-between items-center mb-6 px-2">
                                                    {status.steps.map((s: string, idx: number) => (
                                                        <div key={s} className="flex flex-col items-center gap-1.5 flex-1 relative">
                                                            <div className={`w-2.5 h-2.5 rounded-full z-10 transition-all duration-500 ${idx <= status.currentIdx ? 'bg-green-600 scale-125' : 'bg-gray-200'}`} />
                                                            {idx < status.steps.length - 1 && (
                                                                <div className={`absolute top-1 left-1/2 w-full h-[2px] -z-0 ${idx < status.currentIdx ? 'bg-green-600' : 'bg-gray-100'}`} />
                                                            )}
                                                            <span className={`text-[8px] font-bold uppercase ${idx <= status.currentIdx ? 'text-green-700' : 'text-gray-300'}`}>{s.slice(0,4)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="space-y-2 border-t border-dashed pt-4 mb-4">
                                                {order.orderItems.map((item) => (
                                                    <div key={item.id} className="flex justify-between text-xs font-medium">
                                                        <span className="text-gray-600">{item.quantity}x {item.product.name}</span>
                                                        <span className="font-bold text-gray-800">Rp {(item.price * item.quantity).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-end pt-2 border-t">
                                                <div className="text-[10px] text-gray-400">
                                                    <p className="font-bold text-green-600">{order.orderType} {order.tableNumber ? `• Meja ${order.tableNumber}` : ''}</p>
                                                    <p>{new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })} • {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Total Bayar</p>
                                                    <p className="text-lg font-black text-green-700 leading-none">Rp {order.total.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            {order.status === 'PENDING' && (
                                                <button 
                                                    onClick={() => window.open(`https://wa.me/6285749252364?text=Halo Admin, saya mau konfirmasi pembayaran Order #${order.id.slice(-6).toUpperCase()}`, '_blank')}
                                                    className="w-full mt-4 bg-green-50 text-green-700 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-100 transition active:scale-95"
                                                >
                                                    <MessageCircle size={16}/> Konfirmasi via WhatsApp
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}