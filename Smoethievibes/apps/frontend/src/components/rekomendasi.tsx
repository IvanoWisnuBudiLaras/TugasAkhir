"use client";
import React from "react";

const umkm = [
  {
    nama: "Toko Sri Dawe",
    rating: 4.8,
    kec: "Dawe",
    jam: "06.00 - 22.00",
    img: "/Menu/Cocoa Peanut Butter.jpg",
  },
  {
    nama: "Arfan Outfit Kudus",
    rating: 4.7,
    kec: "Dawe",
    jam: "09.00 - 21.00",
    img: "/Menu/Crispy Chiken Up.png",
  },
  {
    nama: "Dinda Store DS",
    rating: 4.4,
    kec: "Dawe",
    jam: "09.00 - 21.00",
    img: "/Menu/Roasted Chiken UP (roasted potato).png",
  },
];

export function Rekomendasi() {
  return (
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-4">
        Rekomendasi UMKM Kudus
      </h2>

      <p className="text-center text-gray-600 mb-12">
        UMKM pilihan yang layak kamu kunjungi di Kudus ✨
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {umkm.map((u, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          >
            <img src={u.img} className="h-48 w-full object-cover" />

            <div className="p-4">
              <p className="font-semibold text-lg">{u.nama}</p>

              {/* Rating */}
              <p className="text-yellow-500 text-sm flex items-center gap-1">
                ⭐ {u.rating}
              </p>

              {/* Kecamatan */}
              <p className="text-sm text-gray-600">{u.kec}</p>

              {/* Jam buka */}
              <p className="text-green-600 mt-2 text-sm font-semibold">
                Buka {u.jam}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
