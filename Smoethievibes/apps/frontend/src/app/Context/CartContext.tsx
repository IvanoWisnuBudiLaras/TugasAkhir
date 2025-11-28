// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

// Tipe data untuk item keranjang
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    img: string;
}

// Tipe data untuk Context
interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, delta: number) => void;
    totalItems: number; // Jumlah total item (badge count)
}

// Default value (digunakan untuk inisialisasi)
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    // Gunakan state yang sama dari halaman Keranjang Anda
    const [items, setItems] = useState<CartItem[]>([]); 

    // Hitung total item untuk badge
    const totalItems = useMemo(() => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    // Fungsi untuk menambah item
    const addItem = (newItem: CartItem) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === newItem.id);
            if (existingItem) {
                // Jika sudah ada, tambahkan kuantitas
                return prevItems.map(item => 
                    item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
                );
            } else {
                // Jika item baru, tambahkan ke array
                return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
            }
        });
    };

    // Fungsi-fungsi lain (updateQuantity, removeItem) dapat disalin dari Cart/page.tsx
    const updateQuantity = (id: number, delta: number) => {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
            )
        );
    };

    const removeItem = (id: number) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };


    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom Hook untuk mempermudah penggunaan Context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};