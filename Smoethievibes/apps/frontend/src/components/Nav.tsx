"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Menu,
  MessageSquare,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Info,
  Plus,
  X,
} from "lucide-react";

import { CartIcon } from "./CartIcon";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type UserProfile = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  phone?: string | null;
  address?: string | null;
  role?: string;
};

// Definisikan kategori untuk dropdown - sekarang dengan state untuk bisa ditambah
const initialCategories = [
  { name: "Semua Menu", href: "/Kategori" },
  { name: "Makanan", href: "/Kategori/makanan" },
  { name: "Minuman", href: "/Kategori/minuman" },
  { name: "Smoothie", href: "/Kategori/smoothie" },
];

// Menu navigasi utama yang tetap
const mainNavItems = [
  { name: "Home", href: "/" },
  { name: "Tentang", href: "/Tentang" },
  { name: "Kontak", href: "/Contact" },
];

export default function Nav() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [navItems, setNavItems] = useState<{ name: string; href: string }[]>([]);
  const [categories, setCategories] = useState(initialCategories);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryHref, setNewCategoryHref] = useState("");

  // On mount, check if user is authenticated and fetch profile
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

  // Fetch navigation items from backend (optional endpoint), fallback to categories + static links
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

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const res = await fetch(`${API_URL}/nav`);
        if (!res.ok) throw new Error('No nav endpoint');
        const data = await res.json();
        setNavItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('No nav endpoint, using defaults', err);
        setNavItems([]);
      }
    };
    fetchNav();
  }, []);

  // Fungsi untuk menambah kategori baru
  const handleAddCategory = () => {
    if (newCategoryName.trim() && newCategoryHref.trim()) {
      const newCategory = {
        name: newCategoryName.trim(),
        href: `/Kategori/${newCategoryHref.trim().toLowerCase()}`
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setNewCategoryHref("");
      setShowAddCategory(false);
    }
  };

  // Effect untuk menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isCategoryOpen && !target.closest('.category-dropdown')) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryOpen]);

  return (
    <>
      {/* DESKTOP NAV */}
      <header className="
        hidden md:block
        fixed top-0 left-0 w-full z-50
        bg-white/70 backdrop-blur-xl 
        border-b border-black/10
      ">
        <nav className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Smoethie Vibe Home">
            <Image src="/logo2.png" alt="Smoethie Vibe Logo" width={38} height={38} className="object-cover rounded-full border border-black/10" />
            <span className="text-xl font-semibold tracking-wide text-black">Smoethie Vibe</span>
          </Link>

          {/* Navigasi Utama */}
          <ul className="flex items-center gap-8 text-black/70 text-[15px] font-medium">
            {/* Menu utama: Home, Tentang, Kontak */}
            {mainNavItems.map((item) => (
              <li key={item.href} className="hover:text-black transition">
                <Link href={item.href}>{item.name}</Link>
              </li>
            ))}

            {/* NavItems dari backend (jika ada) */}
            {(navItems.length ? navItems : []).map((ni) => (
              <li key={ni.href} className="hover:text-black transition">
                <Link href={ni.href}>{ni.name}</Link>
              </li>
            ))}

            {/* START DROPDOWN KATEGORI dengan fitur tambah kategori */}
            <li className="relative category-dropdown">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-1 hover:text-black transition focus:outline-none focus:text-black"
                aria-expanded={isCategoryOpen}
                aria-haspopup="true"
                aria-label="Kategori Menu"
              >
                Kategori
                <ChevronDown size={16} className={`transform transition-transform ${isCategoryOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>

              {isCategoryOpen && (
                <div className="
                  absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48
                  bg-white rounded-lg shadow-xl border border-black/10
                  overflow-hidden z-50
                ">
                  {categories.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsCategoryOpen(false)}
                      className="block px-4 py-2 text-sm text-black/80 hover:bg-gray-100 transition"
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Tombol tambah kategori untuk admin */}
                  {isAdmin && (
                    <>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={() => {
                          setShowAddCategory(true);
                          setIsCategoryOpen(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100 transition flex items-center gap-2"
                      >
                        <Plus size={14} />
                        Tambah Kategori
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>

            {isLoggedIn && <li className="hover:text-black transition"><Link href="/Profile">Profile</Link></li>}
            {isAdmin && <li className="hover:text-black transition"><Link href="/admin/dashboard">Admin Dashboard</Link></li>}
          </ul>

          {/* CTA Buttons (Sign In or Logout) */}
          <div className="flex items-center gap-4">
            <CartIcon />
            {!loading && (
              isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-700 transition inline-flex items-center gap-2"
                  aria-label="Logout"
                >
                  <LogOut size={18} aria-hidden="true" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/Auth"
                  className="bg-black text-white font-semibold px-6 py-2 rounded-full hover:bg-black/80 transition inline-block text-center"
                  aria-label="Sign In"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        </nav>
      </header>

      {/* MOBILE TOP NAV (LOGO + SIGN UP/LOGOUT) */}
      <header className="
        md:hidden
        fixed top-0 left-0 w-full z-50
        bg-white/80 backdrop-blur-xl
        border-b border-black/10
        px-5 py-3
        flex items-center justify-between
      ">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Smoethie Vibe Home">
          <Image src="/logo2.png" alt="Smoethie Vibe Logo" width={34} height={34} className="rounded-full border border-black/10" />
          <span className="text-[17px] font-semibold text-black">Smoethie Vibe</span>
        </Link>

        {/* Sign Up or Logout */}
        {!loading && (
          isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-red-700 transition inline-flex items-center gap-1"
              aria-label="Logout"
            >
              <LogOut size={16} aria-hidden="true" />
              Logout
            </button>
          ) : (
            <Link
              href="/Auth"
              className="bg-black text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-black/80 transition inline-block text-center"
              aria-label="Sign Up"
            >
              Sign Up
            </Link>
          )
        )}
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="
        md:hidden
        fixed bottom-4 left-1/2 -translate-x-1/2
        w-[90%]
        bg-white/80 backdrop-blur-xl
        border border-black/10
        rounded-3xl
        px-6 py-3
        shadow-lg
        flex justify-between
        z-50
      ">
        <NavItem href="/" label="Home" icon={<Home />} />
        <NavItem href="/Kategori" label="Menu" icon={<Menu />} />
        <NavItem href="/Tentang" label="Tentang" icon={<Info />} />
        <NavItem href="/Contact" label="Kontak" icon={<MessageSquare />} />
        {isLoggedIn && <NavItem href="/Profile" label="Profile" icon={<User />} />}
        {isAdmin && <NavItem href="/admin" label="Admin" icon={<Settings />} />}
      </nav>

      {/* Modal Tambah Kategori */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90%]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tambah Kategori Baru</h3>
              <button
                onClick={() => setShowAddCategory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Contoh: Dessert"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug URL (tanpa spasi)
                </label>
                <input
                  type="text"
                  value={newCategoryHref}
                  onChange={(e) => setNewCategoryHref(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Contoh: dessert"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddCategory(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button
                onClick={handleAddCategory}
                className="flex-1 px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// TYPE SAFE NAV ITEM (TSX)
interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function NavItem({ href, label, icon }: NavItemProps) {
  return (
    <Link
      href={href}
      className="
        group
        flex flex-col items-center gap-1
        text-[12px]
        font-medium
      "
      aria-label={label}
    >
      {/* ICON WRAPPER */}
      <div className="
        w-11 h-11
        rounded-2xl
        flex items-center justify-center
        bg-white/70 backdrop-blur-md
        border border-black/5
        shadow-sm
        group-hover:scale-110
        group-hover:shadow-md
        transition-all duration-300
      ">
        <span className="
          text-black/70
          group-hover:text-green-500
          transition
        ">
          {icon}
        </span>
      </div>

      {/* LABEL */}
      <span className="
        text-black/60
        group-hover:text-green-500
        transition
      ">
        {label}
      </span>
    </Link>
  );
}