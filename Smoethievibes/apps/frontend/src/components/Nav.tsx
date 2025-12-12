"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import {
    Menu,
    LogOut,
    ChevronDown,
    X, // Tambahkan ikon X untuk menutup menu
} from "lucide-react";

import { CartIcon } from "./CartIcon"; // Asumsi CartIcon sudah diimpor dengan benar
=======
import { Menu, LogOut, ChevronDown, X } from "lucide-react";
import { CartIcon } from "./CartIcon";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES} from "../lib/graphql/queries";
import { useAuth } from "@/lib/context";
>>>>>>> parent of d49fd36 (Refactor backend and frontend to use REST API, add error handling)


<<<<<<< HEAD
type UserProfile = {
    id: string;
    email: string;
    name?: string | null;
    avatar?: string | null;
    phone?: string | null;
    address?: string | null;
    role?: string;
};

// Definisikan kategori untuk dropdown
const categories = [
    { name: "Semua Menu", href: "/Kategori" },
    { name: "Makanan", href: "/Kategori/makanan" },
    { name: "Minuman", href: "/Kategori/minuman" },
    { name: "Smoothie", href: "/Kategori/smoothie" },
];


export default function Nav() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State untuk menu mobile

    // ... (useEffect dan handleLogout tetap sama)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch profile');
                const profile: UserProfile = await res.json();
                setIsLoggedIn(true);
                setIsAdmin(profile.role === 'ADMIN');
            } catch (error) {
                console.error('Error fetching profile:', error);
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

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
            router.push('/');
        }
    };
    // ...

    const closeMobileMenu = () => setIsMobileMenuOpen(false);


    // -----------------------------------------------------------------------------------------------------------------

=======
// ----------- NAV YANG SUDAH DIPERBAIKI TOTAL -----------
// Type untuk kategori
interface Category {
  id: string;
  name: string;
}

