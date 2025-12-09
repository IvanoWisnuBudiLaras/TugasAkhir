// app/Contact/page.tsx
"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  // Lokasi Peta yang Diberikan Pengguna
  const mapIframe = (
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.3962936428916!2d111.90432829999999!3d-8.0609975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78e3883d262a45%3A0x3320391fce0ee139!2sSmoethie%20Vibe%20Tulungagung!5e0!3m2!1sen!2sid!4v1764280237324!5m2!1sen!2sid" 
      width="100%" // Mengubah lebar menjadi 100% agar responsif di dalam div
      height="450" 
      style={{ border: 0, borderRadius: '0.75rem' }} // Menambahkan style border dan rounded-xl
      allowFullScreen={true} 
      loading="lazy" 
      referrerPolicy="no-referrer-when-downgrade"
      title="Lokasi SmoethieVibe Cafe"
      className="shadow-lg"
    ></iframe>
  );

  return (
    // Padding atas (pt-24) untuk memberi ruang pada navbar tetap
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="text-center mb-12">
          <p className="text-sm font-semibold text-green-600 uppercase tracking-widest">
            Hubungi Kami
          </p>
          <h1 className="text-5xl font-extrabold text-gray-900 mt-2">
            Kontak SmoethieVibe
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Kami senang mendengar masukan Anda! Silakan hubungi kami melalui saluran berikut.
          </p>
        </header>

        {/* Contact Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Card 1: Nomor Telepon */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500 transition duration-300 transform hover:shadow-2xl">
            <Phone className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Telepon</h3>
            <p className="text-gray-600">
              Hubungi kami untuk pemesanan atau pertanyaan mendesak.
            </p>
            <Link 
              href="tel:+6281234567890" 
              className="mt-4 inline-block font-medium text-green-600 hover:text-green-700 transition"
            >
              +62 812-3456-7890
            </Link>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500 transition duration-300 transform hover:shadow-2xl">
            <Mail className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600">
              Untuk kemitraan, karir, atau umpan balik rinci.
            </p>
            <Link 
              href="mailto:info@smoethievibe.com" 
              className="mt-4 inline-block font-medium text-green-600 hover:text-green-700 transition"
            >
              info@smoethievibe.com
            </Link>
          </div>

          {/* Card 3: Lokasi Fisik */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500 transition duration-300 transform hover:shadow-2xl">
            <MapPin className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Alamat Kafe</h3>
            <p className="text-gray-600">
              Jl. Pangeran Antasari No.16, Kenayan, Tulungagung
            </p>
            {/* Tautan ke Peta (Opsional jika peta di bawah sudah jelas) */}
            <Link 
              href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.3962936428916!2d111.90432829999999!3d-8.0609975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78e3883d262a45%3A0x3320391fce0ee139!2sSmoethie%20Vibe%20Tulungagung!5e0!3m2!1sen!2sid!4v1764280237324!5m2!1sen!2sid" 
              target="_blank"
              className="mt-4 inline-block font-medium text-green-600 hover:text-green-700 transition"
            >
              Lihat di Peta
            </Link>
          </div>
        </section>

        {/* Operational Hours and Location Section */}
        <section className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Jam Operasional */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                <Clock className="w-7 h-7 text-orange-500" />
                Jam Operasional
              </h2>
              <ul className="text-lg text-gray-600 space-y-2">
                <li className="flex justify-between border-b border-gray-100 pb-1">
                    <span>Senin - Jumat:</span>
                    <span className="font-semibold text-gray-800">08:00 - 20:00</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-1">
                    <span>Sabtu:</span>
                    <span className="font-semibold text-gray-800">09:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                    <span>Minggu:</span>
                    <span className="font-semibold text-red-500">Tutup (Khusus Event)</span>
                </li>
              </ul>
            </div>

            {/* Peta Lokasi (Iframe Embed) */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Peta Lokasi
                </h2>
                {/* INI ADALAH BAGIAN YANG DIGANTI DENGAN IFRAME */}
                <div className="w-full">
                    {mapIframe}
                </div>
            </div>
            
          </div>
        </section>
        
      </div>
    </div>
  );
}