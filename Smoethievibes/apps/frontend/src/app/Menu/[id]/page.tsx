"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from '@/app/Context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  description?: string;
};

// Fallback product data if backend is not reachable
const fallbackProducts: Product[] = [
  { id: 1, title: 'strawberry matcha yougurt', price: 15000, image: '/Menu/steawberry matcha yougurt.jpg' },
  { id: 2, title: 'manggo matcha yougurt', price: 15000, image: '/Menu/manggo matcha yougurt.jpg' },
  { id: 3, title: 'strawberry dragon', price: 20000, image: '/Menu/steawberry dragon smooth.png' },
];

export default function DetailPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const id = params.id;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        // normalize shape if needed
        setProduct({ id: data.id, title: data.name || data.title, price: data.price || data.price_number || 0, image: data.image || data.imageUrl || '/Menu/placeholder.png', description: data.description });
      } catch (err) {
        console.warn('Failed to fetch product from API, using fallback', err);
        const found = fallbackProducts.find(p => p.id === Number(params.id));
        setProduct(found || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-10 text-center text-red-500">Produk tidak ditemukan!</div>;

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.title, price: product.price, quantity, img: product.image });
    alert('Produk ditambahkan ke keranjang');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="max-w-2xl bg-white shadow-lg rounded-lg p-6">
        {/* Image */}
        <div className="w-full h-72 bg-gray-200 flex items-center justify-center mb-6">
          <Image
            src={product.image}
            alt={product.title}
            width={350}
            height={350}
            className="rounded-lg object-cover"
          />
        </div>

        {/* Info */}
        <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
        <p className="text-xl font-bold text-green-600 mb-4">Rp {product.price.toLocaleString('id-ID')}</p>

        <p className="text-gray-600 mb-6">{product.description || 'Nikmati hidangan segar dan lezat dari Smoethie Vibe.'}</p>

        <div className="flex items-center gap-4 mb-4">
          <label className="font-medium">Jumlah</label>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button className="px-3" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <div className="px-4">{quantity}</div>
            <button className="px-3" onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleAddToCart} className="px-4 py-2 bg-green-600 text-white rounded">Tambah ke Keranjang</button>
          <Link href="/Cart" className="px-4 py-2 bg-gray-800 text-white rounded">Lihat Keranjang</Link>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Link href="/Menu" className="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Kembali ke menu</Link>
        </div>
      </div>
    </div>
  );
}
