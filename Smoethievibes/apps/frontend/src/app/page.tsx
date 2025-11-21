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

      <section className="w-full flex justify-center">
        <div className="bg-[#ADB67A] text-white text-center rounded-2xl">
          <h1 className="text-4xl font-bold leading-relaxed">
            Welcome <br /> Smoethievibes
          </h1>
        </div>
      </section>

      <section className="w-full px-10 relative py-10">

        <div className="absolute left-0 top-10 w-40 h-56 bg-[#C79E8A] rounded-2xl blur-sm opacity-60"></div>
        <div className="absolute right-0 top-10 w-40 h-56 bg-[#C99479] rounded-2xl blur-sm opacity-60"></div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 z-10">
          {cafePlace.map((item, i) => (
            <div className="text-center px-4" key={i}>
              <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
              <p className="text-sm text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <div className="relative w-60 h-40 mx-auto mt-3 rounded-md bg-gray-300 overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.nama}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {menuItems.map((item, idx) => (
          <div className="text-center" key={idx}>
            <div className="relative w-32 h-40 bg-[#C56767] rounded-md mx-auto overflow-hidden">
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
