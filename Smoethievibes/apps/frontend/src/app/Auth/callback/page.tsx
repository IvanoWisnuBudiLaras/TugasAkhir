"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const dynamic = "force-dynamic";

export default function CallbackPage() {
    const router = useRouter();
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
                const urlToken = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('token') : null;
                const token = urlToken || localStorage.getItem("token");
                if (!token) {
                    router.push("/auth");
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
                    router.push("/auth");
                    return;
                }

                const data: User = await res.json();

                // If user already has a name, go to profile
                if (data?.name) {
                    router.push("/Profile");
                    return;
                }

                // Prefill avatar from Google if exists
                setAvatar(data?.avatar || "");
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token available");

            const body: ProfileUpdate = { name } as ProfileUpdate;
            if (phone) body.phone = phone;
            if (address) body.address = address;
            if (avatar) body.avatar = avatar;

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
        } catch (err: unknown) {
            console.error(err);
            const message = err instanceof Error ? err.message : String(err);
            alert(message || "Failed to complete profile");
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
                    className="w-full p-3 border rounded mb-4"
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">Phone (optional)</label>
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border rounded mb-4"
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">Address (optional)</label>
                <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 border rounded mb-4"
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
    );
}
