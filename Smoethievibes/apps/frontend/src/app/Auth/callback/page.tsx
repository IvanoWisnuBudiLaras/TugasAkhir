"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Notification from "@/components/ui/Notification";
import { useNotification } from "@/hooks/useNotification";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const dynamic = "force-dynamic";

export default function CallbackPage() {
    const router = useRouter();
    const { notification, showNotification, hideNotification } = useNotification();
    // We'll read the token from the URL on the client via window.location.search

    type User = {
        id?: string;
        email?: string;
        name?: string | null;
        avatar?: string | null;
        phone?: string | null;
        address?: string | null;
    };

    type ProfileUpdate = {
        name: string;
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
                // @keamanan Get token and error from URL search params
                const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
                const urlToken = params.get('token');
                const urlError = params.get('error');
                const fromRegister = params.get('from') === 'register';

                // @keamanan Handle Google OAuth errors
                if (urlError) {
                    showNotification({
                        type: 'error',
                        title: '❌ Authentication Failed',
                        message: decodeURIComponent(urlError),
                        duration: 5000,
                    });
                    // Redirect to Auth page after showing error
                    setTimeout(() => router.push('/Auth'), 2000);
                    return;
                }

                const token = urlToken || localStorage.getItem("token");
                if (!token) {
                    router.push("/Auth");
                    return;
                }

                // Save token to localStorage for subsequent requests
                localStorage.setItem("token", token);

                // Call backend to get user info
                const res = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    // Could be a brand new token or invalid — redirect to auth
                    router.push("/Auth");
                    return;
                }

                const data: User = await res.json();

                // If user already has a name, go to profile
                if (data?.name) {
                    // Tampilkan pesan welcome untuk user baru dengan efek yang lebih menarik
                if (fromRegister) {
                    showNotification({
                        type: 'success',
                        title: '🎉 Welcome to Smoethie Vibes!',
                        message: 'Your account has been successfully created. Let\'s get started! 🚀',
                        duration: 6000
                    });
                }
                    router.push("/Profile");
                    return;
                }

                // Prefill avatar from Google if exists
                setAvatar(data?.avatar || "");
                
                // Tampilkan pesan untuk user baru dengan efek yang lebih menarik
                if (fromRegister) {
                    showNotification({
                        type: 'info',
                        title: '✨ Complete Your Profile',
                        message: 'Welcome! Let\'s make your profile awesome. Fill in your details below 🎯',
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
    }, [router, showNotification]);

    // Fungsi untuk sanitasi input
    const sanitizeInput = (input: string): string => {
        return input
            .replace(/[<>]/g, '') // Hapus karakter HTML
            .replace(/["']/g, '') // Hapus kutipan
            .replace(/javascript:/gi, '') // Hapus javascript protocol
            .replace(/on\w+=/gi, '') // Hapus event handlers
            .trim();
    };

    // Fungsi untuk validasi nama
    const validateName = (name: string): { valid: boolean; message?: string } => {
        if (!name || name.trim().length === 0) {
            return { valid: false, message: "Name is required" };
        }
        if (name.length < 2) {
            return { valid: false, message: "Name must be at least 2 characters" };
        }
        if (name.length > 50) {
            return { valid: false, message: "Name must be less than 50 characters" };
        }
        // Validasi karakter yang diizinkan (huruf, spasi, dan beberapa karakter khusus)
        if (!/^[a-zA-Z\s\-\.']+$/.test(name)) {
            return { valid: false, message: "Name can only contain letters, spaces, hyphens, dots, and apostrophes" };
        }
        return { valid: true };
    };

    // Fungsi untuk validasi nomor telepon
    const validatePhone = (phone: string): { valid: boolean; message?: string } => {
        if (!phone.trim()) return { valid: true }; // Optional
        
        // Hapus spasi dan karakter khusus
        const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
        
        if (cleanPhone.length > 0 && !/^[\d\+\-]{7,15}$/.test(cleanPhone)) {
            return { valid: false, message: "Invalid phone number format" };
        }
        return { valid: true };
    };

    // Fungsi untuk validasi URL avatar
    const validateAvatarUrl = (url: string): { valid: boolean; message?: string } => {
        if (!url.trim()) return { valid: true }; // Optional
        
        try {
            const urlObj = new URL(url);
            // Validasi protocol yang aman
            if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                return { valid: false, message: "Avatar URL must use HTTP or HTTPS protocol" };
            }
            // Validasi ekstensi file yang diizinkan
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            const hasValidExtension = allowedExtensions.some(ext => 
                urlObj.pathname.toLowerCase().endsWith(ext)
            );
            if (!hasValidExtension) {
                return { valid: false, message: "Avatar URL must be a valid image (jpg, jpeg, png, gif, webp)" };
            }
            return { valid: true };
        } catch {
            return { valid: false, message: "Invalid avatar URL format" };
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi input dengan pesan yang lebih menarik
        const nameValidation = validateName(name);
        if (!nameValidation.valid) {
            showNotification({
              type: 'error',
              title: '🚫 Oops! Name Issue',
              message: nameValidation.message || 'Please check your name and try again ✨',
              duration: 5000
            });
            return;
        }

        // Validasi phone jika diisi dengan pesan yang lebih menarik
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
            showNotification({
              type: 'error',
              title: '📱 Phone Number Error',
              message: phoneValidation.message || 'Please check your phone number format 📞',
              duration: 5000
            });
            return;
        }

        // Validasi avatar jika diisi dengan pesan yang lebih menarik
        const avatarValidation = validateAvatarUrl(avatar);
        if (!avatarValidation.valid) {
            showNotification({
              type: 'error',
              title: '🖼️ Avatar URL Error',
              message: avatarValidation.message || 'Please check your avatar URL format 🎨',
              duration: 5000
            });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token available");

            const body: ProfileUpdate = { 
                name: sanitizeInput(name) 
            } as ProfileUpdate;
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

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Unable to complete profile");
            }

            // Navigate to profile after completion
            router.push('/Profile');
        } catch (error: unknown) {
            console.error(error);
            showNotification({
                type: 'error',
                title: '💥 Profile Update Failed',
                message: 'Oops! Something went wrong. Please check your connection and try again. 🔄',
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">Processing authentication...</div>
            </div>
        );
    }

    return (
        <>
            {notification && (
                <Notification
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    duration={notification.duration}
                    onClose={hideNotification}
                    isClosing={notification.isClosing}
                />
            )}
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Complete your profile</h2>

                <p className="text-sm text-gray-600 mb-4">
                    We only need your name to finish setting up your account. You can add more details later.
                </p>

                <div className="mb-6 flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 relative">
                        {avatar ? (
                            <Image src={avatar} alt="avatar" width={96} height={96} className="w-full h-full object-cover" unoptimized={true} />
                        ) : (
                            <span className="text-gray-400 text-xs text-center px-2">No Avatar</span>
                        )}
                    </div>
                    <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Avatar URL</label>
                        <input
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Paste a direct link to an image.</p>
                    </div>
                </div>

                <label className="block mb-2 text-sm font-medium text-gray-700">Name *</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={50}
                    placeholder="Enter your full name"
                    className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-green-500 outline-none"
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">Phone (optional)</label>
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={20}
                    placeholder="+62 812 3456 7890"
                    className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-green-500 outline-none"
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">Address (optional)</label>
                <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    maxLength={200}
                    placeholder="Jl. Example No. 123, City"
                    className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-green-500 outline-none"
                />



                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-green-600 text-white rounded font-semibold disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Complete Profile'}
                </button>
            </form>
        </div>
        </>
    );
}