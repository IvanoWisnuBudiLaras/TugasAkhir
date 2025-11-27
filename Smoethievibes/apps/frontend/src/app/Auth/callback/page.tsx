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

                <div className="mb-4 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {avatar ? (
                            // next/image requires externally allowed domains configured in next.config.js in production,
                            // in dev this works with a full URL. If this errors, consider replacing with an <img /> tag.
                            <Image src={avatar} alt="avatar" width={80} height={80} />
                        ) : (
                            <div className="text-gray-400">No avatar</div>
                        )}
                    </div>
                    {avatar && (
                        <button
                            type="button"
                            onClick={() => {
                                setAvatar(avatar);
                            }}
                            className="px-3 py-1 rounded bg-green-600 text-white"
                        >
                            Use Google
                        </button>
                    )}
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

                <label className="block mb-2 text-sm font-medium text-gray-700">Avatar URL (optional)</label>
                <input
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full p-3 border rounded mb-6"
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
