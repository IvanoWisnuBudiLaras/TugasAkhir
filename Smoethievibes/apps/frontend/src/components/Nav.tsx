"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, LogOut, ChevronDown, X } from "lucide-react";
import { CartIcon } from "./CartIcon";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Type untuk kategori
interface Category {
  id: string;
  name: string;
}

type UserProfile = {
    id: string;
    email: string;
    name?: string | null;
    avatar?: string | null;
    phone?: string | null;
    address?: string | null;
    role?: string;
};

export default function Nav() {
  // UI State
  const [hydrated, setHydrated] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Categories State (REST API)
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Hindari fetch sebelum hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Fetch categories using REST API
  useEffect(() => {
    if (!hydrated) return;
    
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch(`${API_URL}/categories`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
        setCategoriesError(null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoriesError('Gagal memuat kategori');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch user profile
  useEffect(() => {
    if (!hydrated) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) throw new Error('Failed to fetch profile');
        
        const profile: UserProfile = await res.json();
        setIsLoggedIn(true);
        setIsAdmin(profile.role === 'ADMIN');
      } catch {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    fetchProfile();
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setIsAdmin(false);
      window.location.href = '/';
    }
  };

  const refetchCategories = () => {
    // Trigger refetch by fetching again
    setCategoriesLoading(true);
    setCategoriesError(null);
    
    fetch(`${API_URL}/categories`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch categories');
        return response.json();
      })
      .then(data => {
        setCategories(data);
        setCategoriesError(null);
      })
      .catch(error => {
        console.error('Error refetching categories:', error);
        setCategoriesError('Gagal memuat kategori');
      })
      .finally(() => {
        setCategoriesLoading(false);
      });
  };

  if (!hydrated) {
    // hindari layout shifting yang bikin login kedip
    return (
      <div className="w-full h-[55px] bg-white border-b border-gray-200" />
    );
  }

  // --------------------------------------------------------------------------------------------- 
  // RENDER NAV NORMAL 
  // --------------------------------------------------------------------------------------------- 
  return (
    <>
      <header className="
        hidden md:block fixed top-0 left-0 w-full z-50
        bg-white/90 backdrop-blur-md border-b border-gray-200
      ">
        <nav className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo2.png" width={38} height={38} alt="Logo" />
            <span className="text-xl font-bold text-green-600">Chilla By SmoethieVibe</span>
          </Link>

          {/* MENU */}
          <ul className="flex items-center gap-8 text-black/70 text-[15px]">
            <li><Link href="/" className="hover:text-green-600 transition-colors duration-200">Home</Link></li>

            {/* DROPDOWN KATEGORI */}
            <li
              className="relative"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-green-600 transition-colors duration-200">
                Kategori
                <ChevronDown size={15} className={`${isCategoryOpen ? "rotate-180" : ""} transition-transform duration-200`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 bg-white shadow-lg border rounded-lg transition-all duration-200 ease-out opacity-100 transform translate-y-0">
                  <Link href="/Kategori" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-150">Semua Menu</Link>

                  {categoriesLoading && <div className="px-4 py-2 text-sm">Loading...</div>}

                  {categoriesError && (
                    <div className="px-4 py-2 text-sm text-red-500">
                      Error
                      <button
                        onClick={() => refetchCategories()}
                        className="text-green-600 block text-xs"
                      >
                        Coba lagi
                      </button>
                    </div>
                  )}

                  {categories.map((cat: Category) => {
                    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return (
                      <Link
                        key={cat.id}
                        href={`/Kategori/${slug}`}
                        className="block px-4 py-2 text-sm hover:bg-green-50 transition-colors duration-150"
                      >
                        {cat.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </li>

            <li><Link href="/Tentang" className="hover:text-green-600 transition-colors duration-200">Tentang</Link></li>
            <li><Link href="/Contact" className="hover:text-green-600 transition-colors duration-200">Contact</Link></li>

            {isLoggedIn && <li><Link href="/Profile" className="hover:text-green-600 transition-colors duration-200">Profile</Link></li>}
            {isAdmin && <li><Link href="/admin" className="hover:text-green-600 transition-colors duration-200">Admin Dashboard</Link></li>}
          </ul>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <CartIcon />

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link
                href="/Auth"
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* MOBILE NAV */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <nav className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo2.png" width={30} height={30} alt="Logo" />
            <span className="text-lg font-bold text-green-600">Chilla By SmoethieVibe</span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="w-full bg-white border-b border-gray-200 transition-all duration-300 ease-in-out">
            <ul className="flex flex-col gap-3 px-4 py-3 text-sm text-gray-700">
              <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>

              {/* Kategori */}
              <li>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <span>Kategori</span>
                    <ChevronDown size={14} className="group-open:rotate-180" />
                  </summary>
                  <div className="mt-2 ml-4 space-y-2">
                    <Link href="/Kategori" onClick={() => setIsMobileMenuOpen(false)}>Semua Menu</Link>

                    {categoriesLoading && <div className="text-xs text-gray-500">Loading...</div>}

                    {categoriesError && (
                      <div className="text-xs text-red-500">
                        Error
                        <button
                          onClick={() => refetchCategories()}
                          className="text-green-600 block text-xs"
                        >
                          Coba lagi
                        </button>
                      </div>
                    )}

                    {categories.map((cat: Category) => {
                      const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      return (
                        <Link
                          key={cat.id}
                          href={`/Kategori/${slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-sm hover:bg-green-50"
                        >
                          {cat.name}
                        </Link>
                      );
                    })}
                  </div>
                </details>
              </li>

              <li><Link href="/Tentang" onClick={() => setIsMobileMenuOpen(false)}>Tentang</Link></li>
              <li><Link href="/Contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>

              {isLoggedIn && <li><Link href="/Profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link></li>}
              {isAdmin && <li><Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link></li>}

              <li className="pt-2 border-t border-gray-200">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 w-full"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/Auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 text-center"
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="w-full h-[55px]" />
    </>
  );
}