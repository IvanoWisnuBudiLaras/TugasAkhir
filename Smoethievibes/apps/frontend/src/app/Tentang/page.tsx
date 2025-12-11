// app/Tentang/page.tsx
"use client";

import Link from "next/link";
import { Coffee, Heart, Leaf, Sun, Zap } from "lucide-react";
import { AnimatedHeading, AnimatedParagraph, ScrollText } from "@/components/animations";

export default function AboutPage() {
  return (
    // Padding atas (pt-24) untuk memberi ruang pada navbar tetap
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="text-center mb-12">
          <AnimatedParagraph className="text-sm font-semibold text-green-600 uppercase tracking-widest" delay={0.1}>
            Temukan Kisah Kami
          </AnimatedParagraph>
          <AnimatedHeading className="text-5xl font-extrabold text-gray-900 mt-2" delay={0.2}>
            Tentang SmoethieVibe
          </AnimatedHeading>
          <AnimatedParagraph className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto" delay={0.4}>
            Tempat di mana kesehatan dan kelezatan bertemu. Kami menyajikan energi positif dalam setiap sajian.
          </AnimatedParagraph>
        </header>

        {/* Visi dan Misi Section */}
        <ScrollText className="bg-white shadow-xl rounded-2xl p-8 md:p-12 mb-12" delay={0.6}>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Visi Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-7 h-7 text-red-500" />
                Visi Kami
              </h2>
              <p className="mt-4 text-gray-600 text-lg leading-relaxed">
                Menjadi kafe makanan dan minuman sehat terdepan yang menginspirasi gaya hidup seimbang, menyediakan alternatif lezat yang mendorong energi dan vitalitas setiap hari.
              </p>
            </div>

            {/* Misi Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Leaf className="w-7 h-7 text-green-500" />
                Misi Kami
              </h2>
              <ul className="mt-4 space-y-3 text-gray-600 text-lg list-disc list-inside ml-4">
                <li>Menyediakan bahan berkualitas tinggi dan segar.</li>
                <li>Menciptakan menu smoothie, jus, dan makanan yang inovatif dan bergizi.</li>
                <li>Membangun komunitas yang mencintai kesehatan dan kesejahteraan.</li>
              </ul>
            </div>
          </div>
        </ScrollText>

        {/* --- */}

        {/* Nilai Inti (Core Values) */}
        <ScrollText className="text-center mb-12" delay={0.8}>
          <AnimatedHeading className="text-3xl font-bold text-gray-900 mb-8" delay={0.1}>
            Nilai Inti Kami
          </AnimatedHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Kualitas */}
            <ScrollText className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1" delay={0.2}>
              <Sun className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Segar & Alami</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Kami berkomitmen hanya menggunakan bahan-bahan paling segar dan alami, bebas dari bahan pengawet buatan.
              </p>
            </ScrollText>

            {/* Card 2: Energi */}
            <ScrollText className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1" delay={0.4}>
              <Zap className="w-10 h-10 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Pendorong Energi</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Setiap menu dirancang untuk memberi Anda dorongan energi yang Anda butuhkan untuk menjalani hari.
              </p>
            </ScrollText>

            {/* Card 3: Kenyamanan Cafe */}
            <ScrollText className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1" delay={0.6}>
              <Coffee className="w-10 h-10 text-brown-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Vibe Kafe Hangat</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Kami menciptakan ruang kafe yang nyaman, sempurna untuk bersantai, bekerja, atau bertemu teman.
              </p>
            </ScrollText>
          </div>
        </ScrollText>

        {/* --- */}
        
        {/* CTA (Call to Action) */}
        <ScrollText className="bg-green-600 text-white rounded-2xl p-10 text-center shadow-2xl" delay={1.0}>
          <AnimatedHeading className="text-3xl font-bold mb-4" delay={0.1}>
            Siap Mencicipi Vibe Kami?
          </AnimatedHeading>
          <AnimatedParagraph className="text-lg mb-6 opacity-90" delay={0.3}>
            Kunjungi menu kami dan temukan smoothie atau makanan sehat favorit Anda hari ini.
          </AnimatedParagraph>
          <Link 
            href="/Kategori"
            className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-full text-lg shadow-md hover:bg-gray-100 transition duration-300 transform hover:scale-105"
          >
            Lihat Menu Kami
          </Link>
        </ScrollText>
        
      </div>
    </div>
  );
}