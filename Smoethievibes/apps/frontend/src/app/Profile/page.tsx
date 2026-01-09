"use client";
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from "@/lib/context/AuthContext"; // Pastikan path ini benar

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
    productId: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        description?: string;
    };
};

type Order = {
    id: string;
    status: string;
    total: number;
    orderType: string;
    queueNumber?: number;
    tableNumber?: number;
    notes?: string;
    createdAt: string;
    orderItems: OrderItem[];
};

export default function ProfilePage() {
    const router = useRouter();
    const { authLoading, isAuthenticated, checkAuthStatus } = useAuth(); // Gunakan status dari Context
    
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
    const [profile, setProfile] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState('');
    const [loadingData, setLoadingData] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');

    // Gunakan useCallback agar tidak memicu infinite loop di useEffect
    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('access_token'); // SESUAIKAN KEY DISINI
        if (!token) return;

        try {
            setLoadingData(true);
            // Fetch profile
            const profileRes = await fetch(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!profileRes.ok) throw new Error('Failed to fetch profile');
            const profileData: User = await profileRes.json();

            setProfile(profileData);
            setName(profileData.name || '');
            setPhone(profileData.phone || '');
            setAddress(profileData.address || '');
            setAvatar(profileData.avatar || '');

            // Fetch orders
            const ordersRes = await fetch(`${API_URL}/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (ordersRes.ok) {
                const ordersData: Order[] = await ordersRes.json();
                setOrders(ordersData);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load data');
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => {
        // 1. Jika loading auth selesai dan tidak login, baru usir ke /Auth
        if (!authLoading && !isAuthenticated) {
            router.replace('/Auth');
            return;
        }

        // 2. Jika sudah login, baru ambil data
        if (isAuthenticated) {
            fetchData();
        }
    }, [authLoading, isAuthenticated, router, fetchData]);

    const handleUpdateProfile = async () => {
        setUpdating(true);
        setError('');
        try {
            const token = localStorage.getItem('access_token'); // SESUAIKAN KEY DISINI
            const res = await fetch(`${API_URL}/auth/update-profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, phone, address, avatar }),
            });
            if (!res.ok) throw new Error('Failed to update profile');
            
            const updated: User = await res.json();
            setProfile(updated);
            
            // Sync ulang navbar agar nama berubah
            if (checkAuthStatus) await checkAuthStatus();
            
            alert('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    // Tampilkan loading jika status AUTH atau data PROFILE sedang dimuat
    if (authLoading || (loadingData && !profile)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold text-gray-800">My Account</h1>
                    <p className="text-gray-600 mt-2">Manage your profile and view order history</p>
                </motion.div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 rounded-full font-medium transition ${
                            activeTab === 'profile'
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Profile Settings
                    </button>

                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 rounded-full font-medium transition ${
                            activeTab === 'orders'
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Order History
                    </button>
                </div>

                {/* CONTENT */}
                {activeTab === 'profile' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-8">
                        {error && <p className="text-red-600 mb-4">{error}</p>}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profile?.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                                <input
                                    type="url"
                                    value={avatar}
                                    onChange={(e) => setAvatar(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                />
                                {avatar && (
                                    <img src={avatar} alt="Avatar preview" className="mt-3 w-24 h-24 rounded-full object-cover border" />
                                )}
                            </div>

                            <button
                                onClick={handleUpdateProfile}
                                disabled={updating}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400"
                            >
                                {updating ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        {orders.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
                                No orders yet
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-2xl shadow p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                Order #{order.queueNumber || order.id.substring(0, 8)}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="space-y-2 mb-4">
                                            {order.orderItems.map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span>{item.quantity}x {item.product.name}</span>
                                                    <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t pt-2 flex justify-between font-bold">
                                            <span>Total</span>
                                            <span>Rp {order.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}