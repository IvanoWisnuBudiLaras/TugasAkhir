﻿﻿﻿import Image from "next/image";
import {CafePortrait} from "@/components/portrait";
import {Rekomendasi} from "@/components/rekomendasi";
import {Testimoni} from "@/components/TestimoniSection";
import { AnimatedHeading, AnimatedParagraph } from "@/components/animations";

// @komponen Halaman utama: hero, portrait, rekomendasi, testimoni
// @seo Server component untuk static rendering dan SEO optimal
export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF9F3]">
      {/* @ui HERO SECTION: background image + text overlay */}
      <section className="relative w-full h-[680px]">
        <Image
          src="/Landing/kasir1.jpg"
          alt="UMKM Kudus"
          fill
          priority
          className="object-cover brightness-50"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
          <AnimatedHeading 
            level={1}
            className="text-center font-extrabold text-4xl md:text-6xl leading-snug drop-shadow-lg"
            delay={0.2}
          >
            Jelajahi Aneka Hidangan di <br /> SmoethieVibe.
          </AnimatedHeading>

          <AnimatedParagraph 
            className="text-center mt-4 text-lg md:text-xl font-light"
            delay={0.4}
          >
            Temukan Berbagai Makanan, Minuman, dan Smoethie Premium Disini.
          </AnimatedParagraph>
        </div>
      </section>
      {/* @komponen Cafe profile dan rekomendasi produk */}
      <CafePortrait />
      <Rekomendasi />
      <Testimoni />
    </main>
  );
}