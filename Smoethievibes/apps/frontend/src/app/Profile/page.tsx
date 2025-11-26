"use client";

import { useState } from "react";
import Image from "next/image";

export function Sectionone() {
  return (
    <div className="flex flex-col items-center mb-6 animate-fadeIn">
      <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 mb-3">
        <Image
          src="/Profile/Profil.jpeg"
          alt="Profile"
          width={96}
          height={96}
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-xl font-semibold text-gray-800">Zunita</h1>
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(""); // <-- penting

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-32 pb-10">
      <Sectionone />

      <div className="w-full max-w-lg mx-auto space-y-8">

        
        <div className="w-full p-8 border border-green-400 rounded-3xl shadow-sm bg-white">
          <h2 className="text-lg font-semibold text-green-700 mb-2">Informasi Akun</h2>

          <div className="space-y-4">
            <div>
              <p className="text-brown-800 text-sm">Email</p>
              <p className="font-medium text-brown-800">zunita@gmail.com</p>
            </div>

            <div>
              <p className="text-brown-800 text-sm">Password</p>
              <p className="font-medium text-brown-800">*****</p>
            </div>

            <div>
              <p className="text-brown-800 text-sm">Name</p>
              <p className="font-medium text-brown-800">Zunita</p>
            </div>

            <div>
              <p className="text-brown-800 text-sm">Username</p>
              <p className="font-medium text-brown-800">JJunnd</p>
            </div>
          </div>
        </div>

        <div className="w-full p-6 border border-gray-300 rounded-3xl flex flex-col gap-3 bg-white">
          <button
            onClick={() => setActiveTab("history")}
            className="bg-green-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-500 transition"
          >
            History
          </button>

          <button
            onClick={() => setActiveTab("customize")}
            className="bg-green-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-500 transition"
          >
            Customize
          </button>
        </div>

      
        {activeTab === "history" && (
          <div className="w-full p-8 border border-green-400 rounded-3xl shadow-sm bg-white animate-fadeIn">
            <p className="font-medium text-brown-800">Pesanan:</p>
            <p className="text-brown-800 text-sm">Makanan:</p>
            <p className="text-brown-800 text-sm">Minuman:</p>
            <p className="text-brown-800 text-sm">Snack:</p>

            <p className="text-brown-800 text-sm mt-4">Tanggal:</p>

            <p className="font-medium text-brown-800 mt-4">Total Pesanan:</p>
          </div>
        )}

        {activeTab === "customize" && (
          <div className="w-full p-8 border border-green-400 rounded-3xl shadow-sm bg-white animate-fadeIn">
            <div className="space-y-3">
              <p className="text-brown-800 text-sm">Email:</p>
              <p className="text-brown-800 text-sm">Password:</p>
              <p className="text-brown-800 text-sm">No.Telepon:</p>
              <p className="text-brown-800 text-sm">Nama:</p>
              <p className="text-brown-800 text-sm">Username:</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