export default function Nav() {
  const { user, isAuthenticated, logout } = useAuth();

  // UI State
  const [hydrated, setHydrated] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hindari fetch sebelum hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // ----------- QUERY: CATEGORIES -----------
  const {
    loading: categoriesLoading,
    data: categoriesData,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery(GET_CATEGORIES, {
    ssr: false,
    skip: !hydrated, // jangan fetch sebelum client siap
    fetchPolicy: "cache-first",
    errorPolicy: "all",
  });

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  if (!hydrated) {
    // hindari layout shifting yang bikin login kedip
>>>>>>> parent of d49fd36 (Refactor backend and frontend to use REST API, add error handling)
    return (
        <>
            {/* 1. DESKTOP NAV */}
            <header className="
                hidden md:block
                fixed top-0 left-0 w-full z-50
                bg-white/90 backdrop-blur-md 
                border-b border-gray-200
            ">
                <nav className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/logo2.png" alt="Logo" width={38} height={38} className="object-cover rounded-full border border-gray-200" />
                        <span className="text-xl font-bold tracking-wide text-green-600">SmoethieVibe</span>
                    </Link>

<<<<<<< HEAD
                    {/* Navigasi Utama */}
                    <ul className="flex items-center gap-8 text-black/70 text-[15px] font-medium">
                        <li className="hover:text-green-600 transition"><Link href="/">Home</Link></li>
=======
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo2.png" width={38} height={38} alt="Logo" />
            <span className="text-xl font-bold text-green-600">SmoethieVibe</span>
          </Link>
>>>>>>> parent of d49fd36 (Refactor backend and frontend to use REST API, add error handling)

                        {/* START DROPDOWN KATEGORI */}
                        <li
                            className="relative"
                            onMouseEnter={() => setIsCategoryOpen(true)}
                            onMouseLeave={() => setIsCategoryOpen(false)}
                        >
                            <button className="flex items-center gap-1 hover:text-green-600 transition focus:outline-none">
                                Kategori
                                <ChevronDown size={16} className={`transform transition-transform ${isCategoryOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </button>

                            {isCategoryOpen && (
                                <div className="
                                    absolute top-full left-1/2 -translate-x-1/2 mt-3 w-40
                                    bg-white rounded-lg shadow-xl border border-gray-100
                                    overflow-hidden
                                ">
                                    {categories.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsCategoryOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </li>
                        {/* END DROPDOWN KATEGORI */}

                        <li className="hover:text-green-600 transition"><Link href="/Tentang">Tentang</Link></li>
                        <li className="hover:text-green-600 transition"><Link href="/Contact">Contact</Link></li>
                        {isLoggedIn && <li className="hover:text-green-600 transition"><Link href="/Profile">Profile</Link></li>}
                        {isAdmin && <li className="hover:text-green-600 transition"><Link href="/admin/dashboard">Admin Dashboard</Link></li>}
                    </ul>

                    {/* CTA Buttons (Sign In or Logout) */}
                    <div className="flex items-center gap-4">
                        <CartIcon />
                        {!loading && (
                            isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-600 transition inline-flex items-center gap-2"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    href="/Auth"
                                    className="bg-green-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-green-700 transition inline-block text-center"
                                >
                                    Sign In
                                </Link>
                            )
                        )}
                    </div>
                </nav>
            </header>

<<<<<<< HEAD
            {/* 2. MOBILE TOP NAV (LOGO + HAMBURGER) */}
            <header className="
                md:hidden
                fixed top-0 left-0 w-full z-50
                bg-white/90 backdrop-blur-md
                border-b border-gray-200
                px-5 py-3
                flex items-center justify-between
            ">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                    <Image src="/logo2.png" alt="Logo" width={34} height={34} className="rounded-full border border-gray-200" />
                    <span className="text-[17px] font-bold text-green-600">SmoethieVibe</span>
                </Link>

                {/* Hamburger Button & Cart Icon (ditempatkan di sini agar tidak terulang di menu) */}
                <div className="flex items-center gap-3">
                    {/* Perbaiki potensi nested 'a' dengan hanya menampilkan CartIcon di sini (jika CartIcon sudah memiliki Link internal) */}
                    <CartIcon /> 
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-md bg-gray-100 border border-gray-200 text-green-600 hover:bg-gray-200 transition"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
=======
                  {categoriesData?.categories?.map((cat: Category) => {
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
>>>>>>> parent of d49fd36 (Refactor backend and frontend to use REST API, add error handling)
                </div>
            </header>

            {/* 3. MOBILE SIDEBAR/FULL MENU (HAMBURGER) */}
            <nav className={`
                fixed top-[60px] left-0 h-screen w-full z-40
                bg-white/95 backdrop-blur-sm
                p-8 md:hidden
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <ul className="flex flex-col gap-6 text-xl font-semibold text-gray-700">
                    <li onClick={closeMobileMenu} className="hover:text-green-600 transition border-b border-gray-100 pb-3"><Link href="/">Home</Link></li>
                    
                    {/* Menu Kategori di Mobile (Tidak perlu Dropdown penuh) */}
                    <li className="font-bold text-lg text-green-600 pt-2">Kategori</li>
                    {categories.map((item) => (
                         <li key={item.name} onClick={closeMobileMenu} className="pl-4 text-gray-600 hover:text-green-600 transition border-b border-gray-100 pb-3">
                             <Link href={item.href}>{item.name}</Link>
                         </li>
                    ))}

<<<<<<< HEAD
                    <li onClick={closeMobileMenu} className="hover:text-green-600 transition border-b border-gray-100 pb-3"><Link href="/Tentang">Tentang</Link></li>
                    <li onClick={closeMobileMenu} className="hover:text-green-600 transition border-b border-gray-100 pb-3"><Link href="/Contact">Contact</Link></li>
                    
                    {/* Opsi Login/Profile/Admin */}
                    {!loading && (
                        isLoggedIn ? (
                            <>
                                <li onClick={closeMobileMenu} className="hover:text-green-600 transition border-b border-gray-100 pb-3"><Link href="/Profile">Profile</Link></li>
                                {isAdmin && <li onClick={closeMobileMenu} className="hover:text-green-600 transition border-b border-gray-100 pb-3"><Link href="/admin/dashboard">Admin Dashboard</Link></li>}
                                <li className="pt-4">
                                    <button
                                        onClick={() => { handleLogout(); closeMobileMenu(); }}
                                        className="w-full bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 transition flex items-center justify-center gap-2"
                                    >
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="pt-4">
                                <Link
                                    href="/Auth"
                                    onClick={closeMobileMenu}
                                    className="w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition flex items-center justify-center text-center"
                                >
                                    Sign In
                                </Link>
                            </li>
                        )
                    )}
                </ul>
            </nav>
        </>
    );
=======
            {isAuthenticated && <li><Link href="/Profile" className="hover:text-green-600 transition-colors duration-200">Profile</Link></li>}
            {user?.role === 'ADMIN' && <li><Link href="/admin" className="hover:text-green-600 transition-colors duration-200">Admin Dashboard</Link></li>}
          </ul>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <CartIcon />

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link
                href="/Auth/simple-page"
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
            <span className="text-lg font-bold text-green-600">SmoethieVibe</span>
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

                    {categoriesData?.categories?.map((cat: Category) => {
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

              {isAuthenticated && <li><Link href="/Profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link></li>              {user?.role === 'ADMIN' && <li><Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link></li>}

              <li className="pt-2 border-t border-gray-200">
                {isAuthenticated ? (
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
                    href="/Auth/simple-page"
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
      <div className="h-[55px]" />
    </>
  );
>>>>>>> parent of d49fd36 (Refactor backend and frontend to use REST API, add error handling)
}