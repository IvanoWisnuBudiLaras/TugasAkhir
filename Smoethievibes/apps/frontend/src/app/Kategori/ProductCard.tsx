// app/Kategori/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { CartButton } from '@/components/CartButton';
import { AnimatedContent } from '@/components/animations';
import { useCart } from '@/app/Context/CartContext';
import { CartNotification } from '@/components/CartNotification';

interface Product {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  image?: string;
  images?: string[];
  stock: number;
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  category: {
    id: string;
    name: string;
    slug: string;
    image?: string;
  };
}

interface ProductCardProps {
  product: Product;
  index?: number;
  getImageUrl: (imagePath?: string) => string;
}

export default function ProductCard({ product, getImageUrl }: ProductCardProps) {
  const imageUrl = getImageUrl(product.image || (product.images && product.images[0]));
  const isOutOfStock = product.stock <= 0;
  const { items, addItem, updateQuantity } = useCart();
  const [notification, setNotification] = useState<string | null>(null);
  
  // Cek apakah produk sudah ada di cart
  const cartItem = items.find(item => item.id === parseInt(product.id));
  const quantityInCart = cartItem?.quantity || 0;
  
  // Fungsi untuk menambah quantity
  const handleIncrease = () => {
    if (quantityInCart > 0) {
      updateQuantity(parseInt(product.id), 1);
      setNotification(`${product.name} ditambahkan ke keranjang`);
    } else {
      addItem({
        id: parseInt(product.id),
        name: product.name,
        price: product.price,
        img: imageUrl,
        quantity: 1,
        stock: product.stock
      });
      setNotification(`${product.name} ditambahkan ke keranjang`);
    }
  };
  
  // Fungsi untuk mengurangi quantity
  const handleDecrease = () => {
    if (quantityInCart > 1) {
      updateQuantity(parseInt(product.id), -1);
    }
  };

  return (
    <>
      <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <AnimatedContent>
      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-green-100">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-orange-200 to-green-200 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No Image</p>
            </div>
          </div>
        )}
        
        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            Habis
          </div>
        )}
        
        {/* Quick Add to Cart */}
        {!isOutOfStock && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {quantityInCart === 0 ? (
              <CartButton
                productId={parseInt(product.id)}
                productName={product.name}
                productPrice={product.price}
                productImg={imageUrl}
                productStock={product.stock}
              />
            ) : (
              <div className="flex items-center bg-white rounded-full shadow-lg border">
                <button
                  onClick={handleDecrease}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-l-full transition-colors"
                  disabled={quantityInCart <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-2 text-sm font-semibold text-gray-700 min-w-[2rem] text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={handleIncrease}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-r-full transition-colors"
                  disabled={quantityInCart >= product.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <Link 
            href={`/produk/${product.slug || product.id}`}
            className="block hover:text-orange-600 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {product.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Category Badge */}
        <div className="mb-3">
          <Link 
            href={`/Kategori/${product.category.slug}`}
            className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors"
          >
            {product.category.name}
          </Link>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-orange-600">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-gray-500">
              Stok: {product.stock}
            </span>
          </div>
          
          {!isOutOfStock ? (
            <div className="flex items-center gap-2">
              {quantityInCart > 0 && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  {quantityInCart} di cart
                </span>
              )}
              <Link
                href={`/produk/${product.slug || product.id}`}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Detail
              </Link>
            </div>
          ) : (
            <span className="bg-gray-300 text-gray-500 px-3 py-1 rounded text-sm font-medium cursor-not-allowed">
              Habis
            </span>
          )}
        </div>
      </div>
        </AnimatedContent>
      </div>
  
      {/* Notification */}
      {notification && (
        <CartNotification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}