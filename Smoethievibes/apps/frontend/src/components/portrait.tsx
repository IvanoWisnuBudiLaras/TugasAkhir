// components/CafePortrait.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatedHeading, AnimatedParagraph } from "./animations";

// Redesain data: Mengganti menu menjadi foto tempat/vibe kafe
const cafePhotos = [
  { 
    title: "Zona Santai", 
    img: "/Landing/kasir1.jpg", 
    alt: "Foto meja dan kursi kayu di sudut kafe yang nyaman.",
    tag: "Interior"
  },
  { 
    title: "Sudut Penuh Cahaya", 
    img: "/Landing/kasir1.jpg", 
    alt: "Area bar smoothie dengan cahaya alami yang masuk.",
    tag: "Bar"
  },
  { 
    title: "Meja Komunal", 
    img: "/Landing/kasir1.jpg", 
    // FIX: Menambahkan properti 'alt' yang hilang
    alt: "Meja panjang komunal untuk bekerja atau berkumpul.", 
    tag: "Co-Working"
  },
  { 
    title: "Kasir & Display", 
    img: "https://res.cloudinary.com/dogx3ps3r/image/upload/v1765320820/IMG_20251115_090056_mnxuzg.jpg", 
    // FIX: Menambahkan properti 'alt' yang hilang
    alt: "Area kasir dengan display makanan ringan sehat.", 
    tag: "Pelayanan"
  },
  { 
    title: "Teras Kafe", 
    img: "/Landing/kasir1.jpg", 
    alt: "Area teras luar ruangan dengan tanaman hijau.",
    tag: "Outdoor"
  },
];

// Data diduplikasi untuk menciptakan efek infinity loop
const duplicatedPhotos = [...cafePhotos, ...cafePhotos];

export function CafePortrait() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;
    // Kecepatan sangat pelan: 0.5 pixels per frame
    const scrollSpeed = 0.5; 

    // Total lebar konten asli (setengah dari lebar scroll total)
    let singleSetWidth = 0;

    const calculateWidth = () => {
        // Menghitung lebar konten duplikat yang sebenarnya setelah di-render
        if (container.scrollWidth > 0 && container.clientWidth > 0) {
            singleSetWidth = container.scrollWidth / 2;
        }
    };
    
    // Fungsi animasi menggunakan requestAnimationFrame
    const animateScroll = () => {
        // 1. Hitung ulang lebar (opsional, untuk memastikan lebar)
        calculateWidth();

        // 2. Scroll ke kiri
        container.scrollLeft -= scrollSpeed;

        // 3. Cek kondisi reset (ketika set pertama sudah habis digulir)
        if (container.scrollLeft <= 0) {
            // Langsung pindah ke awal set kedua (setengah lebar)
            container.scrollLeft = singleSetWidth;
        }

        animationFrameId = requestAnimationFrame(animateScroll);
    };

    // Inisialisasi posisi: mulai dari awal set kedua (midway point)
    const initializePosition = () => {
        calculateWidth();
        if (singleSetWidth > 0) {
            container.scrollLeft = singleSetWidth;
            animateScroll();
        } else {
            // Jika lebar belum terhitung, coba lagi di frame berikutnya
            requestAnimationFrame(initializePosition);
        }
    };
    
    // Mulai inisialisasi
    requestAnimationFrame(initializePosition);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedHeading 
          level={2}
          className="text-center text-4xl font-extrabold text-gray-900 mb-4"
          delay={0.2}
        >
          Rasakan Vibe Kami
        </AnimatedHeading>
        <AnimatedParagraph 
          className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
          delay={0.4}
        >
          Tempat yang sempurna untuk ngopi, bekerja, atau sekadar menikmati smoothie terbaik di kota.
        </AnimatedParagraph>

        {/* Horizontal Scroll Gallery */}
        <div
          ref={scrollRef}
          // Hapus scroll-smooth karena animasi dikontrol oleh rAF
          className="flex overflow-x-hidden gap-6 pb-6 scrollbar-hide" 
        >
          {/* Mapping ke duplicatedPhotos */}
          {duplicatedPhotos.map((item, i) => (
            <div
              key={i} // Key unik untuk setiap item duplikat
              className="min-w-[280px] w-[280px] h-[350px] bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer 
                         hover:shadow-2xl transition-all duration-300 relative group"
            >
              
              {/* Image */}
              <div className="w-full h-full relative">
                <Image
                  src={item.img}
                  // Menggunakan properti alt yang kini dipastikan ada
                  alt={item.alt || item.title} 
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover brightness-100 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Overlay / Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 flex flex-col justify-end">
                <span className="text-xs font-medium text-white/70 uppercase tracking-widest mb-1">
                    {item.tag}
                </span>
                <h3 className="text-xl font-bold text-white leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}