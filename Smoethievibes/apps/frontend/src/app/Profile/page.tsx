import Image from "next/image";

export function Sectionone() {
  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 mb-3">
          <Image
            src="/Profile/Roti Bakar.png"
            alt="Profile"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Zunita</h1>
      </div>
    </>
  );
}

export function Sectiontree() {
  return (
    <>
   
      <div className="w-full p-8 border border-green-400 rounded-3xl shadow-sm flex flex-col gap-4">

        <h2 className="text-lg font-semibold text-green-700 mb-2">
          Informasi Akun
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium">zunita@gmail.com</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Password</p>
            <p className="font-medium">*****</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-medium">Zunita</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Username</p>
            <p className="font-medium">zunita</p>
          </div>
        </div>

      </div>
    </>
  );
}

export function Sectiontwo() {
  return (
    <>
      <div className="w-full p-6 border border-gray-400 rounded-3xl flex flex-col gap-3">
        <button className="bg-green-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-500 transition">
          History
        </button>

        <button className="bg-green-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-500 transition">
          Order
        </button>

        <button className="bg-green-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-500 transition">
          Settings
        </button>

        <button className="bg-green-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-500 transition">
          Contact
        </button>

        <button className="bg-green-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-500 transition">
          About
        </button>
      </div>
    </>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10">

      <Sectionone />

      <div className="w-full max-w-lg mx-auto space-y-8">

        <Sectiontree />

        <Sectiontwo />

      </div>
      
    </div>
  );
}
