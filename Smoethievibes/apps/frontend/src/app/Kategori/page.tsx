// app/Kategori/page.tsx
// URL: /Kategori

import MenuPage from './[id]/page'; 

// Halaman ini bertindak sebagai halaman utama yang menampilkan SEMUA MENU
// dengan cara memanggil komponen dinamis Page (MenuPage) dengan id='semua'.
export default function CategoryRootPage() {
  return <MenuPage params={{ id: 'semua' }} />;
}