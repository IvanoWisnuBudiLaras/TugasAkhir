﻿import Image from "next/image";
import {Portrait} from "@/components/portrait";
import {Rekomendasi} from "@/components/rekomendasi";
import MapSection from "@/components/MapSection";
import {TestimoniSection} from "@/components/TestimoniSection"; 

const menuItems = [
  { nama: "Roasted Chicken Up", img: "/Landing/Roasted chiken Up with mashed potato.png" },
  { nama: "Strawberry Matcha Yogurt", img: "/Landing/strawberry matcha yogurt.jpg" },
  { nama: "Dimsum Mentai", img: "/Landing/placeholder.png" },
];

const cafePlace = [
  { nama: "Kasir", img: "/Landing/kasir1.jpg" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF9F3]">
      {/* HERO SECTION */}
      <section className="relative w-full h-[680px]">
        <Image
          src="/Landing/kasir1.jpg"
          alt="UMKM Kudus"
          fill
          priority
          className="object-cover brightness-50"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
          <h1 className="text-center font-extrabold text-4xl md:text-6xl leading-snug drop-shadow-lg">
            Jelajahi Aneka Hidangan di <br /> SmoethieVibe.
          </h1>

          <p className="text-center mt-4 text-lg md:text-xl font-light">
            Temukan Berbagai Makanan, Minuman, dan Smoethie Premium Disini.
          </p>
        </div>
      </section>
      <Portrait />
      <Rekomendasi />
      <MapSection />
      <TestimoniSection />
    </main>
  );
}