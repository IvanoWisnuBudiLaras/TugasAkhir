import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      <section className="w-full flex justify-center py-16">
        <div className="bg-[#ADB67A] text-white text-center px-16 py-12 rounded-2xl">
          <h1 className="text-4xl font-bold leading-relaxed">
            Welcome <br /> Smoethievibes
          </h1>
        </div>
      </section>

      <section className="w-full px-10 relative py-10">

        <div className="absolute left-0 top-10 w-40 h-56 bg-[#C79E8A] rounded-2xl blur-sm opacity-60"></div>

        <div className="absolute right-0 top-10 w-40 h-56 bg-[#C99479] rounded-2xl blur-sm opacity-60"></div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 z-10">

          <div className="text-center px-4">
            <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="w-32 h-32 bg-gray-300 mx-auto mt-3 rounded-md"></div>
          </div>

          <div className="text-center px-4">
            <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="w-32 h-32 bg-gray-300 mx-auto mt-3 rounded-md"></div>
          </div>

          <div className="text-center px-4">
            <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="w-32 h-32 bg-gray-300 mx-auto mt-3 rounded-md"></div>
          </div>

        </div>
      </section>

      <section className="w-full bg-[#7E845A] py-12">
        <h2 className="text-center text-3xl text-white font-bold mb-8">
        Popular Menu
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 justify-items-center">
          
          <div className="text-center">
            <div className="relative w-32 h-40 bg-[#C56767] rounded-md mx-auto">
              <Image 
              src="/Landing/Crispy Chiken Up.png" 
              alt="Crispy Chicken Up"
              width={128}
              height={160}
              className="object-cover"
              />
              <p className="text-white text-sm mt-3">Crispy Chicken Up</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="relative w-32 h-40 bg-[#C56767] rounded-md mx-auto">
              <Image 
              src="/Landing/Roasted chiken Up with mashed potato.png" 
              alt="Roasted Chicken Up"
              width={128}
              height={160}
              className="object-cover"
              />
              <p className="text-white text-sm mt-2">Roasted Chicken Up</p>
            </div>
          </div>

          <div className="text-center">
            <div className="relative w-32 h-40 bg-[#C56767] rounded-md mx-auto">
              <Image
              src="/Landing/placeholder.png" 
              alt="Tenderloin Steak and Broccoli" 
              width={128}
              height={160}
              className="object-cover"
              />
            </div>
            <p className="text-white text-sm mt-2">Tenderloin Steak and Broccoli</p>
          </div>

          <div className="text-center">
            <div className="relative w-32 h-40 bg-[#C56767] rounded-md mx-auto">
              <Image
              src="/Landing/strawberry matcha yogurt.jpg" 
              alt="Strawberry Matcha Yogurt" 
              width={128}
              height={160}
              className="object-cover"
              />
            </div>
            <p className="text-white text-sm mt-2">Strawberry Matcha Yogurt</p>
          </div>

          <div className="text-center">
            <div className="relative w-32 h-40 bg-[#C56767] rounded-md mx-auto">
              <Image
              src="/Landing/placeholder.png" 
              alt="Pineberry Leacy" 
              width={128}
              height={160}
              className="object-cover"
              />
            </div>
            <p className="text-white text-sm mt-2">Pineberry Leacy</p>
          </div>

          <div className="text-center">
            <div className="relative w-32 h-40 bg-[#C56767] rounded-md mx-auto">
              <Image
              src="/Landing/placeholder.png" 
              alt="Avonana Blend" 
              width={128}
              height={160}
              className="object-cover"
              />
            </div>
            <p className="text-white text-sm mt-2">Avonana Blend</p>
          </div>

          <div className="text-center">
            <div className="relative w-32 h-40 bg-[#C56767] rounded-md mx-auto">
              <Image
              src="/Landing/placeholder.png" 
              alt="Dimsum Mentai" 
              width={128}
              height={160}
              className="object-cover"
              />
            </div>
            <p className="text-white text-sm mt-2">Dimsum Mentai</p>
          </div>

          <div className="text-center">
            <div className="relative w-32 h-40 bg-[#C56767] rounded-md mx-auto">
              <Image
              src="/Landing/placeholder.png" 
              alt="Mix Platter" 
              width={128}
              height={160}
              className="object-cover"
              />
            </div>
            <p className="text-white text-sm mt-2">Mix Platter</p>
          </div>

        </div>
      </section>
    </main>
  );
}
