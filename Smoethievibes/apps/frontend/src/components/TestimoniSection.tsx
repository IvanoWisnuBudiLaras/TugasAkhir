// components/TestimoniPelanggan.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react"; // Import Quote dan Star

// Data Testimoni (Disesuaikan untuk review produk kafe)
const reviewData = [
  {
    nama: "Wisnu Ibrahimma F.",
    rating: 5,
    img: "/Profile/Profil.jpeg", // Gunakan foto profil
    pesan: "Smoothie Bowl-nya luar biasa! Rasanya segar, porsinya pas, dan toppingnya premium. Benar-benar *vibe* sehat yang saya cari.",
    order: "Smoothie Bowl"
  },
  {
    nama: "Rayhan Fathurrahman R.",
    rating: 5,
    img: "/Menu/green dream.png", // Gantilah dengan URL foto profil jika ada
    pesan: "Green Dream adalah jus detox terbaik yang pernah saya coba. Energinya terasa sepanjang hari. Pelayanan di kafe juga ramah!",
    order: "Green Dream Juice"
  },
  {
    nama: "Suyuful Bitriq A.",
    rating: 4,
    img: "/Menu/salad sayur.png", // Gantilah dengan URL foto profil jika ada
    pesan: "Salad Sayur dan Ayamnya enak dan mengenyangkan. Hanya saja antrian agak panjang saat jam makan siang. Rekomended!",
    order: "Crispy Chicken UP"
  },
];

// Komponen Rating Bintang
const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex justify-center md:justify-start">
            {[...Array(5)].map((_, i) => (
                <Star 
                    key={i} 
                    size={18} 
                    className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                />
            ))}
        </div>
    );
};


export function Testimoni() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-2">
          Apa Kata Pelanggan Kami?
        </h2>

        <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Lihat ulasan jujur tentang kelezatan menu dan kenyamanan *vibe* kafe SmoethieVibe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewData.map((t, i) => (
            <div 
                key={i} 
                className="bg-gray-50 p-6 rounded-xl shadow-lg border-t-4 border-green-500
                           hover:shadow-xl transition-shadow duration-300"
            >
              
              {/* Pesan Testimoni */}
              <div className="relative mb-5">
                <Quote className="absolute -top-4 -left-3 w-8 h-8 text-green-200 opacity-70 rotate-180" />
                <p className="text-gray-700 leading-relaxed italic relative z-10">
                    "{t.pesan}"
                </p>
                <Quote className="absolute bottom-0 right-0 w-8 h-8 text-green-200 opacity-70" />
              </div>
              
              {/* Rating */}
              <StarRating rating={t.rating} />

              <div className="flex items-center mt-5 pt-4 border-t border-gray-200">
                {/* Gambar Profil */}
                <div className="w-12 h-12 relative mr-4">
                    <Image
                        src={t.img}
                        alt={t.nama}
                        fill
                        sizes="50px"
                        className="rounded-full object-cover border-2 border-green-500"
                    />
                </div>

                {/* Nama dan Menu yang Dipesan */}
                <div>
                  <h3 className="font-bold text-gray-900 leading-none">{t.nama}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Pesan: <span className="font-semibold text-green-600">{t.order}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}