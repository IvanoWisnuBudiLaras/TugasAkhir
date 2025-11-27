"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Menu,
  MessageSquare,
  User,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

const categories = [
  { name: "Semua Menu", href: "/Kategori/semua" },
  { name: "Makanan", href: "/Kategori/makanan" },
  { name: "Minuman", href: "/Kategori/minuman" },
  { name: "Smoothie", href: "/Kategori/smoothie" },
];

export default function Nav() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <>
      {/* DESKTOP NAV */}
      <header
        className="
        hidden md:block
        fixed top-0 left-0 w-full z-50
        bg-white/70 backdrop-blur-xl 
        border-b border-black/10
      "
      >
        <nav className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={38}
              height={38}
              className="object-cover rounded-full border border-black/10"
            />
            <span className="text-xl font-semibold tracking-wide text-black">
              Smoethie Vibe
            </span>
          </Link>

          <ul className="flex items-center gap-8 text-black/70 text-[15px] font-medium">
            <li className="hover:text-black transition">
              <Link href="/">Home</Link>
            </li>

            {/* FIXED DROPDOWN — TIDAK HILANG SAAT MAU DIKLIK */}
            <li>
              <div
                className="relative"
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-black transition">
                  Kategori
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${
                      isCategoryOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {isCategoryOpen && (
                  <div
                    className="
                      absolute top-full left-1/2 -translate-x-1/2 mt-3 w-40
                      bg-white rounded-lg shadow-xl border border-black/10
                      overflow-hidden
                    "
                  >
                    {categories.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-black/80 hover:bg-gray-100 transition"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>

            <li className="hover:text-black transition">
              <Link href="/Contact">Contact</Link>
            </li>
            <li className="hover:text-black transition">
              <Link href="/Profile">Profile</Link>
            </li>
          </ul>

          <div>
            <Link
              href="/Auth"
              className="
                bg-black text-white font-semibold px-6 py-2 rounded-full 
                hover:bg-black/80 transition
              "
            >
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      {/* MOBILE TOP NAV */}
      <header
        className="
        md:hidden
        fixed top-0 left-0 w-full z-50
        bg-white/80 backdrop-blur-xl
        border-b border-black/10
        px-5 py-3
        flex items-center justify-between
      "
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo2.png"
            alt="Logo"
            width={34}
            height={34}
            className="rounded-full border border-black/10"
          />
          <span className="text-[17px] font-semibold text-black">
            Smoethie Vibe
          </span>
        </Link>

        <Link
          href="/Auth"
          className="bg-black text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-black/80 transition"
        >
          Sign Up
        </Link>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav
        className="
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
      "
      >
        <NavItem href="/" label="Home" icon={<Home />} />
        <NavItem href="/Kategori/semua" label="Menu" icon={<Menu />} />
        <NavItem href="/Contact" label="Contact" icon={<MessageSquare />} />
        <NavItem href="/Profile" label="Profile" icon={<User />} />
      </nav>
    </>
  );
}

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
      <div
        className="
          w-11 h-11 rounded-2xl flex items-center justify-center
          bg-white/70 backdrop-blur-md border border-black/5 shadow-sm
          group-hover:scale-110 group-hover:shadow-md
          transition-all duration-300
        "
      >
        <span className="text-black/70 group-hover:text-green-500 transition">
          {icon}
        </span>
      </div>

      <span className="text-black/60 group-hover:text-green-500 transition">
        {label}
      </span>
    </Link>
  );
}
