import Image from "next/image";

// Data produk
const products = [
  {
    id: 1,
    title: "strawberry matcha yougurt",
    price: "Rp 15.000",
    image: "/Menu/steawberry matcha yougurt.jpg",
  },
  {
    id: 2,
    title: "manggo matcha yougurt",
    price: "Rp 15.000",
    image: "/Menu/manggo matcha yougurt.jpg",
  },
  {
    id: 3,
    title: "strawberry dragon",
    price: "Rp 20.000",
    image: "/Menu/steawberry dragon smooth.png",
  },
  {
    id: 4,
    title: "verry berries",
    price: "Rp 25.000",
    image: "/Menu/very berry smoethie.png",
  },
  {
    id: 5,
    title: "cocoa peanut butter",
    price: "Rp 20.000",
    image: "/Menu/Cocoa Peanut Butter.jpg",
  },
  {
    id: 6,
    title: "green dream",
    price: "Rp 20.000",
    image: "/Menu/green dream.png",
  },
  {
    id: 7,
    title: "Mega manggo",
    price: "Rp 25.000",
    image: "/Menu/mega manggo.jpg",
  },
  {
    id: 8,
    title: "sunrise plate",
    price: "Rp 45.000",
    image: "/Menu/sunrise plate.png",
  },
  {
    id: 9,
    title: "crispy chiken up",
    price: "Rp 35.000",
    image: "/Menu/Crispy Chiken Up.png",
  },
  {
    id: 10,
    title: "Roasted Chiken Up",
    price: "Rp 35.000",
    image: "/Menu/Roasted Chiken UP (roasted potato).png",
  },
  {
    id: 11,
    title: "Vegetable Salad",
    price: "Rp 10.000",
    image: "/Menu/salad sayur.png",
  },
  {
    id: 12,
    title: "Mushrum sop",
    price: "Rp 18.000",
    image: "/Menu/mushrum saose.jpg",
  },
  {
    id: 13,
    title: "Creamy Avocado Salad",
    price: "Rp 15.000",
    image: "/Menu/avocado salad.png",
  },
  {
    id: 14,
    title: "Roti Bakar Tropicana Slim",
    price: "Rp 15.000",
    image: "/Menu/Roti bakar tropicana slim rasa crunchy chocolate.png",
  },
];

export default function DetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === Number(params.id));

  if (!product) {
    return <div className="p-10 text-center text-red-500">Produk tidak ditemukan!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="max-w-2xl bg-white shadow-lg rounded-lg p-6">
        {/* Image */}
        <div className="w-full h-72 bg-gray-200 flex items-center justify-center mb-6">
          <Image
            src={product.image}
            alt={product.title}
            width={250}
            height={250}
            className="rounded-lg object-cover"
          />
        </div>

        {/* Info */}
        <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
        <p className="text-xl font-bold text-green-600 mb-4">{product.price}</p>

        <p className="text-gray-600 mb-6">
          Nikmati hidangan segar dan lezat dari Smoothie Vibe. Dibuat dari bahan berkualitas dan
          sangat cocok untuk menemani harimu.
        </p>

        {/* Back Button */}
        <a
          href="/Menu"
          className="inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Kembali ke menu
        </a>
      </div>
    </div>
  );
}
