// app/Kategori/types.ts

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  category?: Category;
  slug?: string;
  stock?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}