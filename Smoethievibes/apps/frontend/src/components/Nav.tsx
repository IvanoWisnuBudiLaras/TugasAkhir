"use client";

import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">

      {/* Blur sisi kiri-kanan */}
      <div className="absolute inset-0 backdrop-blur-2xl -z-10 bg-transparent"></div>

      <div className="w-full flex justify-center pointer-events-auto">

        {/* Navbar utama */}
        <nav
          className="
            w-[70%]
            max-w-6xl
            bg-black/20
            backdrop-blur-2xl
            border border-white/10
            px-10 py-4
            rounded-[3rem]
            shadow-[0_12px_40px_rgba(0,0,0,0.35)]
            flex items-center justify-between
          "
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <Image
                src="/logo2.png"
                alt="Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>

            <span className="text-black font-semibold text-lg tracking-wide">
              Smoethie Vibe
            </span>
          </Link>

          {/* Navigation */}
          <ul className="hidden md:flex items-center gap-10 text-black/80 text-sm font-medium">
            <li className="hover:text-black transition"><Link href="/">Home</Link></li>
            <li className="hover:text-black transition"><Link href="/Menu">Menu</Link></li>
            <li className="hover:text-black transition"><Link href="/Contact">Contact</Link></li>
            <li className="hover:text-black transition"><Link href="/Profile">Profile</Link></li>
          </ul>

          {/* CTA → menuju halaman Sign Up */}
          <Link href="/SignUp">
            <button
              className="
                bg-yellow-300 text-black font-semibold
                px-7 py-2 rounded-full
                shadow-[0_0_25px_rgba(255,255,0,0.65)]
                hover:bg-yellow-400 transition
              "
            >
              Sign In
            </button>
          </Link>

        </nav>

      </div>
    </header>
  );
}
