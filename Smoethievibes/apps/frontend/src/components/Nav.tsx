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
  Info, // <--- Sudah di-import
} from "lucide-react";

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
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo2.png" alt="Logo" width={38} height={38} className="object-cover rounded-full border border-black/10" />
            <span className="text-xl font-semibold tracking-wide text-black">Smoethie Vibe</span>
          </Link>

          {/* Navigasi Utama */}
          <ul className="flex items-center gap-8 text-black/70 text-[15px] font-medium">
            <li className="hover:text-black transition"><Link href="/">Home</Link></li>
            
            {/* START DROPDOWN KATEGORI */}
            <li 
              className="relative"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-black transition focus:outline-none">
                Kategori
                <ChevronDown size={16} className={`transform transition-transform ${isCategoryOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>

              {isCategoryOpen && (
                <div className="
                  absolute top-full left-1/2 -translate-x-1/2 mt-3 w-40
                  bg-white rounded-lg shadow-xl border border-black/10
                  overflow-hidden
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
                </div>
              )}
            </li>
            {/* END DROPDOWN KATEGORI */}

            {/* TAMBAHAN 1: Tautan 'Tentang' di Desktop */}
            <li className="hover:text-black transition"><Link href="/Tentang">Tentang</Link></li>
            
            <li className="hover:text-black transition"><Link href="/Contact">Contact</Link></li>
            {isLoggedIn && <li className="hover:text-black transition"><Link href="/Profile">Profile</Link></li>}
            {isAdmin && <li className="hover:text-black transition"><Link href="/admin/dashboard">Admin Dashboard</Link></li>}
          </ul>

          {/* CTA Buttons (Sign In or Logout) */}
          <div className="flex items-center gap-3">
            {!loading && (
              isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-700 transition inline-flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <Link
                  href="/Auth"
                  className="bg-black text-white font-semibold px-6 py-2 rounded-full hover:bg-black/80 transition inline-block text-center"
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
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo2.png" alt="Logo" width={34} height={34} className="rounded-full border border-black/10" />
          <span className="text-[17px] font-semibold text-black">Smoethie Vibe</span>
        </Link>

        {/* Sign Up or Logout */}
        {!loading && (
          isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-red-700 transition inline-flex items-center gap-1"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <Link
              href="/Auth"
              className="bg-black text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-black/80 transition inline-block text-center"
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
        
        {/* TAMBAHAN 2: Tautan 'Tentang' di Mobile */}
        <NavItem href="/Tentang" label="Tentang" icon={<Info />} /> 
        
        <NavItem href="/Contact" label="Contact" icon={<MessageSquare />} />
        {isLoggedIn && <NavItem href="/Profile" label="Profile" icon={<User />} />}
        {isAdmin && <NavItem href="/admin/dashboard" label="Admin" icon={<Settings />} />}
      </nav>
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