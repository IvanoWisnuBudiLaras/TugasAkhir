// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

// Tipe data untuk item keranjang
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    img: string;
    stock: number;
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

    // Log items to console whenever they change
    useEffect(() => {
        console.log("Cart items updated:", items);
    }, [items]);

    // Hitung total item untuk badge
    const totalItems = useMemo(() => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    // Fungsi untuk menambah item
    const addItem = (newItem: CartItem) => {
        if (newItem.stock <= 0) {
            // Optional: Tampilkan notifikasi bahwa stok habis
            console.warn(`Stok untuk ${newItem.name} habis.`);
            return; // Hentikan penambahan jika stok 0 atau kurang
        }

        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === newItem.id);
            if (existingItem) {
                // Jika sudah ada, tambahkan kuantitas, tapi jangan melebihi stok
                const newQuantity = existingItem.quantity + newItem.quantity;
                return prevItems.map(item => 
                    item.id === newItem.id 
                        ? { ...item, quantity: Math.min(newQuantity, item.stock) } // Batasi kuantitas dengan stok
                        : item
                );
            } else {
                // Jika item baru, tambahkan ke array
                return [...prevItems, { ...newItem, quantity: Math.min(newItem.quantity || 1, newItem.stock) }];
            }
        });
    };

    // Fungsi untuk update quantity
    const updateQuantity = (id: number, delta: number) => {
        setItems(prevItems => 
            prevItems.map(item => {
                if (item.id === id) {
                    const newQuantity = item.quantity + delta;
                    // Batasi kuantitas antara 1 dan stok yang tersedia
                    return { ...item, quantity: Math.max(1, Math.min(newQuantity, item.stock)) };
                }
                return item;
            })
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