"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext"; // Import Context
import {
    Menu,
    LogOut,
    ChevronDown,
    X,
} from "lucide-react";

import { CartIcon } from "./CartIcon";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type BackendCategory = {
    id: string;
    name: string;
};

export default function Nav() {
    const router = useRouter();
    
    // AMBIL STATE GLOBAL DARI AUTH CONTEXT
    const { user, isAuthenticated, authLoading, logout } = useAuth();
    
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState<{ name: string; href: string }[]>([
        { name: "Semua Menu", href: "/Kategori" },
    ]);

    // Check Admin status berdasarkan data user dari context
    const isAdmin = user?.role === 'ADMIN';

    // Fetch categories tetap dilakukan di sini (karena kategori bersifat publik)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_URL}/categories`);
                if (!res.ok) throw new Error('Failed to fetch categories');
                const data = (await res.json()) as BackendCategory[];
                const mapped = [
                    { name: "Semua Menu", href: "/Kategori" },
                    ...data.map((c) => {
                        const slug = (c.name || '').toString().toLowerCase().replace(/\s+/g, '-');
                        return { name: c.name, href: `/Kategori/${encodeURIComponent(slug)}` };
                    }),
                ];
                setCategories(mapped);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleLogoutClick = async () => {
        await logout(); // Memanggil fungsi logout dari context
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            {/* 1. DESKTOP NAV */}
            <header className="hidden md:block fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
                <nav className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/logo2.png" alt="Logo" width={38} height={38} className="object-cover rounded-full border border-gray-200" />
                        <span className="text-xl font-bold tracking-wide text-green-600">SmoethieVibe</span>
                    </Link>

                    {/* Navigasi Utama */}
                    <ul className="flex items-center gap-8 text-black/70 text-[15px] font-medium">
                        <li className="hover:text-green-600 transition"><Link href="/">Home</Link></li>

                        {/* DROPDOWN KATEGORI */}
                        <li className="relative" onMouseEnter={() => setIsCategoryOpen(true)} onMouseLeave={() => setIsCategoryOpen(false)}>
                            <button className="flex items-center gap-1 hover:text-green-600 transition focus:outline-none">
                                Kategori
                                <ChevronDown size={16} className={`transform transition-transform ${isCategoryOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </button>
                            {isCategoryOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-40 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                                    {categories.map((item) => (
                                        <Link key={item.name} href={item.href} onClick={() => setIsCategoryOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition">
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </li>

                        <li className="hover:text-green-600 transition"><Link href="/Tentang">Tentang</Link></li>
                        <li className="hover:text-green-600 transition"><Link href="/Contact">Contact</Link></li>
                        
                        {/* Sinkronisasi State Login & Admin */}
                        {isAuthenticated && <li className="hover:text-green-600 transition"><Link href="/Profile">Profile</Link></li>}
                        {/* Link Admin Dashboard - Desktop */}
                          {isAdmin && (
                              <li className="group">
                                  <Link 
                                      href="/admin" 
                                      className="flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700 transition"
                                  >
                                      <span className="relative">
                                          Admin Panel
                                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all group-hover:width-full"></span>
                                      </span>
                                  </Link>
                              </li>
                          )}
                    </ul>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4">
                        <CartIcon />
                        {!authLoading && (
                            isAuthenticated ? (
                                <button onClick={handleLogoutClick} className="bg-red-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-600 transition inline-flex items-center gap-2">
                                    <LogOut size={18} /> Logout
                                </button>
                            ) : (
                                <Link href="/Auth" className="bg-green-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-green-700 transition inline-block text-center">
                                    Sign In
                                </Link>
                            )
                        )}
                    </div>
                </nav>
            </header>

            {/* 2. MOBILE TOP NAV */}
            <header className="md:hidden fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                    <Image src="/logo2.png" alt="Logo" width={34} height={34} className="rounded-full border border-gray-200" />
                    <span className="text-[17px] font-bold text-green-600">SmoethieVibe</span>
                </Link>
                <div className="flex items-center gap-3">
                    <CartIcon /> 
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md bg-gray-100 text-green-600">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* 3. MOBILE SIDEBAR */}
            <nav className={`fixed top-[60px] left-0 h-screen w-full z-40 bg-white/95 backdrop-blur-sm p-8 md:hidden transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <ul className="flex flex-col gap-6 text-xl font-semibold text-gray-700">
                    <li onClick={closeMobileMenu} className="border-b pb-3"><Link href="/">Home</Link></li>
                    <li className="font-bold text-lg text-green-600 pt-2">Kategori</li>
                    {categories.map((item) => (
                         <li key={item.name} onClick={closeMobileMenu} className="pl-4 text-gray-600 border-b pb-3">
                             <Link href={item.href}>{item.name}</Link>
                         </li>
                    ))}
                    <li onClick={closeMobileMenu} className="border-b pb-3"><Link href="/Tentang">Tentang</Link></li>
                    
                    {!authLoading && (
                        isAuthenticated ? (
                            <>
                                <li onClick={closeMobileMenu} className="border-b pb-3"><Link href="/Profile">Profile</Link></li>
                                {/* Link Admin Dashboard - Mobile */}
                                  {isAdmin && (
                                      <li onClick={closeMobileMenu} className="border-b border-orange-100 pb-3">
                                          <Link href="/admin" className="flex items-center justify-between text-orange-600 font-bold">
                                              Admin Dashboard
                                              <span className="bg-orange-100 text-[10px] px-2 py-0.5 rounded-full">Staff Only</span>
                                          </Link>
                                      </li>
                                  )}
                                <li className="pt-4">
                                    <button onClick={handleLogoutClick} className="w-full bg-red-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2">
                                        <LogOut size={20} /> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="pt-4">
                                <Link href="/Auth" onClick={closeMobileMenu} className="w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-xl block text-center">
                                    Sign In
                                </Link>
                            </li>
                        )
                    )}
                </ul>
            </nav>
        </>
    );
}