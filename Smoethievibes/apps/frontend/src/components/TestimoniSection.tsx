const testi = [
  {
    nama: "Wisnu Ibrahimma Fadhillah",
    rating: 5,
    img: "/Profile/Profil.jpeg",
    pesan:
      "Website UMKM Wong Kudus ini luar biasa! Desainnya clean dan informatif. Salut buat tim developernya!",
  },
  {
    nama: "Rayhan Fathurrahman Rabbani",
    rating: 5,
    img: "/Menu/green dream.png",
    pesan:
      "Keren banget! Website-nya bikin bangga produk lokal Kudus. Semoga makin maju terus UMKM di sini!",
  },
  {
    nama: "Suyuful Bitriq Alqowi",
    rating: 4,
    img: "/Menu/salad sayur.png",
    pesan: "Saya kagum. Website ini modern dan mudah digunakan!",
  },
];

export function TestimoniSection() {
  return (
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-6">Apa Kata Mereka?</h2>

      <p className="text-center text-gray-600 mb-12">
        Ulasan dan testimoni nyata dari para pengguna website kami
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {testi.map((t, i) => (
          <div key={i} className="text-center max-w-md mx-auto">
            <p className="italic text-gray-700 mb-4">"{t.pesan}"</p>

            <img
              src={t.img}
              className="w-20 h-20 rounded-full mx-auto border object-cover"
            />

            <h3 className="mt-3 font-semibold">{t.nama}</h3>

            <p className="text-yellow-400 text-lg">{"★".repeat(t.rating)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}