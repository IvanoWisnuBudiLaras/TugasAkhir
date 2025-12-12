// components/CartBadge.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from "@/app/Context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";

export function CartBadge() {
    const { totalItems } = useCart();
    const { isAuthenticated } = useAuth();

    // Jika user belum login, jangan tampilkan jumlah item cart
    const displayItems = isAuthenticated ? totalItems : 0;

    return (
        <Link 
            href="/Cart" 
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={`Keranjang belanja, ${displayItems} item`}
        >
            <ShoppingCart size={24} className="text-gray-700" />
            
            {/* Badge hanya ditampilkan jika user login dan ada item */}
            {displayItems > 0 && (
                <span 
                    className="absolute top-0 right-0 inline-flex items-center justify-center 
                               h-5 w-5 text-xs font-bold leading-none text-white 
                               bg-red-500 rounded-full transform translate-x-1/4 -translate-y-1/4 
                               border-2 border-white"
                >
                    {displayItems}
                </span>
            )}
        </Link>
    );
}