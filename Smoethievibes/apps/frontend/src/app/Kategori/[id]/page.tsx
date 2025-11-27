"use client";

import Image from "next/image";
import React from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// DATA MENU
const products = [
  { id: 1, name: "Avocado Salad", kategori: "makanan", price: 25000, img: "/Menu/avocado salad.png" },
  { id: 2, name: "Cocoa Peanut Butter", kategori: "smoothie", price: 30000, img: "/Menu/Cocoa Peanut Butter.jpg" },
  { id: 3, name: "Crispy Chicken UP", kategori: "makanan", price: 28000, img: "/Menu/Crispy Chiken UP.png" },
  { id: 4, name: "Green Dream", kategori: "smoothie", price: 26000, img: "/Menu/green dream.png" },
  { id: 5, name: "Manggo Matcha Yogurt", kategori: "smoothie", price: 32000, img: "/Menu/manggo matcha yogurt.jpg" },
  { id: 6, name: "Mega Manggo", kategori: "minuman", price: 22000, img: "/Menu/mega manggo.jpg" },
  { id: 7, name: "Mushroom Sause", kategori: "makanan", price: 27000, img: "/Menu/mushrum saose.jpg" },
  { id: 8, name: "Salad Sayur", kategori: "makanan", price: 20000, img: "/Menu/salad sayur.png" },
  { id: 9, name: "Strawberry Dragon", kategori: "smoothie", price: 28000, img: "/Menu/strawberry dragon.png" },
  { id: 10, name: "Strawberry Matcha Yogurt", kategori: "smoothie", price: 30000, img: "/Menu/strawberry matcha yogurt.jpg" },
  { id: 11, name: "Sunrise Plate", kategori: "makanan", price: 23000, img: "/Menu/sunrise plate.png" },
  { id: 12, name: "Very Berry Smoothie", kategori: "smoothie", price: 27000, img: "/Menu/very bery smoethie.png" },
];

export default function Page({ params }: Props) {
  // 🔥 FIX: Unwrap params dari Promise
  const { id } = React.use(params);
  const category = id.toLowerCase();

  const filtered =
    category === "semua"
      ? products
      : products.filter((item) => item.kategori === category);

  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold capitalize">
        {category === "semua" ? "Semua Menu" : category}
      </h1>

      {filtered.length === 0 ? (
        <p className="mt-6 text-black/60">Belum ada menu di kategori ini.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-black/10 shadow-sm bg-white overflow-hidden"
            >
              <div className="w-full h-40 relative">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-3">
                <h2 className="font-semibold text-[16px]">{item.name}</h2>
                <p className="text-xs text-black/50 capitalize mt-[2px]">
                  {item.kategori}
                </p>

                <p className="text-orange-600 font-semibold mt-1">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>

                <button className="mt-3 w-full bg-orange-500 text-white text-sm py-1.5 rounded-lg active:scale-95 transition">
                  Tambah
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
