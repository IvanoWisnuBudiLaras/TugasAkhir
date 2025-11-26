﻿import Image from "next/image";

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
  <main className="min-h-screen bg-white">
    <section className="relative w-full h-[500px]">
      <Image
      src="/Landing/kasir1.jpg"
      alt="Smoethie Vibes by Chilla"
      fill
      className="object-cover brightness-50"
      />
      
      <div className="absolute inset-20 font-serif flex flex-col gap-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug text-white">
          Welcome <br /> Smoethie Vibes
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-white">
        Cafe Smoethievibes menyediakan berbagai healthy food sejak 2023. <br />
        Senin – Kamis : 07.30 - 22.00 WIB <br />
        Weekend : 07.30 - 22.30 WIB
        </p>
      </div>
    </section>
      <MenuFav />
    </main>
  );
}

export function MenuFav() {
  return (
  <section className="w-full bg-[#7E845A] py-12">
    <h2 className="text-center text-3xl text-white font-bold mb-8">
    Popular Menu
    </h2>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
      {menuItems.map((item, idx) => (
        <div className="text-center" key={idx}>
          <div className="relative w-40 h-48 bg-[#C56767] rounded-md mx-auto overflow-hidden">
            <Image
            src={item.img}
            alt={item.nama}
            fill
            className="object-cover"
            />
          </div>
          
          <p className="text-white text-sm mt-2">{item.nama}</p>
        
        </div>
      ))}
    </div>
  </section>
  );
}
