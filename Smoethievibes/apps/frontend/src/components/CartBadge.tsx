// components/CartBadge.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from "@/app/Context/CartContext"; // Gunakan Context yang baru dibuat

export function CartBadge() {
    // Ambil totalItems dari Context
    const { totalItems } = useCart(); 

    return (
        <Link 
            href="/Cart" 
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={`Keranjang belanja, ${totalItems} item`}
        >
            <ShoppingCart size={24} className="text-gray-700" />
            
            {/* Badge Penanda Jumlah Item */}
            {totalItems > 0 && (
                <span 
                    className="absolute top-0 right-0 inline-flex items-center justify-center 
                               h-5 w-5 text-xs font-bold leading-none text-white 
                               bg-red-500 rounded-full transform translate-x-1/4 -translate-y-1/4 
                               border-2 border-white"
                >
                    {totalItems}
                </span>
            )}
        </Link>
    );
}