"use client";
import React, { useEffect, useRef } from "react";

const kategoriMenu = [
  { nama: "Smoothie Bowl", img: "/Landing/Crispy Chiken Up.png", item_count: 8 },
  { nama: "Jus Detox Segar", img: "/Landing/Roasted chiken Up with mashed potato.png", item_count: 12 },
  { nama: "Snack Sehat", img: "/Landing/Swedia Meetball.png", item_count: 5 },
  { nama: "Smoothie Klasik", img: "/Landing/kasir1.jpg", item_count: 15 },
  { nama: "Menu Musiman", img: "/Landing/strawberry matcha yogurt.jpg", item_count: 4 },
];

export function Portrait() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll horizontal tiap 2 detik
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll) {
        // Reset ke awal jika sudah mentok
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Scroll ke kanan 230px (lebar card)
        container.scrollBy({ left: 230, behavior: "smooth" });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16">
      <h2 className="text-center text-3xl font-bold mb-10">
        Jelajahi Hidangan Berdasarkan Kategori
      </h2>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 px-4 scrollbar-hide scroll-smooth"
      >
        {kategoriMenu.map((item, i) => (
          <div
            key={i}
            className="min-w-[230px] cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="w-full h-60 rounded-xl overflow-hidden shadow-lg">
              <img
                src={item.img}
                alt={item.nama}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mt-3 font-semibold text-center">{item.nama}</p>
            <p className="text-center text-sm text-gray-500">{item.item_count} item</p>
          </div>
        ))}
      </div>
    </section>
  );
}
