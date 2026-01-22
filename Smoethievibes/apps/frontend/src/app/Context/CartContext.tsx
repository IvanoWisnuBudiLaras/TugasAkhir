"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    img: string;
    stock: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, delta: number) => void;
    clearCart: () => void; // Tambahan: Untuk mengosongkan keranjang setelah checkout
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    // 1. Inisialisasi state dengan mencoba mengambil data dari LocalStorage
    const [items, setItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // 2. Load data saat pertama kali aplikasi dijalankan (Client-side only)
    useEffect(() => {
        const savedCart = localStorage.getItem('smoothievibes_cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error("Gagal memuat keranjang:", error);
            }
        }
        setIsInitialized(true);
    }, []);

    // 3. Simpan data ke LocalStorage setiap kali ada perubahan pada 'items'
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('smoothievibes_cart', JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const totalItems = useMemo(() => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    const addItem = (newItem: CartItem) => {
        if (newItem.stock <= 0) {
            console.warn(`Stok untuk ${newItem.name} habis.`);
            return;
        }

        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === newItem.id);
            if (existingItem) {
                const newQuantity = existingItem.quantity + (newItem.quantity || 1);
                return prevItems.map(item => 
                    item.id === newItem.id 
                        ? { ...item, quantity: Math.min(newQuantity, item.stock) }
                        : item
                );
            } else {
                return [...prevItems, { ...newItem, quantity: Math.min(newItem.quantity || 1, newItem.stock) }];
            }
        });
    };

    const updateQuantity = (id: number, delta: number) => {
        setItems(prevItems => 
            prevItems.map(item => {
                if (item.id === id) {
                    const newQuantity = item.quantity + delta;
                    return { ...item, quantity: Math.max(1, Math.min(newQuantity, item.stock)) };
                }
                return item;
            })
        );
    };

    const removeItem = (id: number) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};