// Shared Types across the project 💖

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'customer' | 'admin';
  createdAt: Date;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// GraphQL Types
export interface GraphQLContext {
  user?: User;
  req: Request;
  res: Response;
}