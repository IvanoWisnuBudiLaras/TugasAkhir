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
} from "lucide-react";

// Reusable NavItem component
interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}
function NavItem({ href, label, icon }: NavItemProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-1 text-[12px] font-medium"
    >
      {/* ICON WRAPPER */}
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/70 backdrop-blur-md border border-black/5 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
        <span className="text-black/70 group-hover:text-green-500 transition">{icon}</span>
      </div>
      {/* LABEL */}
      <span className="text-black/60 group-hover:text-green-500 transition">{label}</span>
    </Link>
  );
}

export default function Nav() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client side
    const stored = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(stored);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setToken(null);
    router.push("/Auth");
  };

  return (
    <>
      {/* DESKTOP NAV */}
      <header className="hidden md:block fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-black/10">
        <nav className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo2.png" alt="Logo" width={38} height={38} className="object-cover rounded-full border border-black/10" />
            <span className="text-xl font-semibold tracking-wide text-black">Smoethie Vibe</span>
          </Link>

          {/* Navigation */}
          <ul className="flex items-center gap-8 text-black/70 text-[15px] font-medium">
            <li className="hover:text-black transition"><Link href="/">Home</Link></li>
            <li className="hover:text-black transition"><Link href="/Menu">Menu</Link></li>
            <li className="hover:text-black transition"><Link href="/Contact">Contact</Link></li>
            {token && (<li className="hover:text-black transition"><Link href="/Profile">Profile</Link></li>)}
          </ul>

          {/* Auth actions */}
          <div className="flex items-center gap-4">
            {token ? (
              <button
                onClick={handleLogout}
                className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-full hover:bg-gray-700 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/Auth"
                className="bg-black text-white font-semibold px-6 py-2 rounded-full hover:bg-black/80 transition inline-block text-center"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* MOBILE TOP NAV (LOGO + SIGN IN/OUT) */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-black/10 px-5 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo2.png" alt="Logo" width={34} height={34} className="rounded-full border border-black/10" />
          <span className="text-[17px] font-semibold text-black">Smoethie Vibe</span>
        </Link>
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white text-sm font-semibold px-3 py-1 rounded-full hover:bg-gray-700 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/Auth"
            className="bg-black text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-black/80 transition"
          >
            Sign In
          </Link>
        )}
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white/80 backdrop-blur-xl border border-black/10 rounded-3xl px-6 py-3 shadow-lg flex justify-between z-50">
        <NavItem href="/" label="Home" icon={<Home />} />
        <NavItem href="/Menu" label="Menu" icon={<Menu />} />
        <NavItem href="/Contact" label="Contact" icon={<MessageSquare />} />
        {token && <NavItem href="/Profile" label="Profile" icon={<User />} />}
      </nav>
    </>
  );
}
