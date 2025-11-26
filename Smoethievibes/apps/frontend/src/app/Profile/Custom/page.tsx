"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3001";

export default function ProfileSetupPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("token");
        if (!stored) {
            router.push("/Auth");
        } else {
            setToken(stored);
        }
    }, [router]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Nama harus diisi");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("address", address);
            formData.append("phone", phone);
            if (avatar) formData.append("avatar", avatar);

            const resp = await fetch(`${API_URL}/auth/profile`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await resp.json();
            if (!resp.ok) throw new Error(data.message || "Gagal memperbarui profil");

            alert("Profil berhasil disimpan!");
            router.push("/");
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-white p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/30"
            >
                <h2 className="text-2xl font-semibold text-neutral-800 mb-6 text-center">
                    Lengkapi Profil Anda
                </h2>
                <input
                    type="text"
                    placeholder="Nama Lengkap *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="w-full p-3 mb-4 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
                    disabled={loading}
                    className="w-full mb-4"
                />
                <input
                    type="text"
                    placeholder="Alamat (opsional)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={loading}
                    className="w-full p-3 mb-4 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none"
                />
                <input
                    type="text"
                    placeholder="Telepon (opsional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    className="w-full p-3 mb-6 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none"
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                    {loading ? "Menyimpan…" : "Simpan Profil"}
                </button>
            </motion.div>
        </div>
    );
}
