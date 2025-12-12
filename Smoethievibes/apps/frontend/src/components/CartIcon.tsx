'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/Context/CartContext';
import { useAuth } from '@/lib/context';

export function CartIcon() {
    const { totalItems } = useCart();
    const { isAuthenticated } = useAuth();

    // Jika user belum login, jangan tampilkan jumlah item cart
    const displayItems = isAuthenticated ? totalItems : 0;

    return (
        <Link href="/Cart" className="relative flex items-center group">
            <ShoppingCart size={24} className="text-black/70 group-hover:text-black transition" />
            {displayItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {displayItems}
                </span>
            )}
        </Link>
    );
}