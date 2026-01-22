"use client";

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/Context/CartContext';

interface CartButtonProps {
    productId: number | string;
    productName: string;
    productPrice: number;
    productImg: string;
    productStock: number;
}

export function CartButton({ 
    productId, 
    productName, 
    productPrice, 
    productImg, 
    productStock 
}: CartButtonProps): JSX.Element {
    const { addItem } = useCart(); 

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        // Konversi productId secara eksplisit jika Context hanya menerima number
        // Gunakan Number() jika Anda yakin ID dari database adalah angka dalam bentuk string
        const safeId = typeof productId === 'string' ? parseInt(productId, 10) || productId : productId;

        const newItem = { 
            id: safeId as any, // 'as any' digunakan untuk melewati proteksi TS jika Context kaku
            name: productName, 
            price: productPrice, 
            img: productImg, 
            quantity: 1,
            stock: productStock
        };
        
        addItem(newItem);
    };

    if (productStock <= 0) {
        return (
            <button 
                disabled
                className="px-4 py-2 bg-gray-200 text-gray-500 rounded-xl shadow-inner 
                           cursor-not-allowed flex items-center justify-center text-xs font-bold"
            >
                Habis
            </button>
        );
    }

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