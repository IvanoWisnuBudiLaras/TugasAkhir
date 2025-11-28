// components/CartButton.tsx
"use client";

import React from 'react'; // Pastikan React diimport
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/Context/CartContext'; // Asumsi useCart ada

// 1. DEFINISI PROPS YANG BENAR
interface CartButtonProps {
    productId: number;
    productName: string;
    productPrice: number; // Tambahkan harga
    productImg: string;   // Tambahkan gambar
}

// 2. DEFINISI KOMPONEN YANG BENAR (Mengembalikan JSX.Element)
export function CartButton({ productId, productName, productPrice, productImg }: CartButtonProps): JSX.Element {
    const { addItem } = useCart(); 

    const handleAddToCart = () => {
        const newItem = { 
            id: productId, 
            name: productName, 
            price: productPrice, 
            img: productImg, 
            quantity: 1
        };
        
        addItem(newItem); 
        alert(`${productName} berhasil ditambahkan ke keranjang!`);
    };

    return (
        <button 
            onClick={handleAddToCart}
            className="p-3 bg-green-600 text-white rounded-full shadow-lg 
                       hover:bg-green-700 hover:shadow-xl transition-all duration-200 
                       flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-green-300"
            aria-label={`Tambahkan ${productName} ke keranjang`}
        >
            <ShoppingCart size={20} />
        </button>
    );
}