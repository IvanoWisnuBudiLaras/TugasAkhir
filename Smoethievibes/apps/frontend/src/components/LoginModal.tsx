"use client";
import React, { FC } from 'react';
import Link from 'next/link';
import { LogIn, X, ShoppingBag } from 'lucide-react';

// Definisikan props untuk mengontrol modal
interface LoginRequiredModalProps {
    isOpen: boolean;
    onClose: () => void; // Fungsi untuk menutup modal (tombol 'X' atau 'Lanjut Belanja')
}

// Catatan: Ganti '/Auth' dengan path halaman login/auth Anda yang sebenarnya
const AUTH_PAGE_PATH = '/Auth'; 
// Ganti '/Kategori' dengan path halaman tempat user bisa "lihat-lihat"
const BROWSE_PAGE_PATH = '/Kategori'; 

export const LoginRequiredModal: FC<LoginRequiredModalProps> = ({ isOpen, onClose }) => {
    
    // Jangan tampilkan modal jika isOpen false
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
            // Opsional: Tutup modal saat mengklik di luar area konten
            onClick={onClose} 
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100"
                // Mencegah penutupan modal saat mengklik di dalam konten
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 text-orange-600">
                        <ShoppingBag size={24} />
                        <h2 className="text-xl font-bold text-gray-900">Aksi Membutuhkan Login</h2>
                    </div>
                    {/* Tombol X untuk menutup */}
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50"
                        aria-label="Tutup"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="text-gray-700 mb-6">
                    Untuk melanjutkan, Anda perlu masuk atau mendaftar.
                </p>

                <div className="space-y-3">
                    {/* 1. CTA Login/Daftar */}
                    <Link 
                        href={AUTH_PAGE_PATH}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition"
                        onClick={onClose} // Tutup modal saat mengklik CTA
                    >
                        <LogIn size={20} />
                        Masuk / Daftar Sekarang
                    </Link>

                    {/* 2. Tombol "Lihat-Lihat Aja" */}
                    <Link
                        href={BROWSE_PAGE_PATH} 
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition"
                        onClick={onClose}
                    >
                        <X size={20} />
                        Lanjut Lihat-Lihat Saja
                    </Link>
                </div>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                    Data keranjang Anda aman dan akan tersedia setelah login.
                </p>
            </div>
        </div>
    );
};