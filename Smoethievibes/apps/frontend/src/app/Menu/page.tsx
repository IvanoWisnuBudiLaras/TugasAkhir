import Image from "next/image";

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
  }, {
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
    title:"Roti Bakar Tropicana Slim",
    price:"Rp 15.000",
    image:"/Menu/Roti bakar tropicana slim rasa crunchy chocolate.png",
  },
 
];


while (products.length < 16) {
  products.push({
    ...products[products.length % 4],
    id: products.length + 1,
  });
}

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-sm overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium px-3 py-2 rounded-full bg-gray-200">
              Smoothievibes
            </div>h

            <nav className="hidden md:flex gap-4 text-sm text-gray-600">
              <a className="hover:underline cursor-pointer">Home</a>
              <a className="hover:underline cursor-pointer">Menu</a>
              <a className="hover:underline cursor-pointer">Contact</a>
              <a className="hover:underline cursor-pointer">Profile</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Cari..."
              className="w-48 md:w-64 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button className="text-xs px-3 py-2 border rounded">Login</button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Popular Menu</h2>
            <div className="text-sm text-gray-500">
              Showing {products.length} items
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <article
                key={p.id}
                className="bg-white border rounded shadow-sm overflow-hidden"
              >
                <div className="h-36 bg-gray-200 flex items-center justify-center">
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={120}
                    height={120}
                    className="rounded object-cover"
                  />
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1">{p.title}</h3>
                  

                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{p.price}</div>
                    
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center text-sm text-gray-500 gap-4">
            <button className="px-3 py-1 border rounded">Prev</button>
            <button className="px-3 py-1 border rounded">1</button>
            <button className="px-3 py-1 border rounded">2</button>
            <button className="px-3 py-1 border rounded">Next</button>
          </div>
        </main>
      </div>
    </div>
  );
}
