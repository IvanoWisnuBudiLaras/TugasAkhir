"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const API_URL = "http://localhost:3001";

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isNewUser, setIsNewUser] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [googleAvatar, setGoogleAvatar] = useState<string>("");
    
    // Form states
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const checkUserAndAuth = async () => {
            try {
                const tokenParam = searchParams.get("token");
                if (!tokenParam) {
                    router.push("/Auth?error=auth_failed");
                    return;
                }

                setToken(tokenParam);
                localStorage.setItem("token", tokenParam);

                // Check if user exists and has complete profile
                const response = await fetch(`${API_URL}/auth/me`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${tokenParam}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    console.log("User data:", userData);
                    
                    // If user has complete profile, redirect to home
                    if (userData.name) {
                        router.push("/");
                    } else {
                        // New user or incomplete profile - show form
                        setIsNewUser(true);
                        if (userData.name) setName(userData.name);
                        if (userData.address) setAddress(userData.address);
                        if (userData.avatar) {
                            setAvatar(userData.avatar);
                            setGoogleAvatar(userData.avatar);
                        }
                        if (userData.phone) setPhone(userData.phone);
                    }
                } else {
                    setIsNewUser(true);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsNewUser(true);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserAndAuth();
    }, [router, searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim()) {
            alert("Nama wajib diisi!");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/auth/complete-profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim() || null,
                    address: address.trim(),
                    avatar: avatar.trim() || null,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to complete profile");
            }

            alert("Profil berhasil dilengkapi!");
            router.push("/");
        } catch (error) {
            const err = error instanceof Error ? error : new Error("An error occurred");
            console.error(err);
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col items-center gap-6"
                >
                    <div className="relative w-16 h-16">
                        <motion.div
                            className="absolute inset-0 border-4 border-green-200 rounded-full"
                        />
                        <motion.div
                            className="absolute inset-0 border-4 border-green-600 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-neutral-800">Verifying your account</h2>
                        <p className="text-neutral-500 mt-1">Please wait...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (isNewUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-white px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-white/70 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.08)] rounded-2xl border border-black/10 p-8"
                >
                    <h2 className="text-3xl font-semibold text-neutral-900 mb-2">Welcome to Smoothievibes!</h2>
                    <p className="text-neutral-600 mb-6">Please enter your name to complete your Google registration</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Google Avatar Preview */}
                        {googleAvatar && (
                            <div className="flex flex-col items-center mb-4">
                                <p className="text-sm text-neutral-600 mb-2">Your Google Avatar</p>
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-400">
                                    <Image
                                        src={googleAvatar}
                                        alt="Google Avatar"
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={submitting}
                                required
                                autoFocus
                                className="w-full p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number (optional)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={submitting}
                                className="w-full p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Address
                            </label>
                            <textarea
                                placeholder="Enter your address (optional)"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                disabled={submitting}
                                rows={3}
                                className="w-full p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Avatar URL
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    placeholder="Enter avatar URL (optional)"
                                    value={avatar}
                                    onChange={(e) => setAvatar(e.target.value)}
                                    disabled={submitting}
                                    className="flex-1 p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                {googleAvatar && (
                                    <button
                                        type="button"
                                        onClick={() => setAvatar(googleAvatar)}
                                        disabled={submitting}
                                        className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap"
                                    >
                                        Use Google
                                    </button>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                "Complete Profile"
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return null;
}
