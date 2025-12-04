// components/Footer.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Instagram, Youtube, Facebook, MapPin } from "lucide-react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");

  // Handler untuk simulasi subscribe newsletter
  const handleSubscribe = () => {
    if (email && email.includes('@')) {
      alert(`Terima kasih! Email '${email}' telah didaftarkan untuk newsletter SmoethieVibe.`);
      setEmail('');
    } else {
      alert("Mohon masukkan alamat email yang valid.");
    }
  };


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    // Redesign: Menggunakan latar belakang putih atau abu-abu muda yang lebih cerah
    <footer className="w-full bg-gray-100 text-gray-700 border-t border-green-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-5 gap-10">

        {/* Brand & Newsletter (Kolom 1 & 2) */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-extrabold text-green-600 mb-2">
            SmoethieVibe
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Dapatkan inspirasi resep sehat, promosi menu baru, dan info event kafe terbaru langsung ke kotak masuk Anda.
          </p>

          {/* Input Newsletter */}
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Email Anda"
              aria-label="Alamat Email untuk Newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-green-500 transition text-gray-800"
            />
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
              onClick={handleSubscribe}
              aria-label="Subscribe Newsletter"
            >
              <Mail size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4 mt-8">
            <Link href="#" aria-label="Instagram">
              <Instagram className="text-gray-500 hover:text-green-600 cursor-pointer transition" size={24} />
            </Link>
            <Link href="#" aria-label="YouTube">
              <Youtube className="text-gray-500 hover:text-red-600 cursor-pointer transition" size={24} />
            </Link>
            <Link href="#" aria-label="Facebook">
              <Facebook className="text-gray-500 hover:text-blue-600 cursor-pointer transition" size={24} />
            </Link>
            <Link href="#" aria-label="Lokasi Kafe">
              <MapPin className="text-gray-500 hover:text-orange-500 cursor-pointer transition" size={24} />
            </Link>
          </div>
        </div>

        {/* Section Links (Disesuaikan untuk Kafe) */}
        <FooterSection
          title="Menu Cepat"
          // Mengganti konten menjadi kategori menu Anda
          items={[
            { name: "Semua Menu", href: "/Kategori" },
            { name: "Smoothie Terbaik", href: "/Kategori/smoothie" },
            { name: "Makanan Sehat", href: "/Kategori/makanan" },
            { name: "Jus Detox", href: "/Kategori/minuman" },
          ]}
        />
        <FooterSection
          title="Bantuan"
          // Mengganti konten menjadi info kafe
          items={[
            { name: "FAQs", href: "#" },
            { name: "Jam Operasional", href: "/Contact" },
            { name: "Kebijakan Privasi", href: "#" },
            { name: "Cara Order", href: "#" },
          ]}
        />
        <FooterSection
          title="Perusahaan"
          // Mengganti konten menjadi info tentang perusahaan
          items={[
            { name: "Tentang Kami", href: "/Tentang" },
            { name: "Kontak Kafe", href: "/Contact" },
            { name: "Karier", href: "#" },
            { name: "Mitra Bisnis", href: "#" },
          ]}
        />
      </div>

      {/* Footer Bawah */}
      <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-600">
        © 2025 SmoethieVibe Cafe. Semua Hak Dilindungi. Dibuat dengan 💚 di Jakarta.
      </div>
    </footer>
  );
}

// Komponen FooterSection diperbarui untuk menerima href
interface FooterItem {
  name: string;
  href: string;
}

function FooterSection({ title, items }: { title: string; items: FooterItem[] }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      <ul className="space-y-3 text-sm text-gray-600">
        {items.map((item) => (
          <li key={item.name}>
            <Link href={item.href} className="hover:text-green-600 transition">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}