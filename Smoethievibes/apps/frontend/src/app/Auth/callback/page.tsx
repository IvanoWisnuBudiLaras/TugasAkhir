"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Notification from "@/components/ui/Notification";
import { useNotification } from "@/hooks/useNotification";
import { useAuth } from "@/lib/context/AuthContext"; // Sesuaikan path ini

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const dynamic = "force-dynamic";

export default function CallbackPage() {
    const router = useRouter();
    const { checkAuthStatus } = useAuth(); // Ambil fungsi trigger dari context
    const { notification, showNotification, hideNotification } = useNotification();

    type User = {
        id?: string;
        email?: string;
        name?: string | null;
        avatar?: string | null;
        phone?: string | null;
        address?: string | null;
    };

    type ProfileUpdate = {
        name?: string;
        phone?: string;
        address?: string;
        avatar?: string;
    };

    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        const init = async () => {
            try {
                const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
                const urlToken = params.get('token');
                const urlAccessToken = params.get('access_token');
                const urlError = params.get('error');
                const fromRegister = params.get('from') === 'register';

                let dataParamToken: string | null = null;
                const dataParam = params.get('data');
                if (dataParam) {
                    try {
                        const parsed = JSON.parse(dataParam);
                        dataParamToken = parsed?.access_token || parsed?.token || null;
                    } catch { /* ignore */ }
                }

                let hashToken: string | null = null;
                if (typeof window !== 'undefined' && window.location.hash) {
                    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
                    hashToken = hashParams.get('token') || hashParams.get('access_token');
                }

                if (urlError) {
                    showNotification({ type: 'error', title: 'Login Error', message: decodeURIComponent(urlError), duration: 2500 });
                    setTimeout(() => router.push('/Auth'), 2000);
                    return;
                }

                // AMBIL TOKEN DARI URL/HASH
                const token = urlToken || urlAccessToken || dataParamToken || hashToken;
                
                if (!token) {
                    // Cek jika sudah ada token lama, jika tidak ada baru error
                    if (!localStorage.getItem("access_token")) {
                        showNotification({ type: 'error', title: 'Auth failed', message: 'No token received', duration: 2500 });
                        setTimeout(() => router.push('/Auth'), 2000);
                        return;
                    }
                } else {
                    // SIMPAN TOKEN KE LOCALSTORAGE (Gunakan access_token agar sinkron dengan Context)
                    localStorage.setItem("access_token", token);
                    
                    // TRIGGER CONTEXT UNTUK UPDATE USER & NAVBAR
                    await checkAuthStatus();
                }

                const currentToken = localStorage.getItem("access_token");

                // Ambil data user terbaru
                const res = await fetch(`${API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${currentToken}` },
                });

                if (!res.ok) {
                    router.push("/Auth");
                    return;
                }

                const data: User = await res.json();

                // Jika data sudah lengkap, langsung ke Profile
                if (data?.name) {
                    if (fromRegister) {
                        showNotification({
                            type: 'success',
                            title: '🎉 Welcome!',
                            message: 'Account successfully created. Let\'s get started!',
                            duration: 4000
                        });
                    }
                    router.push("/Profile");
                    return;
                }

                setAvatar(data?.avatar || "");
                if (fromRegister) {
                    showNotification({
                        type: 'info',
                        title: 'Complete Your Profile',
                        message: 'Welcome! Let\'s fill in your details below 🎯',
                        duration: 6000
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router, showNotification, checkAuthStatus]);

    const sanitizeInput = (input: string): string => {
        return input.replace(/[<>]/g, '').replace(/["']/g, '').trim();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("access_token");
            if (!token) throw new Error("No token available");

            const body: ProfileUpdate = {};
            if (name.trim()) body.name = sanitizeInput(name);
            if (phone) body.phone = sanitizeInput(phone);
            if (address) body.address = sanitizeInput(address);
            if (avatar) body.avatar = sanitizeInput(avatar);

            const res = await fetch(`${API_URL}/auth/complete-profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Update failed");

            // Update context sekali lagi agar nama user muncul di Navbar
            await checkAuthStatus();
            router.push('/Profile');
        } catch (error) {
            showNotification({ type: 'error', title: 'Update Failed', message: 'Something went wrong.', duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-green-600 font-medium">Processing authentication...</div>
            </div>
        );
    }

    return (
        <>
            {notification && (
                <Notification {...notification} onClose={hideNotification} />
            )}
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">Complete your profile</h2>
                    <p className="text-sm text-gray-500 mb-6">Just one more step to set up your account.</p>

                    <div className="mb-6 flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-green-100 flex items-center justify-center relative">
                            {avatar ? (
                                <Image src={avatar} alt="avatar" fill className="object-cover" unoptimized />
                            ) : (
                                <span className="text-gray-400 text-xs">No Image</span>
                            )}
                        </div>
                        <div className="w-full">
                            <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">Avatar URL</label>
                            <input
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                placeholder="https://..."
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">Full Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">Phone</label>
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                placeholder="+62..."
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">Address</label>
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                placeholder="Street name..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Finish & Go to Profile'}
                    </button>
                </form>
            </div>
        </>
    );
}