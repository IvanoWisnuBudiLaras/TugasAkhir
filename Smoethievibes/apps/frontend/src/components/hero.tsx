export default function Hero() {
  return (
    <section
      className="
        w-full h-screen 
        flex flex-col items-center justify-center 
        text-center
        px-6
      "
    >
      <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4">
        Selamat Datang
      </h1>

      <p className="text-lg md:text-xl text-gray-600 max-w-xl">
        Temukan pengalaman terbaik bersama Smoethie Vibe.
      </p>
    </section>
  );
}
