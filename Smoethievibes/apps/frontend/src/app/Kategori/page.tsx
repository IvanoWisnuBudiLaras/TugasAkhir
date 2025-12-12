// app/Kategori/page.tsx
// URL: /Kategori

<<<<<<< HEAD
import MenuPage from './[id]/page'; 

// Halaman ini bertindak sebagai halaman utama yang menampilkan SEMUA MENU
// dengan cara memanggil komponen dinamis Page (MenuPage) dengan id='semua'.
export default function CategoryRootPage() {
  return <MenuPage params={{ id: 'semua' }} />;
=======
import CategoryList from './CategoryList';

// Halaman ini menampilkan daftar semua kategori
export default function CategoryRootPage() {
  return <CategoryList />;
>>>>>>> parent of d49fd36 (Refactor backend and frontend to use REST API, add error handling)
}