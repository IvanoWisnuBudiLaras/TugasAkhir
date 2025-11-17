import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10">
      
  
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 mb-3">
          <Image
            src="/Roti Bakar.png"
            alt="Profile"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Zunita Handayani</h1>
      </div>

      <div className="w-full max-w-md px-8">
        <h2 className="text-lg font-semibold border-b pb-2 border-gray-200 mb-4">
          Informasi Akun
        </h2>

        <div className="space-y-4">

       
          <div>
            <p className="text-gray-500 text-sm">Bergabung Sejak</p>
            <p className="font-medium">2023</p>
          </div>


          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium">zunita@gmail.com</p>
          </div>

        
          <div>
            <p className="text-gray-500 text-sm">Nomor Telepon</p>
            <p className="font-medium">+62 857 0171 5732</p>
          </div>

        
          <div>
            <p className="text-gray-500 text-sm">Alamat</p>
            <p className="font-medium">
              Jl. Melati, Kec.Kedungwaru, Kab.Tulungagung
            </p>
          </div>

      
          <div>
            <p className="text-gray-500 text-sm">Tanggal Lahir</p>
            <input
              type="date"
              className="mt-1 w-full border px-3 py-2 rounded-lg text-sm"
            />
          </div>

         
          <div>
            <p className="text-gray-500 text-sm mb-1">Jenis Kelamin</p>

            <div className="flex items-center gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="Perempuan" />
                <span>Perempuan</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="Laki-laki" />
                <span>Laki-laki</span>
              </label>
            </div>
          </div>

        </div>
      </div>

     
      <div className="w-full max-w-md px-8 mt-6 flex gap-3">
        <button className="bg-[#ff5722] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[#e14a1d] transition">
          Edit Profil
        </button>
        <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
          Keluar
        </button>
      </div>
    </div>
  );
}
